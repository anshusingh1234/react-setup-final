const {feeds} = require("../../../core/elasticsearch");
const moment = require("moment");
const C = require("../../../constants");
const TYPES_ALLOWED = Object.values(C.TIMELINE.TYPES_ALLOWED);
const {FIELDS: ES_FEEDS_FIELDS} = require("../../../core/elasticsearch/templates/index/feeds/v1");
const ApiError = require("../ApiError");
const {user} = require("../../../core/Redis");
const {reactions: mongoReactions} = require("../../../core/mongo");

const timeline = {};

timeline.validate = (req, res, next) => {
  const userId = req.headers._id;
  const other = req.query.other;
  const type = req.query.type;

  req._userToFetch = other || userId;
  if(!TYPES_ALLOWED.includes(type)) return next(new ApiError(400, 'E0010009'));
  next();
}

timeline.search = async (req, res, next) => {
  const userId = req.headers._id;
  const type = req.query.type;
  let feedsInstance = feeds.forDate(moment().format("YYYY-MM-DD"));
  const searchResult  = await feedsInstance.timeline(req._userToFetch, userId, true, type, C.TIMELINE.DEFAULT_HIDE_TIME);
  req._searchResult = (searchResult && searchResult.hits.hits && searchResult.hits.hits.map(obj => obj._source)) || [];
  next();
}

timeline.fetchDetails = async(req, res, next) => {
  const searchResult = req._searchResult;
  let response;
  switch(req.query.type){
    case C.TIMELINE.TYPES_ALLOWED.GALLERY:
    response = _galleryWrapper(searchResult);
    break;

    case C.TIMELINE.TYPES_ALLOWED.GALLERY_SET:
    response = _gallerySetWrapper(searchResult);
    break;

    case C.TIMELINE.TYPES_ALLOWED.FEEDS:
    response = await _feedsWrapper(searchResult, req._userId);
    break;

    default:
    response = [];
    break;
  }
  res.status(200).send({
    total: response.length,
    data: response
  });
  next();
}

module.exports = timeline;

const _galleryWrapper = (result) => {
  let _return = [];
  result.forEach(obj => {
    _return = _return.concat(obj[ES_FEEDS_FIELDS.MEDIA] || []);
  })
  return _return;
}

const _gallerySetWrapper = (result) => {
  let yearMap = new Map();
  let dateMap = new Map();
  let _return = [];
  result.forEach(obj => {
    let media = obj[ES_FEEDS_FIELDS.MEDIA];
    if(media && media.length){
      let postedOn = obj[ES_FEEDS_FIELDS.CREATED_AT];
      const date = moment(postedOn*1000).format("DD-MM-YYYY");

      let currDateItems = dateMap.get(date) || [];
      currDateItems = currDateItems.concat(media);
      dateMap.set(date, currDateItems);
    }
  })
  const _allDates = ([...dateMap.keys()]);
  _allDates.forEach(_date => {
    const year = _date.split('-')[2];

    let currYearItems = yearMap.get(year) || [];
    currYearItems = currYearItems.concat({
      date: moment(_date, "DD-MM-YYYY").format("DD MMMM"),
      data: dateMap.get(_date)
    });
    yearMap.set(year, currYearItems);
  })
  const _allYears = ([...yearMap.keys()]);
  _allYears.forEach(_year => {
    _return.push({
      year: _year,
      data: yearMap.get(_year) || []
    })
  })
  return _return;
}

const _feedsWrapper = (result, userId) => {
  return new Promise(async(resolve, reject) => {
    let _allUserIds = [];
    let _allPostIds = [];

    result.forEach(_obj => {
      const _author = _obj[ES_FEEDS_FIELDS.AUTHOR];
      const _tagged = _obj[ES_FEEDS_FIELDS.TAGGED_USERS] || [];
      _allUserIds = _allUserIds.concat([_author], _tagged);
      _allPostIds.push(_obj[ES_FEEDS_FIELDS.FEED_ID]);
    })
    _allUserIds = [... new Set(_allUserIds)];
    const userMap = await user.getAllUsersProfile(_allUserIds);

    const reactionMap = await mongoReactions.instance.checkIfUserReacted([...new Set(_allPostIds)], userId, 'post');

    let _return = result.map(_obj => {
      const user = userMap.get(_obj[ES_FEEDS_FIELDS.AUTHOR]);
      user && delete user.name;
      const taggedUsers = (_obj[ES_FEEDS_FIELDS.TAGGED_USERS] || []).length && _obj[ES_FEEDS_FIELDS.TAGGED_USERS].map(_id => userMap.get(_id)).filter(el => el);
      if(user){
        if(_obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS]){
          _obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lat = Number.isInteger(_obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lat) ? `${_obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lat}.0` : _obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lat + "";
          _obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lon = Number.isInteger(_obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lon) ? `${_obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lon}.0` : _obj[ES_FEEDS_FIELDS.CHECK_IN_GEO_POINTS].lon + "";
        }
        const myReaction = reactionMap.get(_obj[ES_FEEDS_FIELDS.FEED_ID].toString());

        return {
          "type": _obj[ES_FEEDS_FIELDS.TYPE],
          "data": {
            "author": user,
            "privacy": _obj[ES_FEEDS_FIELDS.PRIVACY],
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
            "myReaction": myReaction ? myReaction : '0',
            "participatingDetails": _obj[ES_FEEDS_FIELDS.AUTHOR] === userId ? {
              "reactions": [1,2,3],
              "message": "Ankit, Josh and 3 others participated"
            } : undefined
          }
        }
      }
    }).filter(el => el);
    resolve(_return)
  })
}