const moment = require("moment");
const {feeds} = require("../../../core/elasticsearch");
const {reactions: reactionMongo} = require("../../../core/mongo");
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
add.validateBody = async (req, res, next) => {
  const {entityId, entityType, reaction} = req.body;
  const userId = req.headers._id;

  if(!entityId) return response(res, 400, null, "invalid/missing entityId");
  if(!entityType) return response(res, 400, null, "invalid/missing entityType");
  if(!reaction) return response(res, 400, null, "invalid/missing reaction");
  req.body.createdAt = moment().unix();

  const entity={
    [reactionMongo.FIELDS.ENTITY_ID]: entityId,
    [reactionMongo.FIELDS.ENTITY_TYPE]: entityType
  }
  const alreadyReacted = await reactionMongo.instance.checkIfAlreadyReacted(entity, userId);
  req.body.alreadyReacted = alreadyReacted;

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
  const {entityId, entityType, reaction, createdAt, alreadyReacted} = req.body;
  const entity={
    [reactionMongo.FIELDS.ENTITY_ID]: entityId,
    [reactionMongo.FIELDS.ENTITY_TYPE]: entityType
  }
  const reactionObj = {
    [reactionMongo.FIELDS.REACTION_USERID]: userId,
    [reactionMongo.FIELDS.REACTION_TYPE]: reaction,
    [reactionMongo.FIELDS.REACTION_CREATED_AT]: createdAt
  }

  if(!alreadyReacted) var mongoResult = await reactionMongo.instance.insert(entity, reactionObj);
  else var mongoResult = await reactionMongo.instance.update(entity, reactionObj);

  if(mongoResult && mongoResult.ok){
    next();
  }
  else return next(new ApiError(400, 'E0010010'));
}

/**
* Saving in ES
* @param {*} req
* @param {*} res
* @param {*} next
*/
add.saveInES = async (req, res, next) => {
  res.status(200).send({response_message:'Reaction posted successfully!'});
  next();

  const {entityId, entityType, alreadyReacted} = req.body;
  const userId = req.headers._id;
  if(entityType == 'post'){
    if(!alreadyReacted){
      const feedsInstance = feeds.forId(entityId);
      feedsInstance.incrementReactionCount(entityId, 1)
      feedsInstance.reactedBy(entityId, userId)
    }
  }
}

module.exports = add;