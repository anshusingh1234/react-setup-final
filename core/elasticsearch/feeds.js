const moment = require('moment');
const {dateTime} = require('../../util');
const AbstractElasticsearch = require('./abstract');
const config = require("../../config/jigrrConfig").getConfig();

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

}

module.exports = {
  forDate,
  getNextWeekIndexName
}