const moment = require("moment");
const async = require("async");
const {user} = require("./../../../core/Redis");
const {users: userMongo} = require("../../../core/mongo");
const ApiError = require("../ApiError");

const username = {

  validate: (req, res, next) => {
    const {username} = req.query;
    if(!username) return next(new ApiError(400, 'E0060004'))
    next();
  },

  suggest: async (req, res, next) => {
    const {username} = req.query;
    const formattedUsername = username.replace(/\s/g,'');

    const response = {
      username,
      isAvailable: false,
      suggestions:[
        `${formattedUsername}1`,
        `${formattedUsername}2`,
        `${formattedUsername}3`
      ]
    }

    res.status(200).send(response);
    next();
  }

};


module.exports = username;