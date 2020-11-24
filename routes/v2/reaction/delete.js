const { commonResponse: response } = require('../../../helper/commonResponseHandler')
const {feeds} = require("../../../core/elasticsearch");
const {FIELDS: ES_FEEDS_FIELDS} = require("../../../core/elasticsearch/templates/index/feeds/v1");
const {reactions: reactionMongo} = require("../../../core/mongo");
const ApiError = require("../ApiError");
const postHelper = require("./../feeds/postHelper");

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
   
    if(!entityId) return next(new ApiError(400, 'E0030007'));
    if(!entityType) return next(new ApiError(400, 'E0030008'));

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
  inElastic: async(req, res, next) => {
    const userId = req.headers._id;
    const {entityId, entityType} = req.query;
    if(entityType == 'post'){
      const feedsInstance = feeds.forId(entityId);
      feedsInstance.decrementReactionCount(entityId, 1);

      const postAuthor = await getPostAuthor(entityId);
      if(postAuthor === userId){
        const participatingInfo = await postHelper.fetch([entityId], userId);
        const participatingDetails = participatingInfo.get(entityId);
        res.status(200).send({response_message:'Reaction deleted successfully!', participatingDetails});
      }
      else res.status(200).send({response_message:'Reaction deleted successfully!'});
    }
    else res.status(200).send({response_message:'Reaction deleted successfully!'});

    next();
  }
};

const getPostAuthor = (feedId) =>{
  const feedsInstance = feeds.forId(feedId);
  return new Promise((resolve, reject) => {
    feedsInstance.getById(feedId, {_source: [ES_FEEDS_FIELDS.AUTHOR]}, (error, result)=>{
      const author = result && result._source && result._source.author ? result._source.author : '';
      resolve(author);
    });
  });
}


module.exports = deleteReaction;