const moment = require("moment");
const {feeds} = require("../../../core/elasticsearch");
const {FIELDS: ES_FEEDS_FIELDS, FIELDS_VALUES: ES_FIELDS_VALUES} = require("../../../core/elasticsearch/templates/index/feeds/v1");
const {feeds: feedsMongo} = require("../../../core/mongo");
const ApiError = require("../ApiError");

const createPost = {};

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
createPost.validateBody = (req, res, next) => {
  const {privacy, data} = req.body;
  if(!Object.values(ES_FIELDS_VALUES[ES_FEEDS_FIELDS.PRIVACY]).includes(privacy)) return next(new ApiError(400, 'E0010004'));

  if(!data || (!data.content && (!Array.isArray(data.media) || !data.media.length))) return next(new ApiError(400, 'E0010004'));

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

  const toAdd = {
    [feedsMongo.FIELDS.TYPE]: 'post',
    [feedsMongo.FIELDS.DATA]: req.body.data,
    [feedsMongo.FIELDS.AUTHOR]: req.headers._id,
    [feedsMongo.FIELDS.PRIVACY]: req.body.privacy,
    [feedsMongo.FIELDS.PRIVATE_TO]: req.body.privateTo,
    [feedsMongo.FIELDS.CREATED_AT]: req.body.createdAt,
    [feedsMongo.FIELDS.TAGGED_USERS]: req.body.taggedUsers,
    [feedsMongo.FIELDS.FEELINGS]: req.body.feelings,
    [feedsMongo.FIELDS.CHECK_IN_TEXT]: req.body.checkInText,
    [feedsMongo.FIELDS.CHECK_IN_GEO_POINTS]: req.body.checkInGroPoints,
    [feedsMongo.FIELDS.TAGGED_USERS]: req.body.taggedUsers,
  };
  const mongoResult = await feedsMongo.instance.insertPost(toAdd);
  mongoResult && mongoResult.originalData && (req._groupId = feedsMongo.instance.getStringFromObjectId(mongoResult.originalData._id));
  if(!req._groupId) return next(new ApiError(500, 'E0010002'));
  next();
}

/**
* Saving in ES
* @param {*} req
* @param {*} res
* @param {*} next
*/
createPost.saveInES = (req, res, next) => {
  const feedId = req._groupId;
  const toAdd = {
    [ES_FEEDS_FIELDS.FEED_ID]: feedId,
    [ES_FEEDS_FIELDS.TYPE]: 'post',
    [ES_FEEDS_FIELDS.DATA]: req.body.data,
    [ES_FEEDS_FIELDS.AUTHOR]: req.headers._id,
    [ES_FEEDS_FIELDS.PRIVACY]: req.body.privacy,
    [ES_FEEDS_FIELDS.PRIVATE_TO]: req.body.privateTo,
    [ES_FEEDS_FIELDS.CREATED_AT]: req.body.createdAt,
    [ES_FEEDS_FIELDS.TAGGED_USERS]: req.body.taggedUsers,
    [ES_FEEDS_FIELDS.FEELINGS]: req.body.feelings,
    [ES_FEEDS_FIELDS.CHECK_IN_TEXT]: req.body.checkInText,
    [ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS]: req.body.checkInGroPoints,
    [ES_FEEDS_FIELDS.TAGGED_USERS]: req.body.taggedUsers,
  }
  const feedsInstance = feeds.forDate(moment().format("YYYY-MM-DD"));
  feedsInstance.indexDoc(toAdd, (error, result) => {
    if(error) console.log(error)
    res.status(200).send();
    next();
  })
}

module.exports = createPost;