const { commonResponse: response } = require('../../../helper/commonResponseHandler')
const {feeds} = require("../../../core/elasticsearch");
const {reactions: reactionMongo} = require("../../../core/mongo");
const ApiError = require("../ApiError");

const deleteReaction = {


  /**
   * Validate query params + feed on elastic search
   */
  validateBody: async(req, res, next) => {
    const userId = req.headers._id;
    const {entityId, entityType} = req.query;

    const entity={
      [reactionMongo.FIELDS.ENTITY_ID]: entityId,
      [reactionMongo.FIELDS.ENTITY_TYPE]: entityType
    }
    if(!entityId) return response(res, 400, null, "invalid/missing entityId");
    if(!entityType) return response(res, 400, null, "invalid/missing entityType");
    const alreadyReacted = await reactionMongo.instance.checkIfAlreadyReacted(entity, userId);
    if(alreadyReacted){
      next();
    }
    else return response(res, 400, null, "No reactions found");

  },

  /**
   * Delete comment from Mongo
   */
  inMongo: async(req, res, next) => {
    const userId = req.headers._id;
    const {entityId, entityType} = req.query;

    const entity={
      [reactionMongo.FIELDS.ENTITY_ID]: entityId,
      [reactionMongo.FIELDS.ENTITY_TYPE]: entityType
    }

    const mongoResult = await reactionMongo.instance.delete(entity, userId);
    if(mongoResult && mongoResult.ok){
      next();
    }
    else return next(new ApiError(400, 'E0010010'));
  },

  /**
   * Decrement specific count in elastic
   */
  inElastic: (req, res, next) => {
    res.status(200).send({response_message:'Reaction deleted successfully!'});
    next();

    const {entityId, entityType} = req.query;
    if(entityType == 'post'){
      const feedsInstance = feeds.forId(entityId);
      feedsInstance.decrementReactionCount(entityId, 1)
    }
  }
};


module.exports = deleteReaction;