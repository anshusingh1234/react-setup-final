const moment = require("moment");
const {feeds} = require("../../../core/elasticsearch");
const {topics: topicMongo} = require("../../../core/mongo");
const { commonResponse: response } = require('../../../helper/commonResponseHandler')
const validations  = require('./../../../helper/validations');
const ApiError = require("../ApiError");

const edit = {};

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
edit.validateBody = (req, res, next) => {
  const userId = req.headers._id;
  const {id, topic, language} = req.body;

  if(!id) return next(new ApiError(400, 'E0030005'));
  if(!topic) return next(new ApiError(400, 'E0050001'));
  if(!language) return next(new ApiError(400, 'E0050002'));
  
  req.body.updatedAt = moment().unix();
  next();
}


/**
* Update values in Mongo
* @param {*} req
* @param {*} res
* @param {*} next
*/
edit.updateInMongo = async (req, res, next) => {
  const {id, topic, language} = req.body;

  const topicId =  topicMongo.instance.getObjectIdFromString(id);
  const params = {
    [topicMongo.FIELDS.TOPIC]: topic,
    [topicMongo.FIELDS.LANGUAGE]: language,
    [topicMongo.FIELDS.UPDATED_AT]: req.body.updatedAt
  };
  const mongoResult = await topicMongo.instance.update(topicId, params);

  if(mongoResult && mongoResult.ok){
    res.status(200).send({response_message:'Topic updated successfully!'});
  }
  else return next(new ApiError(400, 'E0010010'));
}

module.exports = edit;