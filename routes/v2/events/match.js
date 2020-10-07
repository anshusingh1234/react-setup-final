const moment = require("moment");
const async = require("async");
const {feeds} = require("../../../core/elasticsearch");
const {user} = require("./../../../core/Redis");
const {topics: topicMongo} = require("../../../core/mongo");
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
    const {eventType, age, gender} = req.params;
    const userId = req.headers._id;

    if(!eventType) return next(new ApiError(400, 'E0070001'));
    if(!age) return next(new ApiError(400, 'E0070002'));
    if(!gender) return next(new ApiError(400, 'E0070003'));
    
    next();
  },

  search: async (req, res, next) => {
    
    // const page = parseInt(req.query.page) || DEFAULT.PAGE;
    // const limit = parseInt(req.query.limit) || DEFAULT.LIMIT;
    // const language = req.query.language;
    const config = {

    }
    res.status(200).send(config);
    next();
  }

};

module.exports = match;