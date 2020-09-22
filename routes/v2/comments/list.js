const moment = require("moment");
const async = require("async");
const {feeds} = require("../../../core/elasticsearch");
const {user} = require("./../../../core/Redis");
const {comments: commentMongo} = require("../../../core/Mongo");
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

    if(!feedId) return response(res, 400, null, "invalid/missing feedId");

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
    const page = parseInt(req.query.page) || DEFAULT.PAGE;
    const limit = parseInt(req.query.limit) || DEFAULT.LIMIT;

    const params = { feedId, page, limit };

    const mongoResult = await commentMongo.instance.list(params);
    res.status(200).send(await wrapper(mongoResult));
    next();
  }

};

var wrapper = async (data) =>{
  return new Promise ((resolve, reject) => {
    const userIds = [...new Set(data.map(_obj => _obj[commentMongo.FIELDS.USER_ID]))];
    const commentIds = [...new Set(data.map(_obj => _obj[commentMongo.FIELDS.ID]))];

    let userProfiles, replies;

    async.parallel({
      replies: cb => {
        commentMongo.instance.replies(commentIds).then(res=>{
          replies = res;
          cb();
        })
      },
      profiles: cb => {
        user.getAllUsersProfile(userIds).then(res=>{
          userProfiles = res;
          cb();
        })
      },
    },
    (error, result) => {
      let response =  data.map( _obj => {
        return {
          "feedId": _obj[commentMongo.FIELDS.POST_ID],
          "comment": _obj[commentMongo.FIELDS.COMMENT],
          "createdAt": _obj[commentMongo.FIELDS.CREATED_AT],
          "replies": replies.get(_obj[commentMongo.FIELDS.ID]),
          "user": userProfiles.get(_obj[commentMongo.FIELDS.USER_ID])
        }
      }).filter(el => el);
      resolve(response)
    })
  })
}






module.exports = comments;