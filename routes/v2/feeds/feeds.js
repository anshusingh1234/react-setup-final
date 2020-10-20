const {feeds} = require("../../../core/elasticsearch");
const {FIELDS: ES_FEEDS_FIELDS} = require("../../../core/elasticsearch/templates/index/feeds/v1");
const moment = require("moment");
const {user} = require("../../../core/Redis");
const {users: mongoUsers, reactions: mongoReactions, comments: mongoComments} = require("../../../core/mongo");
const ApiError = require("../ApiError");
const postHelper = require("./postHelper");
const paginationHelper = require("./paginationHelper");

const feedsSearch = {};

feedsSearch.search = async (req, res, next) => {
  try{
    const _next = req.query.next;
    const paginationInfo = paginationHelper.getPaginationInfo(_next);
    req._paginationInfo = paginationInfo;
    let feedsInstance = feeds.forDate(moment().format("YYYY-MM-DD"));
    const keyword = req.query.keyword;
    const {friends = [], followings = []} = await mongoUsers.instance.getFriendsAndFollowings(req.headers._id) || {};
    const searchResult  = await feedsInstance.searchFeed(req.headers._id, friends, followings, keyword, paginationInfo.from, paginationInfo.size);
    req._total = (searchResult && searchResult.hits && searchResult.hits.total.value) || 0;
    req._searchResult = (searchResult && searchResult.hits.hits) || [];
    next();
  }catch(e){
    console.log("/feeds search()", e);
    return next(new ApiError(500, 'E0010002'));
  }
}

feedsSearch.fetchDetails = async(req, res, next) => {
  try{
    let _allUserIds = [];
    let _allPostIds = [];
    let _myPostIds = [];
    req._searchResult.forEach(_obj => {
      _obj = _obj._source;
      const _author = _obj[ES_FEEDS_FIELDS.AUTHOR];
      const _tagged = _obj[ES_FEEDS_FIELDS.TAGGED_USERS] || [];
      _allUserIds = _allUserIds.concat([_author], _tagged);
      _allPostIds.push(_obj[ES_FEEDS_FIELDS.FEED_ID]);
      if(_author === req._userId) _myPostIds.push(_obj[ES_FEEDS_FIELDS.FEED_ID]);
    })
    _allUserIds = [... new Set(_allUserIds)];
    _myPostIds = [... new Set(_myPostIds)];
    const userMap = await user.getAllUsersProfile(_allUserIds);
    req._userMap = userMap;

    const reactionMap = await mongoReactions.instance.checkIfUserReacted([...new Set(_allPostIds)], req._userId, 'post');
    req._reactionMap = reactionMap;

    req._participatingInfo = await postHelper.fetch(_myPostIds);
    next();
  }catch(e){
    console.log("/feeds fetchDetails()", e);
    return next(new ApiError(500, 'E0010002', {debug: e}));
  }
}

feedsSearch.buildResponse = (req, res, next) => {
  const searchResult = req._searchResult.map(_obj => {
    _obj = _obj._source;
    const user = req._userMap.get(_obj[ES_FEEDS_FIELDS.AUTHOR]);
    user && delete user.name;
    const taggedUsers = (_obj[ES_FEEDS_FIELDS.TAGGED_USERS] || []).length && _obj[ES_FEEDS_FIELDS.TAGGED_USERS].map(_id => req._userMap.get(_id)).filter(el => el);
    if(user){
      if(_obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS]){
        _obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lat = Number.isInteger(_obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lat) ? `${_obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lat}.0` : _obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lat + "";
        _obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lon = Number.isInteger(_obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lon) ? `${_obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lon}.0` : _obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lon + "";
      }
      const myReaction = req._reactionMap.get(_obj[ES_FEEDS_FIELDS.FEED_ID].toString());
      return {
        "type": _obj[ES_FEEDS_FIELDS.TYPE],
        "data": {
          "author": user,
          "privacy": _obj[ES_FEEDS_FIELDS.PRIVACY],
          "feelings": Number(_obj[ES_FEEDS_FIELDS.FEELINGS]) ? Number(_obj[ES_FEEDS_FIELDS.FEELINGS]) : undefined,
          "createdAt": _obj[ES_FEEDS_FIELDS.CREATED_AT],
          "id": _obj[ES_FEEDS_FIELDS.FEED_ID],
          "commentsCount": postHelper.getPostActivitiesCountString(_obj[ES_FEEDS_FIELDS.COMMENTS_COUNT]),
          "reactionsCount": postHelper.getPostActivitiesCountString(_obj[ES_FEEDS_FIELDS.REACTIONS_COUNT]),
          "detail": {..._obj[ES_FEEDS_FIELDS.DATA],
            "media": _obj[ES_FEEDS_FIELDS.MEDIA],
          },
          "checkIn": _obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS] && {
            "geoPoints": _obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS],
            "text": _obj[ES_FEEDS_FIELDS.CHECK_IN_TEXT]
          },
          "taggedUsers": (taggedUsers || []).length ? taggedUsers : undefined,
          "myReaction": myReaction ? myReaction.toString() : '0',
          "participatingDetails": _obj[ES_FEEDS_FIELDS.AUTHOR] === req._userId ? req._participatingInfo.get(_obj[ES_FEEDS_FIELDS.FEED_ID]) : undefined
        }
      }
    }
  }).filter(el => el);
  res.status(200).send({
    next: (req._paginationInfo.from + req._paginationInfo.size) >= req._total ? undefined : req._paginationInfo.cursor,
    feeds: searchResult
  });
  next();
}


module.exports = feedsSearch;
