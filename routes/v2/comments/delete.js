const { commonResponse: response } = require('../../../helper/commonResponseHandler')
const {FIELDS: ES_FEEDS_FIELDS} = require("../../../core/elasticsearch/templates/index/feeds/v1");
const {feeds} = require("../../../core/elasticsearch");
const {comments: commentMongo} = require("../../../core/mongo");
const ApiError = require("../ApiError");

const deleteComment = {


  /**
  * Validate query params + feed on elastic search
  */
  validateBody: async(req, res, next) => {
    const commentId = req.query.id;
    const feedId = req.query.feedId;
    const userId = req.headers._id;

    if(!feedId) return response(res, 400, null, "invalid/missing feedId");
    if(!commentId) return response(res, 400, null, "invalid/missing id");

    const [_id, date] = feedId.split(':');
    const instance = feeds.forDate(date);
    instance.getById(feedId, {
      _source: [ES_FEEDS_FIELDS.AUTHOR]
    }, (error, result) => {
      if(result && result._source){
        req._instance = instance;
        req._author = result._source[ES_FEEDS_FIELDS.AUTHOR] === userId ? userId : '';
        next();
      }
      else return next(new ApiError(400, 'E0010004'));
    })
  },

  /**
  * Verify if valid user is deleted this comment
  */
  verifyOwner: async(req, res, next) => {
    const commentId = req.query.id;
    const userId = req.headers._id;
    if(req._author == userId){
      next();
    }
    else{
      const commentOwner = await commentMongo.instance.getOwner(commentMongo.instance.getObjectIdFromString(commentId));
      if(commentOwner && commentOwner[commentMongo.FIELDS.USER_ID] && commentOwner[commentMongo.FIELDS.USER_ID] == userId){
        next();
      }
      else return next(new ApiError(400, 'E0030003'));
    }
  },

  /**
  * Delete comment from Mongo
  */
  inMongo: async(req, res, next) => {
    const commentId = req.query.id;
    const params = {
      [commentMongo.FIELDS.ID]: commentMongo.instance.getObjectIdFromString(commentId)
    };
    const mongoResult = await commentMongo.instance.delete(params);
    if(mongoResult && mongoResult.ok){
      next();
    }
    else return next(new ApiError(400, 'E0010010'));
  },

  /**
  * Decrement specific count in elastic
  */
  inElastic: (req, res, next) => {
    const feedId = req.query.feedId;
    req._instance.decrementCommentCount(feedId, 1).then(result => {
      next();
      return response(res, 200, null, "Comment Deleted Successfully!");
    }, err=>{

    })
  }
};


module.exports = deleteComment;