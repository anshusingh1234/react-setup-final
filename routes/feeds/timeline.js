const {feeds} = require("../../core/elasticsearch");
const moment = require("moment");
const { commonResponse: response } = require('../../helper/commonResponseHandler')
const C = require("../../constants");
const TYPES_ALLOWED = Object.values(C.TIMELINE.TYPES_ALLOWED);
const {FIELDS: ES_FEEDS_FIELDS} = require("../../core/elasticsearch/templates/index/feeds/v1");

const timeline = {};

timeline.validate = (req, res, next) => {
  const userId = req.headers._id;
  const other = req.query.other;
  const type = req.query.type;

  req._userToFetch = other || userId;
  if(!TYPES_ALLOWED.includes(type)) return response(res, 400, null, "invalid/missing types");
  next();
}

timeline.search = async (req, res, next) => {
  const userId = req.headers._id;
  const other = req.query.other;
  const type = req.query.type;
  let feedsInstance = feeds.forDate(moment().format("YYYY-MM-DD"));
  const searchResult  = await feedsInstance.timeline(req._userToFetch, userId, true, type);
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
  return result;
}