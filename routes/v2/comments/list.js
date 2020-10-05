const moment = require("moment");
const async = require("async");
const {feeds} = require("../../../core/elasticsearch");
const {user} = require("./../../../core/Redis");
const {comments: commentMongo} = require("../../../core/mongo");
const {reactions: reactionMongo} = require("../../../core/mongo");
const { commonResponse: response } = require('../../../helper/commonResponseHandler')
const ApiError = require("../ApiError");
const { countBy } = require("lodash");


const DEFAULT = {
  LIMIT: 10,
  PAGE: 1
}

const comments = {
  /**
  * Validating JSON Body
  * @param {*} req
  * @param {*} res
  * @param {*} next
  */
  validateBody: (req, res, next) => {
    const {feedId} = req.query;

    if(!feedId) return next(new ApiError(400, 'E0030004'));

    const instance = feeds.forId(feedId);
    instance.getById(feedId, {}, (error, result) => {
      if(result && result._source){
        req._instance = instance;
        next();
      }
      else return next(new ApiError(400, 'E0010004'));
    })
  },

  list: async (req, res, next) => {
    const feedId = req.query.feedId;
    const userId = req.headers._id;
    const page = parseInt(req.query.page) || DEFAULT.PAGE;
    const limit = parseInt(req.query.limit) || DEFAULT.LIMIT;

    const params = { feedId, page, limit };

    const total = await commentMongo.instance.countComments(params);
    const mongoResult = await commentMongo.instance.list(params);

    res.status(200).send(await wrapper(userId, total, mongoResult));
    next();
  }

};

var wrapper = async (userId, total, data) =>{
  return new Promise ((resolve, reject) => {
    let userIds = [...new Set(data.map(_obj => _obj[commentMongo.FIELDS.USER_ID]))];
    const commentIds = [...new Set(data.map(_obj => _obj[commentMongo.FIELDS.ID].toString()))];

    let userProfiles = [], replies = [], reactionCount = 0, replyReactionCount = 0, userReacted = [], allCommentReplyIDs = [];

    async.series({
      replies: cb => {
        commentMongo.instance.replies(commentIds).then(res=>{
          replies = res;

          let replyIDs = [...new Set((([...replies.values()]).map(repliesArray => {
            return repliesArray.map(obj => obj._id.toString())
          })).reduce((x, z) => x.concat(z), []))]

          allCommentReplyIDs = commentIds.concat(replyIDs);
          cb();
        })
      },
      reactionCount: cb => {
        reactionMongo.instance.getCount(allCommentReplyIDs).then(res=>{
          reactionCount = res;
          cb();
        })
      },
      checkIfUserReacted: cb => {
        reactionMongo.instance.checkIfUserReacted(allCommentReplyIDs, userId, 'comment').then(res=>{
          userReacted = res;
          cb();
        })
      },
      profiles: cb => {
        let repliesUserIds = [...new Set((([...replies.values()]).map(repliesArray => {
          return repliesArray.map(obj => obj.user_id)
        })).reduce((x, z) => x.concat(z), []))]

        user.getAllUsersProfile(userIds.concat(repliesUserIds)).then(res=>{
          userProfiles = res;
          cb();
        })
      },
    },
    (error, result) => {
      let response =  data.map( _obj => {
        var formatTuple = (data, profiles, replies) =>{
          if(data && data[commentMongo.FIELDS.ID]){
            const allReplies = replies.get(data[commentMongo.FIELDS.ID].toString());
            const reactionCountVal = reactionCount.get(data[commentMongo.FIELDS.ID].toString());
            const myReaction = userReacted.get(data[commentMongo.FIELDS.ID].toString());

            return {
              "commentId": data[commentMongo.FIELDS.ID],
              "feedId": data[commentMongo.FIELDS.POST_ID],
              "comment": data[commentMongo.FIELDS.COMMENT],
              "createdAt": data[commentMongo.FIELDS.CREATED_AT],
              "replies": allReplies && allReplies.length ? allReplies.map(reply=>formatTuple(reply, profiles, replies)):[],
              "reactionCount":reactionCountVal ? reactionCountVal : 0,
              "myReaction": myReaction ? myReaction : '0',
              "user": profiles.get(data[commentMongo.FIELDS.USER_ID])
            }
          }
        }
        return formatTuple(_obj, userProfiles, replies);
      }).filter(el => el);

      resolve({
        total: total,
        response: response
      })
    })
  })
}


module.exports = comments;