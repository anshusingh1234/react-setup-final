const {feeds} = require("../../core/elasticsearch");
const moment = require("moment");

const DEFAULT = {
  LIMIT: 10,
  PAGE: 1
}

const comments = {};


/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
comments.validateBody = (req, res, next) => {
  const userId = req.headers._id;
  const {feedId} = req.body;
  const page = req.body.page || DEFAULT.PAGE;
  const limit = req.body.limit || DEFAULT.LIMIT;
  
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


comments.list = async (req, res, next) => {
  const feedsInstance = feeds.forDate(moment().format("YYYY-MM-DD"));
  const searchResult  = await feedsInstance.searchFeed(req.headers._id, ["dkjnsjknjsdknjksdnsjkd"], []);
  res.status(200).send(searchResult);
  next();
}

module.exports = comments;