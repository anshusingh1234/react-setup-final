const moment = require("moment");
const {feeds} = require("../../../core/elasticsearch");
const {FIELDS: ES_FEEDS_FIELDS} = require("../../../core/elasticsearch/templates/index/feeds/v1");
const {comments: commentMongo} = require("../../../core/mongo");
const { commonResponse: response } = require('../../../helper/commonResponseHandler')
const validations  = require('./../../../helper/validations');
const ApiError = require("../ApiError");
const {user} = require("./../../../core/Redis");
const {comment:commentNotification} = require('./../../../services/notification/events');

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

  if(!feedId) return next(new ApiError(400, 'E0030004'));
  if(!comment) return next(new ApiError(400, 'E0030006'));
  if(validations.isAbusiveContent(comment))  return next(new ApiError(400, 'E0030001'));

  const [_id, date] = feedId.split(':');

  const instance = feeds.forDate(date);
  instance.getById(feedId,  {
    _source: [ES_FEEDS_FIELDS.AUTHOR]
  }, (error, result) => {
    if(result && result._source){
      req._instance = instance;
      req.body.createdAt = moment().unix();
      req._author = result._source[ES_FEEDS_FIELDS.AUTHOR];
      next();
    }
    else return next(new ApiError(400, 'E0010004'));
 })
}

/**
* Saving in Mongo
* @param {*} req
* @param {*} res
* @param {*} next
*/
add.saveInMongo = async (req, res, next) => {
  const userId = req.headers._id;
  const {feedId, comment, parentCommentId} = req.body;

  const toAdd = {
    [commentMongo.FIELDS.POST_ID]: feedId,
    [commentMongo.FIELDS.USER_ID]: userId,
    [commentMongo.FIELDS.PARENT_COMMENT_ID]: parentCommentId ? parentCommentId : 0,
    [commentMongo.FIELDS.COMMENT]: comment,
    [commentMongo.FIELDS.CREATED_AT]: req.body.createdAt,
    [commentMongo.FIELDS.UPDATED_AT]: req.body.createdAt
  };
  const mongoResult = await commentMongo.instance.insert(toAdd);
  req._userData = await user.getUserProfile(userId);
  req._commentId = mongoResult && mongoResult.originalData && mongoResult.originalData._id ? mongoResult.originalData._id : '';
  req._data =  mongoResult && mongoResult.originalData ? {...mongoResult.originalData, commentId:req._commentId} : {};
  if(!req._commentId) return next(new ApiError(400, 'E0010010'));
  else commentNotification.send(userId, req._author, feedId, req._commentId, comment);
  next();

}

/**
* Saving in ES
* @param {*} req
* @param {*} res
* @param {*} next
*/
add.saveInES = (req, res, next) => {
  const userId = req.headers._id;
  const {feedId} = req.body;
  req._instance.commentedBy(feedId, userId);
  req._instance.incrementCommentCount(feedId, 1);

  const response = wrapper(req._data, req._userData);
  
  res.status(200).send(response);
  next();
}

const wrapper = (data, userData) =>{
    return {
      response_message:'Comment added successfully!',
      comment:{
        commentId : data[commentMongo.FIELDS.ID],
        feedId: data[commentMongo.FIELDS.POST_ID],
        comment: data[commentMongo.FIELDS.COMMENT],
        createdAt: data[commentMongo.FIELDS.CREATED_AT],
        replies: [],
        reactionCount:0,
        topReactions:[],
        user: userData
      }
    }
}

module.exports = add;