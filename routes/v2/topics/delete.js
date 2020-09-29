const { commonResponse: response } = require('../../../helper/commonResponseHandler')
const {topics: topicMongo} = require("../../../core/mongo");
const ApiError = require("../ApiError");

const deleteTopic = {


  /**
  * Validate query params + feed on elastic search
  */
  validateBody: async(req, res, next) => {
    const topicId = req.query.id;
    const userId = req.headers._id;

    if(!topicId) return next(new ApiError(400, 'E0030005'));
    next();
  },

  /**
  * Delete topic from Mongo
  */
  inMongo: async(req, res, next) => {
    const topicId = req.query.id;
    const params = {
      [topicMongo.FIELDS.ID]: topicMongo.instance.getObjectIdFromString(topicId)
    };
    const mongoResult = await topicMongo.instance.delete(params);
    if(mongoResult && mongoResult.ok){
      res.status(200).send({response_message:'Topic deleted successfully!'});
      next();
    }
    else return next(new ApiError(400, 'E0010010'));
  },

};


module.exports = deleteTopic;