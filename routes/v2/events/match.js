const moment = require("moment");
const async = require("async");
const {feeds} = require("../../../core/elasticsearch");
const {event, user} = require("./../../../core/Redis");
const ApiError = require("../ApiError");
const C = require("../../../constants");


const match = {
  /**
  * Validating JSON Body
  * @param {*} req
  * @param {*} res
  * @param {*} next
  */
  validateBody: (req, res, next) => {
    const {eventType, age, gender, topicId} = req.query;

    if(!eventType) return next(new ApiError(400, 'E0070001'));
    if(!age) return next(new ApiError(400, 'E0070002'));
    if(!gender) return next(new ApiError(400, 'E0070003'));
    if(C.EVENTTYPE_ALLOWED.indexOf(eventType) == -1) return next(new ApiError(400, 'E0070001'));
    next();
  },

  oneToOneSearch: async(req, res, next) =>{
    const {eventType, age, gender, topicId} = req.query;
    const userId = req.headers._id;

    if(eventType == 'ONLINE_GENERAL'){
      let matchParams = {eventType, age, gender, topicId, userId};
      const peopleRequired = 2;
      let userMatched = [], userProfiles = [];

      async.series({
        saveMatch: cb =>{
          event.saveMatch(matchParams).then(res=>{
            cb();
          })
        },
        checkMatchComplete: cb => {
          event.checkMatchComplete(peopleRequired, matchParams).then(res=>{
            userMatched = res;
            cb();
          })
        },
        saveMatch: cb =>{
          if(!userMatched.length){
            event.saveMatch(matchParams).then(res=>{
              cb();
            })
          }
          else cb();
        },
        getUserProfiles: cb =>{
          if(userMatched.length){
            const userIDs = userMatched.map(id=>JSON.parse(id)).filter(indivID=>indivID!==userId);
            user.getAllUsersProfile(userIDs).then(res=>{
              userProfiles = [...res.values()];
              cb();
            })
          }
          else cb();
        }
      },
      (error, result) => {
        const response = {
          waitTime: userMatched.length ? 0 : C.EVENT_MATCH_WAITTIME,
          userMatch:userProfiles
        }
        res.status(200).send(response);
        next();
      })
    }

    else{
      res.status(200).send(response);
      next();
    }
  },

};

module.exports = match;