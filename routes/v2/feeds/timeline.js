const {feeds} = require("../../../core/elasticsearch");
const moment = require("moment");
const C = require("../../../constants");
const TYPES_ALLOWED = Object.values(C.TIMELINE.TYPES_ALLOWED);
const {FIELDS: ES_FEEDS_FIELDS} = require("../../../core/elasticsearch/templates/index/feeds/v1");
const ApiError = require("../ApiError");
const {user} = require("../../../core/Redis");
const {reactions: mongoReactions, users: mongoUsers} = require("../../../core/mongo");
const postHelper = require("./postHelper");

const timeline = {};

timeline.validate = (req, res, next) => {
  const userId = req.headers._id;
  const other = req.query.other;
  const type = req.query.type;

  if(userId === other || !other) req._self = true;

  req._userToFetch = other || userId;
  if(!TYPES_ALLOWED.includes(type)) return next(new ApiError(400, 'E0010009'));
  next();
}

timeline.checkProfileVisibiility = async(req, res, next) => {
  if(req._self) return next();
  try{
    const {friends = [], profilePrivacy} = await mongoUsers.instance.getFriendsAndFollowings(req._userToFetch) || {};
    if(profilePrivacy === 'PUBLIC') return next();
    if(friends.includes(req._userId)) return next();
    req._emptyList = true;
    next();
  }catch(e){
    return next(new ApiError(500, 'E0010002', {debug: e}));
  }
}

timeline.search = async (req, res, next) => {
  if(req._emptyList) return next();
  try{
    const userId = req.headers._id;
    const type = req.query.type;
    let feedsInstance = feeds.forDate(moment().format("YYYY-MM-DD"));
    const searchResult  = await feedsInstance.timeline(req._userToFetch, userId, true, type, C.TIMELINE.DEFAULT_HIDE_TIME);
    console.log(JSON.stringify(searchResult, null, 2))
    req._searchResult = (searchResult && searchResult.hits.hits && searchResult.hits.hits.map(obj => obj._source)) || [];
    next();
  }catch(e){
    return next(new ApiError(500, 'E0010002', {debug: e}));
  }
}

timeline.fetchDetails = async(req, res, next) => {
  const searchResult = req._searchResult;
  let response = [];
  if(!req._emptyList){
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
    let _myPostIds = [];

    result.forEach(_obj => {
      const _author = _obj[ES_FEEDS_FIELDS.AUTHOR];
      const _tagged = _obj[ES_FEEDS_FIELDS.TAGGED_USERS] || [];
      _allUserIds = _allUserIds.concat([_author], _tagged);
      _allPostIds.push(_obj[ES_FEEDS_FIELDS.FEED_ID]);
      if(_author === userId) _myPostIds.push(_obj[ES_FEEDS_FIELDS.FEED_ID]);
    })
    _allUserIds = [... new Set(_allUserIds)];
    const userMap = await user.getAllUsersProfile(_allUserIds);
    const participatingInfo = await postHelper.fetch(_myPostIds);

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
            "participatingDetails": _obj[ES_FEEDS_FIELDS.AUTHOR] === userId ? participatingInfo.get(_obj[ES_FEEDS_FIELDS.FEED_ID]) : undefined

          }
        }
      }
    }).filter(el => el);
    resolve(_return)
  })
}