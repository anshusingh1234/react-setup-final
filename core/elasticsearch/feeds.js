const moment = require('moment');
const {dateTime} = require('../../util');
const AbstractElasticsearch = require('./abstract');
const config = require("../../config/jigrrConfig").getConfig();
const {FIELDS: FEEDS_FIELDS, FIELDS_VALUES: FEEDS_FIELDS_VALUES} = require('./templates/index/feeds/v1')

const getNextWeekIndexName = () => `feeds-${dateTime.buildWeekIdForDate(moment().add(1, 'week').format('YYYY-MM-DD'))}`;

const CACHED_FEEDS_ELASTICSEARCH = {};

/**
* @param {*} date string representing date in YYYY-MM-DD format
*/
const forDate = (date) => {
  if(!date || typeof date !== 'string') {
    throw new TypeError('Invalid param date');
  }
  if(!CACHED_FEEDS_ELASTICSEARCH[date]) {
    // TODO: check if index exists
    const weekId = dateTime.buildWeekIdForDate(date);
    CACHED_FEEDS_ELASTICSEARCH[date] = new FeedsElasticsearch(`feeds-${weekId}`, date);
  }
  return CACHED_FEEDS_ELASTICSEARCH[date];
};

class FeedsElasticsearch extends AbstractElasticsearch {
  constructor(indexName, dateTag) {
    super(indexName);
    this.dateTag = dateTag;
  }

  indexDoc(data, callback){
    if(!data[FEEDS_FIELDS.FEED_ID] || !data[FEEDS_FIELDS.TYPE] || !data[FEEDS_FIELDS.AUTHOR] || !Object.values(FEEDS_FIELDS_VALUES[FEEDS_FIELDS.PRIVACY]).includes(data[FEEDS_FIELDS.PRIVACY])) return callback("Invalid params", null);

    if(typeof data[FEEDS_FIELDS.CONTENT] !== 'string') return callback("invalid feed content type", null);
    if(!Array.isArray(data[FEEDS_FIELDS.TAGGED_USERS])) data[FEEDS_FIELDS.TAGGED_USERS] = [];

    if(data[FEEDS_FIELDS.CHECK_IN_TEXT] && typeof data[FEEDS_FIELDS.CHECK_IN_TEXT] !== 'string') return callback("invalid check-in text", null);
    if(data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS] && (!Array.isArray(data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS]) || data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS].length !== 2)) return callback("invalid geo-points", null);
    data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS] = {
      "lat": data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS][0],
      "lon": data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS][1]
    }

    !data[FEEDS_FIELDS.PRIVATE_TO] && (data[FEEDS_FIELDS.PRIVATE_TO] = []);

    data[FEEDS_FIELDS.CREATED_AT] = moment().unix();
    data[FEEDS_FIELDS.UPDATED_AT] = moment().unix();

    data[FEEDS_FIELDS.COMMENTS_COUNT] = 0;
    data[FEEDS_FIELDS.REACTIONS_COUNT] = 0;

    const _id = `${data[FEEDS_FIELDS.FEED_ID]}:${this.dateTag}`;
    data[FEEDS_FIELDS.FEED_ID] = _id;

    console.log(JSON.stringify(data, null, 2))
    super.indexDoc(_id, data, callback);
  }

}

module.exports = {
  forDate,
  getNextWeekIndexName
}