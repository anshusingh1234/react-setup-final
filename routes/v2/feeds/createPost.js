const moment = require("moment");
const {feeds} = require("../../../core/elasticsearch");
const {FIELDS: ES_FEEDS_FIELDS, FIELDS_VALUES: ES_FIELDS_VALUES} = require("../../../core/elasticsearch/templates/index/feeds/v1");
const {feeds: feedsMongo} = require("../../../core/mongo");
const ApiError = require("../ApiError");
const multiparty = require("multiparty");
const C = require("../../../constants");
const {tagUser: tagUserPushNotification} = require("../../../services/notification/events");
const async = require('async');

const createPost = {};

createPost.formDataWrapper = (req, res, next) => {
  const form = new multiparty.Form();
  form.parse(req, (error, fields, files) => {
    if(error || !fields) return next(new ApiError(400, 'E0010004'));
    console.log("CREATE POST FORM DATA", fields)
    const type = (Array.isArray(fields.type) && fields.type[0]) ? fields.type[0] : undefined;
    const privacy = (Array.isArray(fields.privacy)) ? Number(fields.privacy[0]) : undefined ;
    const content = (Array.isArray(fields.content) && typeof fields.content[0] === 'string') ? fields.content[0]: undefined ;
    const checkInGeoPointsLat = (Array.isArray(fields.checkInGeoPointsLat) && fields.checkInGeoPointsLat[0]) ? fields.checkInGeoPointsLat[0] : undefined;
    const checkInGeoPointsLon = (Array.isArray(fields.checkInGeoPointsLon) && fields.checkInGeoPointsLat[0]) ? fields.checkInGeoPointsLon[0] : undefined;
    const checkInText = (Array.isArray(fields.checkInText) && typeof fields.checkInText[0] === 'string') ? fields.checkInText[0] : undefined;
    const taggedUsers = Array.isArray(fields.taggedUsers) ? fields.taggedUsers : undefined;
    const privateTo = Array.isArray(fields.privateTo) ? fields.privateTo : undefined;
    const feelings = (Array.isArray(fields.feelings) && typeof fields.feelings[0] === 'string') ? fields.feelings[0] : undefined;
    req.body = {
      "type": type,
      "data": {
        "content": content
      },
      "checkInGeoPoints": (checkInGeoPointsLat && checkInGeoPointsLon) ? [
        Number(checkInGeoPointsLat) ? Number(checkInGeoPointsLat) : 0.0,
        Number(checkInGeoPointsLon) ? Number(checkInGeoPointsLon) : 0.0
      ] : undefined,
      "checkInText": checkInText,
      "privacy": privacy,
      "feelings": feelings && Number(feelings),
      "taggedUsers": taggedUsers,
      "privateTo": privateTo
    }
    req._files = files;
    next();
  })
}


/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
createPost.validateBody = (req, res, next) => {
  console.log("CREATE POST JSON DATA", req.body)
  const {privacy, data} = req.body;
  const userId = req.headers._id;

  if(!Object.values(ES_FIELDS_VALUES[ES_FEEDS_FIELDS.PRIVACY]).includes(privacy)) return next(new ApiError(400, 'E0010004', {debug: ""}));

  if(data && data.media) delete data.media;
  if(Array.isArray(req._files)){
    const images = req._files.image || [];
    const videos = req._files.video || [];
    if((images.length + videos.length) > C.POST.MAX_MEDIA_ALLOWED) return next(new ApiError(400, 'E0010004', {debug: ""}));
  }

  //verifying check-ins starts
  if(Array.isArray(req.body.checkInGeoPoints)){
    if(req.body.checkInGeoPoints.length !== 2) return next(new ApiError(400, 'E0010004'));
    const _lat = req.body.checkInGeoPoints[0];
    const _lon = req.body.checkInGeoPoints[1];
    if(typeof _lat !== 'number' || typeof _lon !== 'number') return next(new ApiError(400, 'E0010004'));
    if(typeof req.body.checkInText !== 'string' || !req.body.checkInText.length) return next(new ApiError(400, 'E0010004'));
  }else{
    delete req.body.checkInGeoPoints;
    delete req.body.checkInText;
  }
  //verifying check-ins ends

  //verifying taggedUsers starts
  if(Array.isArray(req.body.taggedUsers)){
    req.body.taggedUsers = req.body.taggedUsers.filter(el => (typeof el === 'string' && el !== userId));
  }else{
    delete req.body.taggedUsers;
  }

  req.body.createdAt = moment().unix();
  next();
}

/**
* Saving in Mongo
* @param {*} req
* @param {*} res
* @param {*} next
*/
createPost.saveInMongo = async (req, res, next) => {
  if(req.body.privacy === ES_FIELDS_VALUES[ES_FEEDS_FIELDS.PRIVACY].CUSTOM){
    req.body[feedsMongo.FIELDS.PRIVATE_TO] = req.body.privateTo || []
  }
  req.body.data.media = req._media;

  const toAdd = {
    [feedsMongo.FIELDS.TYPE]: 'post',
    [feedsMongo.FIELDS.SUBTYPE]: 'post',
    [feedsMongo.FIELDS.DATA]: req.body.data,
    [feedsMongo.FIELDS.AUTHOR]: req.headers._id,
    [feedsMongo.FIELDS.PRIVACY]: req.body.privacy,
    [feedsMongo.FIELDS.PRIVATE_TO]: req.body.privateTo,
    [feedsMongo.FIELDS.CREATED_AT]: req.body.createdAt,
    [feedsMongo.FIELDS.TAGGED_USERS]: req.body.taggedUsers,
    [feedsMongo.FIELDS.FEELINGS]: req.body.feelings,
    [feedsMongo.FIELDS.CHECK_IN_TEXT]: req.body.checkInText,
    [feedsMongo.FIELDS.CHECK_IN_GEO_POINTS]: req.body.checkInGeoPoints,
    [feedsMongo.FIELDS.TAGGED_USERS]: req.body.taggedUsers,
    [feedsMongo.FIELDS.LANGUAGE]: req.headers.language || 'en',
  };
  const mongoResult = await feedsMongo.instance.insertPost(toAdd);
  mongoResult && mongoResult.originalData && (req._id = feedsMongo.instance.getStringFromObjectId(mongoResult.originalData._id));
  if(!req._id) return next(new ApiError(500, 'E0010002', {debug: "mongo _id missing"}));
  next();
}

/**
* Saving in ES
* @param {*} req
* @param {*} res
* @param {*} next
*/
createPost.saveInES = (req, res, next) => {
  const _dateRef = moment().format("YYYY-MM-DD");
  const feedId = `${req._id}:${_dateRef}`;
  req._feedId = feedId;
  const toAdd = {
    [ES_FEEDS_FIELDS.FEED_ID]: feedId,
    [ES_FEEDS_FIELDS.TYPE]: 'post',
    [ES_FEEDS_FIELDS.SUB_TYPE]: 'post',
    [ES_FEEDS_FIELDS.DATA]: req.body.data,
    [ES_FEEDS_FIELDS.AUTHOR]: req.headers._id,
    [ES_FEEDS_FIELDS.PRIVACY]: req.body.privacy,
    [ES_FEEDS_FIELDS.PRIVATE_TO]: req.body.privateTo,
    [ES_FEEDS_FIELDS.CREATED_AT]: req.body.createdAt,
    [ES_FEEDS_FIELDS.TAGGED_USERS]: req.body.taggedUsers,
    [ES_FEEDS_FIELDS.FEELINGS]: req.body.feelings,
    [ES_FEEDS_FIELDS.CHECK_IN_TEXT]: req.body.checkInText,
    [ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS]: req.body.checkInGeoPoints,
    [ES_FEEDS_FIELDS.LANGUAGE]: req.headers.language,
  }
  const feedsInstance = feeds.forDate(_dateRef);
  feedsInstance.indexDoc(toAdd, (error, result) => {
    if(error){
      return next(new ApiError(500, 'E0010002', {debug: error}))
    }
    next();
  })
}

createPost.buildResponse = (req, res, next) => {
  res.status(200).send({
    message: "Succesfully posted!",
    data: {
      id: req._feedId
    }
  });
  next();
}

createPost.tagPushNotification = (req, res, next) => {
  next();
  if(Array.isArray(req.body.taggedUsers)){
    let scripts = [];
    req.body.taggedUsers.forEach(to => {
      scripts.push(cb => tagUserPushNotification.send(req._userId, to, req._feedId).then(() => cb()))
    })
    async.parallelLimit(scripts, 10, () => {});
  }
}

module.exports = createPost;