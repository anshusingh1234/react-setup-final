const moment = require("moment");
const {feeds} = require("../../core/elasticsearch");
const {comments: commentMongo} = require("../../core/mongo");
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
  if(validations.isAbusiveContent(comment)) return response(res, 400, null, "Restricted Comment");

  const [_id, date] = feedId.split(':');

  const instance = feeds.forDate(date);
  instance.getById(feedId, {}, (error, result) => {
    if(result && result._source){
      req._instance = instance;
      req.body.createdAt = moment().unix();
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
  if(!req._commentId) return response(res, 400, mongoResult.originalData, "Something went wrong");
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

  req._instance.commentedBy(feedId, userId).then(result => {
    req._instance.incrementCommentCount(feedId, 1).then(result => {
      next();
      return response(res, 200, req._data, "Comment Posted Successfully!");
    }, err=>{

    })
  }, err=>{

  })
}

module.exports = add;