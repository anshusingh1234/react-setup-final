const moment = require("moment");
const async = require("async");
const {users: userMongo} = require("../../../core/mongo");
const ApiError = require("../ApiError");

const mirrorfly = {

  validate: (req, res, next) => {
    const {mirroflyId} = req.body;
  
    if(!mirroflyId) return next(new ApiError(400, 'E0040002'))
    next();
  },

  linkUserId: async (req, res, next) => {
    const userId = req.headers._id;
    const {mirroflyId} = req.body;

    const mongoResult = await userMongo.instance.linkMirrorflyId(userId, mirroflyId);
    res.status(200).send({response_message:'User linked successfully!',});
    next();
  }

};


module.exports = mirrorfly;