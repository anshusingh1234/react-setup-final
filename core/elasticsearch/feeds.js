const moment = require('moment');
const {dateTime} = require('../../util');
const AbstractElasticsearch = require('./abstract');
const config = require("../../config/jigrrConfig").getConfig();
const {FIELDS: FEEDS_FIELDS, FIELDS_VALUES: FEEDS_FIELDS_VALUES} = require('./templates/index/feeds/v1');
const {feeds: FEEDS_QUERY} = require("./queries");
const {feeds: FEEDS_SCRIPT} = require("./scripts");

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

  /**
  * adding a new document in the feed
  * @param {String} data[FEEDS_FIELDS.FEED_ID] [Mandatory] feed id to create in the format => <_id>:<date>
  * @param {String} data[FEEDS_FIELDS.TYPE] [Mandatory]
  * @param {String} data[FEEDS_FIELDS.AUTHOR] [Mandatory] author of the post
  * @param {String} data[FEEDS_FIELDS.PRIVACY] [Mandatory] privacy of the post
  * @param {*} callback
  */
  indexDoc(data, callback){
    if(!data[FEEDS_FIELDS.FEED_ID] || !data[FEEDS_FIELDS.TYPE] || !data[FEEDS_FIELDS.AUTHOR] || !Object.values(FEEDS_FIELDS_VALUES[FEEDS_FIELDS.PRIVACY]).includes(data[FEEDS_FIELDS.PRIVACY])) return callback("Invalid params", null);

    if(typeof data[FEEDS_FIELDS.CONTENT] !== 'string') return callback("invalid feed content type", null);
    if(!Array.isArray(data[FEEDS_FIELDS.TAGGED_USERS])) data[FEEDS_FIELDS.TAGGED_USERS] = [];

    if(data[FEEDS_FIELDS.CHECK_IN_TEXT] && typeof data[FEEDS_FIELDS.CHECK_IN_TEXT] !== 'string') return callback("invalid check-in text", null);
    if(data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS] && (!Array.isArray(data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS]) || data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS].length !== 2)) return callback("invalid geo-points", null);
    data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS] && (data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS] = {
      "lat": data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS][0],
      "lon": data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS][1]
    })

    !data[FEEDS_FIELDS.PRIVATE_TO] && (data[FEEDS_FIELDS.PRIVATE_TO] = []);

    data[FEEDS_FIELDS.CREATED_AT] = moment().unix();
    data[FEEDS_FIELDS.UPDATED_AT] = moment().unix();

    data[FEEDS_FIELDS.COMMENTS_COUNT] = 0;
    data[FEEDS_FIELDS.REACTIONS_COUNT] = 0;

    const _id = `${data[FEEDS_FIELDS.FEED_ID]}:${this.dateTag}`;
    data[FEEDS_FIELDS.FEED_ID] = _id;

    super.indexDoc(_id, data, callback);
  }

  /**
  * fetching feed for the user
  * @param {*} userId
  * @param {*} friends
  */
  searchFeed(userId, friends = []){
    const query = FEEDS_QUERY.searchFeeds(userId, {
      friends
    });
    console.log(JSON.stringify(query, null, 2))
    const _body = {
      size: 100,
      query,
      sort: [{[FEEDS_FIELDS.UPDATED_AT]: "desc"}]
    };
    return new Promise((resolve, reject) => super.indexSearch("feeds-*", _body, _fulfillPromiseCallback(resolve, reject)));
  }

  /**
  * incrementing reaction count by some value
  * @param {*} feedId feed id to update
  * @param {*} incrementBy value to increase by
  */
  incrementReactionCount(feedId, incrementBy){
    if (!feedId || !incrementBy) {
      throw new Error('Invalid argument(s)');
    }
    return new Promise((resolve, reject) => {
      super.update(feedId, FEEDS_SCRIPT.incrementReactionCount(incrementBy), _fulfillPromiseCallback(resolve, reject));
    })
  }

  /**
  * incrementing comment count by some value
  * @param {*} feedId feed id to update
  * @param {*} incrementBy value to increase by
  */
  incrementCommentCount(feedId, incrementBy){
    if (!feedId || !incrementBy) {
      throw new Error('Invalid argument(s)');
    }
    return new Promise((resolve, reject) => {
      super.update(feedId, FEEDS_SCRIPT.incrementCommentCount(incrementBy), _fulfillPromiseCallback(resolve, reject));
    })
  }

  /**
  * decrementing reaction count by some value
  * @param {*} feedId feed id to update
  * @param {*} decrementBy value to decrease by
  */
  decrementReactionCount(feedId, decrementBy){
    if (!feedId || !decrementBy) {
      throw new Error('Invalid argument(s)');
    }
    return new Promise((resolve, reject) => {
      super.update(feedId, FEEDS_SCRIPT.decrementReactionCount(decrementBy), _fulfillPromiseCallback(resolve, reject));
    })
  }

  /**
  * decrementing comment count by some value
  * @param {*} feedId feed id to update
  * @param {*} decrementBy value to decrease by
  */
  decrementCommentCount(feedId, decrementBy){
    if (!feedId || !decrementBy) {
      throw new Error('Invalid argument(s)');
    }
    return new Promise((resolve, reject) => {
      super.update(feedId, FEEDS_SCRIPT.decrementCommentCount(decrementBy), _fulfillPromiseCallback(resolve, reject));
    })
  }
}

module.exports = {
  forDate,
  getNextWeekIndexName
}

function _fulfillPromiseCallback(resolve, reject) {
  return (err, response) => {
    if(err) {
      return reject(err);
    }
    resolve(response);
  };
}