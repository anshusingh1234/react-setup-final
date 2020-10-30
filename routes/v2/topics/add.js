const moment = require("moment");
const {feeds} = require("../../../core/elasticsearch");
const {topics: topicMongo} = require("../../../core/mongo");
const { commonResponse: response } = require('../../../helper/commonResponseHandler')
const validations  = require('./../../../helper/validations');
const ApiError = require("../ApiError");
const multiparty = require("multiparty");

const add = {};

add.formDataWrapper = async(req, res, next) => {
  const form = new multiparty.Form();
  form.parse(req, (error, fields, files) => {
    if(error || !fields) return next(new ApiError(400, 'E0010004'));
    console.log("ADD TOPIC FORM DATA", fields)
    const topic = (Array.isArray(fields.topic) && fields.topic[0]) ? fields.topic[0] : undefined;
    const language = (Array.isArray(fields.language)) ? fields.language[0] : undefined ;
    req.body = {
      "topic": topic,
      "language": language
    }
    req._files = files;
    next();
  })
}

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
add.validateBody = (req, res, next) => {
  req.body.image = Array.isArray(req._media) && req._media[0] && req._media[0].url;
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