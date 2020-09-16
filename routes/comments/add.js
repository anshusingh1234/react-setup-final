const moment = require("moment");
const {feeds} = require("../../core/elasticsearch");
const {FIELDS: ES_FEEDS_FIELDS, FIELDS_VALUES: ES_FIELDS_VALUES} = require("../../core/elasticsearch/templates/index/feeds/v1");
const {feeds: feedsMongo} = require("../../core/mongo");
const { commonResponse: response } = require('../../helper/commonResponseHandler')
const validations  = require('./../../helper/validations');

const add = {};

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
add.validateBody = (req, res, next) => {
  const userId = req.headers._id;
  const {feedId, comment} = req.body;
  
  if(!feedId) return response(res, 400, null, "invalid/missing feedId");
  if(!userId) return response(res, 400, null, "invalid/missing userId");
  if(!comment) return response(res, 400, null, "invalid/missing comment");
  if(!validations.isAbusiveContent(comment)) return response(res, 400, null, "Restricted Comment");

  const [_id, date] = feedId.split(':');

  const instance = feeds.forDate(date);
  instance.getById(feedId, {}, (error, result) => {
    if(result && result._source){
      req._instance = instance;
      next();
    }
    else{
      return response(res, 400, null, "Post not found");
    }
  })
}

/**
* Saving in Mongo
* @param {*} req
* @param {*} res
* @param {*} next
*/
add.saveInMongo = async (req, res, next) => {
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
  if(!req._groupId) return response(res, 400, null, "Something went wrong");
  next();
}

/**
* Saving in ES
* @param {*} req
* @param {*} res
* @param {*} next
*/
add.saveInES = (req, res, next) => {
  const commentByResult = 

  req.instance.commentedBy(feedId, userId).then(result => {
    req.instance.incrementCommentCount(feedId, 1).then(result => {
      next();
    }, err=>{

    })
  }, err=>{

  })
}

module.exports = createPost;