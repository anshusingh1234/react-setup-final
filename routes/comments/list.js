const moment = require("moment");
const {feeds} = require("../../core/elasticsearch");
const {comments: commentMongo} = require("../../core/mongo");
const { commonResponse: response } = require('../../helper/commonResponseHandler')


const DEFAULT = {
  LIMIT: 10,
  PAGE: 1
}

const comments = {
  /**
  * Validating JSON Body
  * @param {*} req
  * @param {*} res
  * @param {*} next
  */
  validateBody: (req, res, next) => {
    const {feedId} = req.query;
    
    if(!feedId) return response(res, 400, null, "invalid/missing feedId");  
  
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
  },

  list: async (req, res, next) => {
    const feedId = req.query.feedId;
    const page = parseInt(req.query.page) || DEFAULT.PAGE;
    const limit = parseInt(req.query.limit) || DEFAULT.LIMIT;
  
    const params = { feedId, page, limit };
    
    const mongoResult = await commentMongo.instance.list(params);
    res.status(200).send(wrapper(mongoResult));
    next();
  }

};

const wrapper = (data) =>{
  return data.map(_obj => {
    return {
      "feedId": _obj[commentMongo.FIELDS.POST_ID],
      "userId": _obj[commentMongo.FIELDS.USER_ID],
      "comment": _obj[commentMongo.FIELDS.COMMENT],
      "createdAt": +_obj[commentMongo.FIELDS.CREATED_AT],
      "replies": [],
      "user":[]
    }
  })
}


module.exports = comments;