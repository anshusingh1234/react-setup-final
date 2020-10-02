const {feeds} = require("../../../core/elasticsearch");
const {FIELDS: ES_FEEDS_FIELDS} = require("../../../core/elasticsearch/templates/index/feeds/v1");
const moment = require("moment");
const {user} = require("../../../core/Redis");
const {users: mongoUsers} = require("../../../core/mongo");

const feedsSearch = {};

feedsSearch.search = async (req, res, next) => {
  let feedsInstance = feeds.forDate(moment().format("YYYY-MM-DD"));
  const friends = await mongoUsers.instance.getFriends(req.headers._id) || [];
  console.log("----------------", friends)
  const searchResult  = await feedsInstance.searchFeed(req.headers._id, friends, []);
  req._searchResult = (searchResult && searchResult.hits.hits) || [];
  next();

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
          "taggedUsers": (taggedUsers || []).length ? taggedUsers : undefined
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