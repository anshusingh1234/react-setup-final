const moment = require("moment");
const {feeds} = require("../../../core/elasticsearch");
const {topics: topicMongo} = require("../../../core/mongo");
const { commonResponse: response } = require('../../../helper/commonResponseHandler')
const validations  = require('./../../../helper/validations');
const ApiError = require("../ApiError");

const add = {};

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
add.validateBody = (req, res, next) => {
  const userId = req.headers._id;
  const {topic, language, image} = req.body;

  if(!topic) return next(new ApiError(400, 'E0050001'));
  if(!language) return next(new ApiError(400, 'E0050002'));
  req.body.createdAt = moment().unix();
  next();
  
}

/**
* Saving in Mongo
* @param {*} req
* @param {*} res
* @param {*} next
*/
add.saveInMongo = async (req, res, next) => {
  const userId = req.headers._id;
  const {region, topic, language, image} = req.body;

  const toAdd = {
    [topicMongo.FIELDS.TOPIC]: topic,
    [topicMongo.FIELDS.IMAGE]: image,
    [topicMongo.FIELDS.LANGUAGE]: language,
    [topicMongo.FIELDS.CREATED_AT]: req.body.createdAt,
    [topicMongo.FIELDS.UPDATED_AT]: req.body.createdAt
  };
  const mongoResult = await topicMongo.instance.insert(toAdd);
  
  if(mongoResult && mongoResult.result && mongoResult.result.ok){
    res.status(200).send({response_message:'Topic added successfully!'});
  }
  else return next(new ApiError(400, 'E0010010'));

}


module.exports = add;