const {feeds} = require("../../../core/elasticsearch");
const {FIELDS: ES_FEEDS_FIELDS} = require("../../../core/elasticsearch/templates/index/feeds/v1");
const moment = require("moment");

const feedsSearch = {};

feedsSearch.search = async (req, res, next) => {
  let feedsInstance = feeds.forDate(moment().format("YYYY-MM-DD"));
  const searchResult  = await feedsInstance.searchFeed(req.headers._id, ["dkjnsjknjsdknjksdnsjkd"], []);
  req._searchResult = (searchResult && searchResult.hits.hits) || [];
  next();

}

feedsSearch.fetchDetails = async(req, res, next) => {
  next();
}

feedsSearch.buildResponse = (req, res, next) => {
  const searchResult = req._searchResult.map(_obj => {
    _obj = _obj._source;
    return {
      "type": _obj[ES_FEEDS_FIELDS.TYPE],
      "data": {
        "author": {
          "userId": _obj[ES_FEEDS_FIELDS.AUTHOR]
        },
        "privacy": _obj[ES_FEEDS_FIELDS.PRIVACY],
        "createdAt": _obj[ES_FEEDS_FIELDS.CREATED_AT],
        "id": _obj[ES_FEEDS_FIELDS.FEED_ID],
        "commentsCount": _obj[ES_FEEDS_FIELDS.COMMENTS_COUNT],
        "reactionsCount": _obj[ES_FEEDS_FIELDS.REACTIONS_COUNT],
        "media": _obj[ES_FEEDS_FIELDS.MEDIA],
        "detail": _obj[ES_FEEDS_FIELDS.DATA],
        "checkIn": _obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS] && {
          "geoPoints": _obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS],
          "text": _obj[ES_FEEDS_FIELDS.CHECK_IN_TEXT]
        },
        "taggedUsers": (_obj[ES_FEEDS_FIELDS.TAGGED_USERS] && _obj[ES_FEEDS_FIELDS.TAGGED_USERS].length) ? _obj[ES_FEEDS_FIELDS.TAGGED_USERS].map(_userId => {
          return {
            "userId": _userId
          }
        }) : undefined
      }
    }
  });
  res.status(200).send({
    next: "",
    feeds: searchResult
  });
  next();
}


module.exports = feedsSearch;