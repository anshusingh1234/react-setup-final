const moment = require("moment");
const {feeds} = require("../../../core/elasticsearch");
const {comments: commentMongo} = require("../../../core/mongo");
const { commonResponse: response } = require('../../../helper/commonResponseHandler')
const validations  = require('./../../../helper/validations');
const ApiError = require("../ApiError");

const add = {};

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
add.validateBody = (req, res, next) => {
  const {entityId, entityType, reactionType} = req.body;
  
  if(!entityId) return response(res, 400, null, "invalid/missing entityId");
  if(!entityType) return response(res, 400, null, "invalid/missing entityType");
  if(!reactionType) return response(res, 400, null, "invalid/missing reactionType");

  next();
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
  req._commentId = mongoResult && mongoResult.originalData && mongoResult.originalData._id ? mongoResult.originalData._id : '';
  req._data =  mongoResult && mongoResult.originalData ? {...mongoResult.originalData, commentId:req._commentId} : {};
  if(!req._commentId) return next(new ApiError(400, 'E0010010'));
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
  return response(res, 200, req._data, "Comment Posted Successfully!");
}

module.exports = add;