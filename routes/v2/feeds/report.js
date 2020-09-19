const moment = require("moment");
const {feeds} = require("../../../core/elasticsearch");
const {FIELDS: ES_FEEDS_FIELDS, FIELDS_VALUES: ES_FIELDS_VALUES} = require("../../../core/elasticsearch/templates/index/feeds/v1");
const ApiError = require("../ApiError");

const report = {};

report.validate = (req, res, next) => {
  const userId = req.headers._id;
  const feedId = req.query.id;

  if(!feedId || !userId) return next(new ApiError(400, 'E0010009'));
  next();
}

/**
* saving the user id in es and changing the status based on max reports allowed
* @param {*} req
* @param {*} res
* @param {*} next
*/
report.save = (req, res, next) => {
  const userId = req.headers._id;
  const feedId = req.query.id;

  const instance = feeds.forId(feedId);
  instance.reportPost(feedId, userId, (error, result) => {
    if(error) return next(new ApiError(400, "E0010002"));
    res.status(200).send();
    next();
  })
}

module.exports = report;