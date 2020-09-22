const moment = require("moment");
const {feeds} = require("../../../core/elasticsearch");
const {FIELDS: ES_FEEDS_FIELDS, FIELDS_VALUES: ES_FIELDS_VALUES} = require("../../../core/elasticsearch/templates/index/feeds/v1");
const {feeds: feedsMongo} = require("../../../core/Mongo");
const ApiError = require("../ApiError");

const updatePost = {};

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
updatePost.validate = (req, res, next) => {
  const {privacy, feedId} = req.body;
  const userId = req.headers._id;
  if(ES_FIELDS_VALUES[ES_FEEDS_FIELDS.PRIVACY].PRIVATE !== privacy || !feedId) return next(new ApiError(400, 'E0010004'));

  const [_id, date] = feedId.split(':');

  const instance = feeds.forDate(date);
  instance.getById(feedId, {
    _source: [ES_FEEDS_FIELDS.AUTHOR]
  }, (error, result) => {
    if(result && result._source && result._source[ES_FEEDS_FIELDS.AUTHOR] === userId){
      req._instance = instance;
      req.body.updatedAt = moment().unix();
      next();
    }else{
      return next(new ApiError(400, 'E0020001'));
    }
  })
}

/**
* Updating in Mongo
* @param {*} req
* @param {*} res
* @param {*} next
*/
updatePost.updateInMongo = async (req, res, next) => {
  const _id = req.body.feedId.split(':')[0];
  try{
    await feedsMongo.instance.updatePrivacy(_id, req.body.privacy);
    next();
  }catch(e){
    return next(new ApiError(500, 'E0010002'))
  }
}

/**
* Updating in ES
* @param {*} req
* @param {*} res
* @param {*} next
*/
updatePost.updateInES = async(req, res, next) => {
  req._instance.updatePrivacy(req.body.feedId, req.body.privacy, (error, result) => {
    if(error){
      return next(new ApiError(500, 'E0010002'))
    }
    res.status(200).send();
    next();
  })
}

module.exports = updatePost;