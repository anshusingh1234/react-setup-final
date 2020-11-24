const moment = require("moment");
const async = require("async");
const {feeds} = require("../../../core/elasticsearch");
const {user} = require("./../../../core/Redis");
const {topics: topicMongo} = require("../../../core/mongo");
const {reactions: reactionMongo} = require("../../../core/mongo");
const ApiError = require("../ApiError");


const DEFAULT = {
  LIMIT: 10,
  PAGE: 1
}

const topics = {
  /**
  * Validating JSON Body
  * @param {*} req
  * @param {*} res
  * @param {*} next
  */
  validateBody: (req, res, next) => {
    next();
  },

  list: async (req, res, next) => {
    const page = parseInt(req.query.page) || DEFAULT.PAGE;
    const limit = parseInt(req.query.limit) || DEFAULT.LIMIT;
    const language = req.query.language;

    const params = { language, page, limit };

    const total = await topicMongo.instance.countTopics(params);
    const mongoResult = await topicMongo.instance.list(params);

    res.status(200).send( await wrapper(req, total, mongoResult));
    next();
  }

};

var wrapper = async(req, total, data) =>{
  let _return = {total:0, response:[]};

  if(data && data.length){
    const userId = req.headers._id;
    const allTopicIDs = data.map(topic=>topic._id.toString());
    const reactionsCount = await reactionMongo.instance.getReactionsCount('topic',allTopicIDs);
    const myReactions = await reactionMongo.instance.checkIfUserReacted(allTopicIDs, userId, 'topic');
    
    const allTopics = data.map(topic=>{
      const likes = reactionsCount.get(topic._id.toString());
      const liked = myReactions.get(topic._id.toString());
      return { ...topic, likes: likes || 0, liked: liked ? true : false }
    });

    _return = {
      total: total,
      response: allTopics
    }

    return _return;
  }
  else return _return;
}


module.exports = topics;