const { commonResponse: response } = require('../../../helper/commonResponseHandler')
const {feeds} = require("../../../core/elasticsearch");
const {reactions: reactionMongo} = require("../../../core/mongo");
const ApiError = require("../ApiError");
const {user} = require("./../../../core/Redis");

const deleteReaction = {


  /**
   * Validate query params + feed on elastic search
   */
  validateBody: async(req, res, next) => {
    const {entityId, entityType} = req.query;
    if(!entityId) return next(new ApiError(400, 'E0030007'));
    if(!entityType) return next(new ApiError(400, 'E0030008'));
    next();
  },

  /**
   * Delete comment from Mongo
   */
  inMongo: async(req, res, next) => {
    const {entityId, entityType} = req.query;
    const mongoResult = await reactionMongo.instance.getUsersList(entityId, entityType);
    if(mongoResult && mongoResult._id){
      const allReactions = mongoResult.reaction;
      const allUserIDs = allReactions.map(reaction=>reaction.userId);
      user.getAllUsersProfile(allUserIDs).then(result=>{
        const allUsers = [...result.values()];
        res.status(200).send({total:allUsers.length, data:allUsers});
        next();
      })
    }
    else return next(new ApiError(400, 'E0010010'));
  },

};


module.exports = deleteReaction;