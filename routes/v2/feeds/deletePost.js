const {feeds} = require("../../../core/elasticsearch");
const {FIELDS: ES_FEEDS_FIELDS} = require("../../../core/elasticsearch/templates/index/feeds/v1");
const ApiError = require("../ApiError");
const {feeds: feedsMongo} = require("../../../core/mongo");

const deletePost = {};

/**
* Validating the query params
* @param {*} req
* @param {*} res
* @param {*} next
*/
deletePost.validate = (req, res, next) => {
  const feedId = req.query.id;
  const userId = req.headers._id;

  if(!feedId || !userId) return next(new ApiError(400, 'E0010009'));

  const [_id, date] = feedId.split(':');

  const instance = feeds.forDate(date);
  instance.getById(feedId, {
    _source: [ES_FEEDS_FIELDS.AUTHOR]
  }, (error, result) => {
    if(result && result._source && result._source[ES_FEEDS_FIELDS.AUTHOR] === userId){
      req._instance = instance;
      next();
    }else{
      return next(new ApiError(400, 'E0020001'));
    }
  })
}

/**
* Deleting in Mongo
* @param {*} req
* @param {*} res
* @param {*} next
*/
deletePost.inMongo = async(req, res, next) => {
  const feedId = req.query.id;
  try{
    await feedsMongo.instance.deletePost(feedId.split(':')[0]);
    next();
  }catch(e){
    return next(new ApiError(400, 'E0010002'));
  }
}

/**
* Deleting in ES
* @param {*} req
* @param {*} res
* @param {*} next
*/
deletePost.inElastic = (req, res, next) => {
  const instance = req._instance;
  instance.deleteDoc(req.query.id, (error, result) => {
    if(error) return next(new ApiError(400, 'E0010002'));
    return res.status(200).send();
  })
}

module.exports = deletePost;