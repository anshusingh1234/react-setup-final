const moment = require("moment");
const async = require("async");
const {feeds} = require("../../../core/elasticsearch");
const {user} = require("./../../../core/Redis");
const {users: userMongo} = require("../../../core/mongo");
const { commonResponse: response } = require('../../../helper/commonResponseHandler')
const ApiError = require("../ApiError");
const { countBy } = require("lodash");


const DEFAULT = {
  LIMIT: 10,
  PAGE: 1
}

const users = {

  list: async (req, res, next) => {
    const mongoResult = await userMongo.instance.list({});
    res.status(200).send(mongoResult);
    next();
  }

};


module.exports = users;