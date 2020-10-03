const {feeds} = require("../../../core/elasticsearch");
const {FIELDS: ES_FEEDS_FIELDS} = require("../../../core/elasticsearch/templates/index/feeds/v1");
const moment = require("moment");
const {user} = require("../../../core/Redis");
const {users: mongoUsers} = require("../../../core/mongo");
const ApiError = require("../ApiError");

const detail = {};

detail.validate = async(req, res, next) => {
  const id = req.query.id;
  const userId = req._userId;
  if(!id) return next(new ApiError(400, 'E0010009', {debug: "feed id is missing"}));

  try{
    const instance = feeds.forId(id);
    const totalRewards = await instance.totalRewards();
    console.log("----------------", totalRewards);
    const detail = await instance.getDetail(id);
    if(!detail) return next(new ApiError(401, 'E0020001', {debug: "doc not found in the es"}));
    req._detail = detail.hits.hits._source;
    next();
  }catch(e){
    return next(new ApiError(500, 'E0010002', {debug: e}));
  }
}

detail.checkForPrivacy = async(req, res, next) => {
  try{
    const detail = req._detail;
    const {friends = [], followings = []} = await mongoUsers.instance.getFriendsAndFollowings(req.headers._id) || {};
    const privacy = detail[ES_FEEDS_FIELDS.PRIVACY];
    next();
  }catch(e){
    return next(new ApiError(500, 'E0010002', {debug: e}));
  }
}

detail.buildResponse = (req, res, next) => {
  res.status(200).send(req._detail);
  next();
}

module.exports = detail;