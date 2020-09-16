const { commonResponse: response } = require('../../helper/commonResponseHandler')
const {feeds} = require("../../core/elasticsearch");
const {FIELDS: ES_FEEDS_FIELDS} = require("../../core/elasticsearch/templates/index/feeds/v1");

const deleteComment = {};

deleteComment.validate = (req, res, next) => {
  const feedId = req.query.id;
  const userId = req.headers._id;

  if(!feedId || !userId) return response(res, 400, null, "invalid/missing params");

  const [_id, date] = feedId.split(':');

  const instance = feeds.forDate(date);
  instance.getById(feedId, {}, (error, result) => {
    if(result && result._source){
      req._instance = instance;
      next();
    }else{
      return response(res, 400, null, "Post not found");
    }
  })
}

deleteComment.inMongo = async(req, res, next) => {
  next();
}

deleteComment.inElastic = (req, res, next) => {
  const instance = req._instance;
  instance.deleteDoc(req.query.id, (error, result) => {
    if(error) return response(res, 400, null, "Something went wrong");
    return response(res, 200, null, "Post successfully deleted");
  })
}

module.exports = deleteComment;