const moment = require("moment");
const {feeds} = require("../../core/elasticsearch");
const {comments: commentMongo} = require("../../core/mongo");
const { commonResponse: response } = require('../../helper/commonResponseHandler')
const validations  = require('./../../helper/validations');

const edit = {};

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
edit.validateBody = (req, res, next) => {
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
      req.body.updatedAt = moment().unix();
      next();
    }
    else{
      return response(res, 400, null, "Post not found");
    }
 })
}

edit.verifyOwner = async(req, res, next) => {
 const commentId = req.body.id;
 const userId = req.headers._id;
 const commentOwner = await commentMongo.instance.getOwner(commentMongo.instance.getObjectIdFromString(commentId)); 
 console.log('OWNEERERERE', commentOwner, commentId, userId);
  if(commentOwner && commentOwner[commentMongo.FIELDS.USER_ID] && commentOwner[commentMongo.FIELDS.USER_ID] == userId){
    next();
  }
  else{
    return response(res, 400, null, "Not authorised to modify this comment");
  }
},

/**
* Update values in Mongo
* @param {*} req
* @param {*} res
* @param {*} next
*/
edit.updateInMongo = async (req, res, next) => {
  const {id, comment} = req.body;

  const commentId =  commentMongo.instance.getObjectIdFromString(id);
  const params = {
    [commentMongo.FIELDS.COMMENT]: comment,
    [commentMongo.FIELDS.UPDATED_AT]: req.body.updatedAt
  };
  const mongoResult = await commentMongo.instance.update(commentId, params);

  if(mongoResult && mongoResult.ok){
    return response(res, 200, null, "Comment Updated Successfully!");
  }
  else return response(res, 400, null, "Something went wrong!");
}

module.exports = edit;