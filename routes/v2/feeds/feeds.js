const {feeds} = require("../../../core/elasticsearch");
const {FIELDS: ES_FEEDS_FIELDS} = require("../../../core/elasticsearch/templates/index/feeds/v1");
const moment = require("moment");
const {user} = require("../../../core/Redis");
const {users: mongoUsers} = require("../../../core/mongo");
const ApiError = require("../ApiError");

const feedsSearch = {};

feedsSearch.search = async (req, res, next) => {
  try{
    let feedsInstance = feeds.forDate(moment().format("YYYY-MM-DD"));
    const {friends = [], followings = []} = await mongoUsers.instance.getFriendsAndFollowings(req.headers._id) || {};
    const searchResult  = await feedsInstance.searchFeed(req.headers._id, friends, followings);
    req._searchResult = (searchResult && searchResult.hits.hits) || [];
    next();
  }catch(e){
    console.log("/feeds search()", e);
    return next(new ApiError(500, 'E0010002'));
  }
}

feedsSearch.fetchDetails = async(req, res, next) => {
  let _allUserIds = [];
  req._searchResult.forEach(_obj => {
    _obj = _obj._source;
    const _author = _obj[ES_FEEDS_FIELDS.AUTHOR];
    const _tagged = _obj[ES_FEEDS_FIELDS.TAGGED_USERS] || [];
    _allUserIds = _allUserIds.concat([_author], _tagged);
  })
  _allUserIds = [... new Set(_allUserIds)];
  const userMap = await user.getAllUsersProfile(_allUserIds);
  req._userMap = userMap;
  next();
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
      return {
        "type": _obj[ES_FEEDS_FIELDS.TYPE],
        "data": {
          "author": user,
          "privacy": _obj[ES_FEEDS_FIELDS.PRIVACY],
          "feelings": Number(_obj[ES_FEEDS_FIELDS.FEELINGS]) ? Number(_obj[ES_FEEDS_FIELDS.FEELINGS]) : undefined,
          "createdAt": _obj[ES_FEEDS_FIELDS.CREATED_AT],
          "id": _obj[ES_FEEDS_FIELDS.FEED_ID],
          "commentsCount": _obj[ES_FEEDS_FIELDS.COMMENTS_COUNT],
          "reactionsCount": _obj[ES_FEEDS_FIELDS.REACTIONS_COUNT],
          "detail": {..._obj[ES_FEEDS_FIELDS.DATA],
            "media": _obj[ES_FEEDS_FIELDS.MEDIA],
          },
          "checkIn": _obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS] && {
            "geoPoints": _obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS],
            "text": _obj[ES_FEEDS_FIELDS.CHECK_IN_TEXT]
          },
          "taggedUsers": (taggedUsers || []).length ? taggedUsers : undefined,
          "participatingDetails": _obj[ES_FEEDS_FIELDS.AUTHOR] === req._userId ? {
            "reactions": [1,2,3],
            "message": "Ankit, Josh and 3 others participated"
          } : undefined
        }
      }
    }
  }).filter(el => el);
  res.status(200).send({
    next: "",
    feeds: searchResult
  });
  next();
}


module.exports = feedsSearch;