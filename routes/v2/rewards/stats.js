const async = require("async");
const moment = require("moment");
const {feeds} = require("../../../core/elasticsearch");
const {users: userMongo} = require("../../../core/mongo");
const {events: eventMongo} = require("../../../core/mongo");
const ApiError = require("../ApiError");

const stats = {};

stats.validate = (req, res, next) => {
  next();
}

stats.getGlobalStats = async (req, res, next) => {
  let usersCount, rewardsCount;

  async.series({
    users: cb => {
      userMongo.instance.countUsers().then(res=>{
        usersCount = res;
        cb();
      })
    },
    rewards: cb => {
      const instance = feeds.currentWeekInstance(); 
      instance.totalRewards().then(res=>{
        rewardsCount = res;
        cb();
      })
    },
  },
  (error, result) => {
    const stats = {
      usersCount,
      winnersRemaining: 1000-rewardsCount
    }
    req._globalStats = stats;
    next();
  })
}

stats.getPrivateStats = async (req, res, next) => {
  const userId = req.headers._id;
  let userDetails, friendsInvited, eventsHosted, eventsAttended;

  async.series({
    userDetails: cb => {
      userMongo.instance.fullDetail(userId).then(res=>{
        userDetails = res;
        cb();
      })
    },
    friendsInvited: cb => {
      userMongo.instance.getReferredCount(userId).then(res=>{
        friendsInvited = res;
        cb();
      })
    },
    eventsHosted: cb => {
      eventMongo.instance.countEvents(userId).then(res=>{
        eventsHosted = res;
        cb();
      })
    },
    eventsAttended: cb => {
      eventMongo.instance.countEventsAttended(userId).then(res=>{
        eventsAttended = res;
        cb();
      })
    },
  },
  (error, result) => {
    const startDate = moment(userDetails.createdAt);
    const activeDays = moment().diff(startDate, 'days');

    const privateStats = {
      friendsInvited,
      activeDays,
      eventsHosted,
      eventsAttended
    }
  
    const response = {
      stats:{
        global: req._globalStats,
        private: privateStats
      }
    }
    res.status(200).send(response);
    next();
  })
}

module.exports = stats;