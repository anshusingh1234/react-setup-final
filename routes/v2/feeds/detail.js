const {feeds} = require("../../../core/elasticsearch");
const {FIELDS: ES_FEEDS_FIELDS, FIELDS_VALUES: ES_FEED_FIELDS_VALUES} = require("../../../core/elasticsearch/templates/index/feeds/v1");
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
    const detail = await instance.getDetail(id);
    if(!detail) return next(new ApiError(401, 'E0020001', {debug: "doc not found in the es"}));
    req._detail = detail._source;
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
    switch(privacy){
      case ES_FEED_FIELDS_VALUES[ES_FEEDS_FIELDS.PRIVACY].PRIVATE:{
        if(req._userId !== detail[ES_FEEDS_FIELDS.AUTHOR]){
          return next(new ApiError(400, 'E0020002'));
        }
        return next();
      }
      case ES_FEED_FIELDS_VALUES[ES_FEEDS_FIELDS.PRIVACY].FRIENDS: {
        if(!friends.includes(detail[ES_FEEDS_FIELDS.AUTHOR])){
          return next(new ApiError(400, 'E0020002'));
        }
        return next();
      }
      case ES_FEED_FIELDS_VALUES[ES_FEEDS_FIELDS.PRIVACY].CUSTOM:{
        if(!detail[ES_FEEDS_FIELDS.PRIVATE_TO].includes(req._userId)){
          return next(new ApiError(400, 'E0020002'));
        }
        return next();
      }
      default: return next();
    }
  }catch(e){
    return next(new ApiError(500, 'E0010002', {debug: e}));
  }
}

detail.fetchDetails = async(req, res, next) => {
  const detail = req._detail;

  let _allUserIds = [];
  const _author = detail[ES_FEEDS_FIELDS.AUTHOR];
  const _tagged = detail[ES_FEEDS_FIELDS.TAGGED_USERS] || [];
  _allUserIds = _allUserIds.concat([_author], _tagged);

  _allUserIds = [... new Set(_allUserIds)];
  const userMap = await user.getAllUsersProfile(_allUserIds);
  req._userMap = userMap;
  next();
}

detail.buildResponse = (req, res, next) => {
  const detail = req._detail;

  const user = req._userMap.get(detail[ES_FEEDS_FIELDS.AUTHOR]);
  user && delete user.name;
  const taggedUsers = (detail[ES_FEEDS_FIELDS.TAGGED_USERS] || []).length && detail[ES_FEEDS_FIELDS.TAGGED_USERS].map(_id => req._userMap.get(_id)).filter(el => el);

  if(!user) return next(new ApiError(400, 'E0020001', {debug: "author not found"}));

  if(detail[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS]){
    detail[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lat = Number.isInteger(detail[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lat) ? `${detail[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lat}.0` : detail[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lat + "";
    detail[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lon = Number.isInteger(detail[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lon) ? `${detail[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lon}.0` : detail[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lon + "";
  }

  let response = {
    "type": detail[ES_FEEDS_FIELDS.TYPE],
    "data": {
      "author": user,
      "privacy": detail[ES_FEEDS_FIELDS.PRIVACY],
      "createdAt": detail[ES_FEEDS_FIELDS.CREATED_AT],
      "id": detail[ES_FEEDS_FIELDS.FEED_ID],
      "commentsCount": detail[ES_FEEDS_FIELDS.COMMENTS_COUNT] || 0,
      "reactionsCount": detail[ES_FEEDS_FIELDS.REACTIONS_COUNT] || 0,
      "detail": {...detail[ES_FEEDS_FIELDS.DATA],
        "media": detail[ES_FEEDS_FIELDS.MEDIA],
      },
      "checkIn": detail[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS] && {
        "geoPoints": detail[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS],
        "text": detail[ES_FEEDS_FIELDS.CHECK_IN_TEXT]
      },
      "taggedUsers": (taggedUsers || []).length ? taggedUsers : undefined,
      "participatingDetails": detail[ES_FEEDS_FIELDS.AUTHOR] === req._userId ? {
        "reactions": [1,2,3],
        "message": "Ankit, Josh and 3 others participated"
      } : undefined
    }
  }
  res.status(200).send(response);
  next();
}

module.exports = detail;