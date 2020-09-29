const moment = require("moment");
const async = require("async");
const {feeds} = require("../../../core/elasticsearch");
const {user} = require("./../../../core/Redis");
const {topics: topicMongo} = require("../../../core/mongo");
const { commonResponse: response } = require('../../../helper/commonResponseHandler')
const ApiError = require("../ApiError");
const { countBy } = require("lodash");


const DEFAULT = {
  LIMIT: 10,
  PAGE: 1
}

const topics = {
  /**
  * Validating JSON Body
  * @param {*} req
  * @param {*} res
  * @param {*} next
  */
  validateBody: (req, res, next) => {
    next();
  },

  list: async (req, res, next) => {
    const page = parseInt(req.query.page) || DEFAULT.PAGE;
    const limit = parseInt(req.query.limit) || DEFAULT.LIMIT;

    const params = { page, limit };

    const total = await topicMongo.instance.countTopics(params);
    const mongoResult = await topicMongo.instance.list(params);

    res.status(200).send( wrapper(total, mongoResult));
    next();
  }

};

var wrapper = (total, data) =>{
  return {
    total: total,
    response: data
  }

}


module.exports = topics;