const moment = require("moment");
const {feeds} = require("../../../core/elasticsearch");
const {FIELDS: ES_FEEDS_FIELDS, FIELDS_VALUES: ES_FIELDS_VALUES} = require("../../../core/elasticsearch/templates/index/feeds/v1");
const ApiError = require("../ApiError");

const report = {};

report.validate = (req, res, next) => {
  const userId = req.headers._id;
  const {feedId} = req.body;

  if(!feedId || !userId) return next(new ApiError(400, 'E0010009'));
  next();
}

/**
* saving the user id in es and changing the status based on max reports allowed
* @param {*} req
* @param {*} res
* @param {*} next
*/
report.save = async(req, res, next) => {
  const userId = req.headers._id;
  const feedId = req.body.feedId;

  const instance = feeds.forId(feedId);
  try{
    await instance.reportPost(feedId, userId);
    res.status(200).send();
    next();
  }catch(e){
    return next(new ApiError(400, "E0010002", {debug: e}));
  }
}

module.exports = report;