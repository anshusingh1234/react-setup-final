const moment = require("moment");
const {feeds} = require("../../core/elasticsearch");
const {FIELDS, FIELDS_VALUES} = require("../../core/elasticsearch/templates/index/feeds/v1");

const createPost = {};

createPost.validateBody = (req, res, next) => {
  next();
}

createPost.saveInMongo = (req, res, next) => {
  req._groupId = moment().valueOf();
  if(req.body.privacy === 3){
    req.body[FIELDS.PRIVATE_TO] = req.body.privateTo || []
  }
  next();
}

createPost.saveInES = (req, res, next) => {
  const groupId = req._groupId;
  const feedsInstance = feeds.forDate(moment().format("YYYY-MM-DD"));
  feedsInstance.indexDoc({
    feed_id: groupId, ...req.body
  }, (error, result) => {
    res.status(200).send();
    next();
  })
}

module.exports = createPost;