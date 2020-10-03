const {feeds} = require("../../../core/elasticsearch");
const moment = require("moment");
const C = require("../../../constants");
const TYPES_ALLOWED = Object.values(C.TIMELINE.TYPES_ALLOWED);
const {FIELDS: ES_FEEDS_FIELDS} = require("../../../core/elasticsearch/templates/index/feeds/v1");
const ApiError = require("../ApiError");


const stats = {};

stats.validate = (req, res, next) => {
  next();
}

stats.getGlobalStats = async (req, res, next) => {
  const stats = {
    usersCount:10,
    winnersRemaining: 1000-10
  }
  req._globalStats = stats;
  next();
}

stats.getPrivateStats = async (req, res, next) => {
  const privateStats = {
    friendsInvited: 3,
    activeDays:10,
    eventsHosted:4,
    eventsAttended:3
  }

  const response = {
    stats:{
      global: req._globalStats,
      private: privateStats
    }
  }
  res.status(200).send(response);
  next();
}

module.exports = stats;