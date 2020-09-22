const {feeds} = require("../../../core/elasticsearch");
const moment = require("moment");
const C = require("../../../constants");
const TYPES_ALLOWED = Object.values(C.TIMELINE.TYPES_ALLOWED);
const {FIELDS: ES_FEEDS_FIELDS} = require("../../../core/elasticsearch/templates/index/feeds/v1");
const ApiError = require("../ApiError");


const timeline = {};

timeline.validate = (req, res, next) => {
  const userId = req.headers._id;
  const type = req.query.type;

  req._userToFetch = userId;
  if(!TYPES_ALLOWED.includes(type)) return next(new ApiError(400, 'E0010009'));
  next();
}

timeline.search = async (req, res, next) => {
  const type = req.query.type;
  let feedsInstance = feeds.forDate(moment().format("YYYY-MM-DD"));
  const searchResult  = await feedsInstance.timelineRewards(type);
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
    response = _gallerSetWrapper(searchResult);
    break;

    case C.TIMELINE.TYPES_ALLOWED.FEEDS:
    response = _feedsWrapper(searchResult);
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

const _gallerSetWrapper = (result) => {
  let yearMap = new Map();
  let dateMap = new Map();
  let _return = [];
  result.forEach(obj => {
    let media = obj[ES_FEEDS_FIELDS.MEDIA];
    let postedOn = obj[ES_FEEDS_FIELDS.CREATED_AT];
    const date = moment(postedOn*1000).format("DD-MM-YYYY");

    let currDateItems = dateMap.get(date) || [];
    currDateItems = currDateItems.concat(media);
    dateMap.set(date, currDateItems);
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

const _feedsWrapper = (result) => {
  return result.map(_obj => {
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
        "detail": {..._obj[ES_FEEDS_FIELDS.DATA],
          "media": _obj[ES_FEEDS_FIELDS.MEDIA],
        },
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
}