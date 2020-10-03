const moment = require('moment');
const {dateTime} = require('../../util');
const AbstractElasticsearch = require('./abstract');
const config = require("../../config/jigrrConfig").getConfig();
const {FIELDS: FEEDS_FIELDS, FIELDS_VALUES: FEEDS_FIELDS_VALUES, FIELDS_VALUES} = require('./templates/index/feeds/v1');
const {feeds: FEEDS_QUERY} = require("./queries");
const {feeds: FEEDS_SCRIPT} = require("./scripts");
const C = require("../../constants");

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

/**
* @param {*} feedId string representing date in YYYY-MM-DD format
*/
const forId = (feedId) => {
  if(!feedId || feedId.indexOf(':') <= -1) {
    throw new TypeError('Invalid param feedId');
  }
  const [_id, date] = feedId.split(":");
  if(!CACHED_FEEDS_ELASTICSEARCH[date]) {
    // TODO: check if index exists
    const weekId = dateTime.buildWeekIdForDate(date);
    CACHED_FEEDS_ELASTICSEARCH[date] = new FeedsElasticsearch(`feeds-${weekId}`, date);
  }
  return CACHED_FEEDS_ELASTICSEARCH[date];
};

const currentWeekInstance = () => {
  const date = moment().format("YYYY-MM-DD");
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
  * @param {String} data[FEEDS_FIELDS.SUB_TYPE] [Mandatory]
  * @param {String} data[FEEDS_FIELDS.AUTHOR] [Mandatory] author of the post
  * @param {String} data[FEEDS_FIELDS.PRIVACY] [Mandatory] privacy of the post
  * @param {*} callback
  */
  indexDoc({...data}, callback){
    if(!data[FEEDS_FIELDS.FEED_ID] || !data[FEEDS_FIELDS.TYPE] || !data[FEEDS_FIELDS.SUB_TYPE] || !data[FEEDS_FIELDS.AUTHOR] || !Object.values(FEEDS_FIELDS_VALUES[FEEDS_FIELDS.PRIVACY]).includes(data[FEEDS_FIELDS.PRIVACY])) return callback("Invalid params", null);

    if(typeof data[FEEDS_FIELDS.DATA] !== 'object') return callback("invalid feed data type", null);
    if(!Array.isArray(data[FEEDS_FIELDS.TAGGED_USERS])) data[FEEDS_FIELDS.TAGGED_USERS] = [];

    if(data[FEEDS_FIELDS.CHECK_IN_TEXT] && typeof data[FEEDS_FIELDS.CHECK_IN_TEXT] !== 'string') return callback("invalid check-in text", null);
    if(data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS] && (!Array.isArray(data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS]) || data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS].length !== 2)) return callback("invalid geo-points", null);
    data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS] && (data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS] = {
      "lat": data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS][0],
      "lon": data[FEEDS_FIELDS.CHECK_IN_GEO_POINTS][1]
    })

    !data[FEEDS_FIELDS.PRIVATE_TO] && (data[FEEDS_FIELDS.PRIVATE_TO] = []);

    data[FEEDS_FIELDS.UPDATED_AT] = data[FEEDS_FIELDS.CREATED_AT];

    data[FEEDS_FIELDS.COMMENTS_COUNT] = 0;
    data[FEEDS_FIELDS.REACTIONS_COUNT] = 0;

    if(data[FEEDS_FIELDS.DATA] && Array.isArray(data[FEEDS_FIELDS.DATA].media)){
      data[FEEDS_FIELDS.MEDIA] = data[FEEDS_FIELDS.DATA].media;
      delete data[FEEDS_FIELDS.DATA].media;
    }

    data[FEEDS_FIELDS.STATUS] = FIELDS_VALUES[FEEDS_FIELDS.STATUS].LIVE;

    const _id = `${data[FEEDS_FIELDS.FEED_ID]}:${this.dateTag}`;
    data[FEEDS_FIELDS.FEED_ID] = _id;
    super.indexDoc(_id, data, (error, result) => {
      if(result && typeof result === 'object'){
        result.feedId = _id;
      }
      callback(error, result);
    });
  }

  /**
  * fetching feed for the user
  * @param {*} userId user whose feeds are getting fetched
  * @param {*} friends friends of the user
  * @param {*} following following list of the user
  */
  searchFeed(userId, friends = [], following = []){
    const query = FEEDS_QUERY.searchFeeds(userId, {
      friends, following
    });
    const _body = {
      size: 100,
      query,
      sort: [{[FEEDS_FIELDS.UPDATED_AT]: "desc"}]
    };
    console.log(JSON.stringify(_body, null, 2))
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

  /**
  * Adding user id if commented on a post
  * @param {*} feedId
  * @param {*} userId
  */
  commentedBy(feedId, userId){
    if (!feedId || !userId) {
      throw new Error('Invalid argument(s)');
    }
    return new Promise((resolve, reject) => {
      super.addToken(feedId, FEEDS_FIELDS.COMMENTED_BY, userId, _fulfillPromiseCallback(resolve, reject));
    })
  }

  /**
  * Adding user id if reacted on a post
  * @param {*} feedId
  * @param {*} userId
  */
  reactedBy(feedId, userId){
    if (!feedId || !userId) {
      throw new Error('Invalid argument(s)');
    }
    return new Promise((resolve, reject) => {
      super.addToken(feedId, FEEDS_FIELDS.REACTION_BY, userId, _fulfillPromiseCallback(resolve, reject));
    })
  }

  /**
  * fetching timeline for the user
  * @param {*} userId user whose feeds are getting fetched
  */
  timeline(author, userId, isFriend, type, hideTime){
    const query = FEEDS_QUERY.timeline(author, userId, isFriend, hideTime);
    const _body = {
      size: 100,
      query,
      sort: [{[FEEDS_FIELDS.UPDATED_AT]: "desc"}]
    };
    if(type === C.TIMELINE.TYPES_ALLOWED.GALLERY || type === C.TIMELINE.TYPES_ALLOWED.GALLERY_SET){
      _body._source = [FEEDS_FIELDS.MEDIA, FEEDS_FIELDS.CREATED_AT];
    }
    return new Promise((resolve, reject) => super.indexSearch("feeds-*", _body, _fulfillPromiseCallback(resolve, reject)));
  }

  /**
  * fetching timeline for the user
  * @param {*} userId user whose feeds are getting fetched
  */
  timelineRewards(type){
    const query = FEEDS_QUERY.timelineRewards();
    const _body = {
      size: 100,
      query,
      sort: [{[FEEDS_FIELDS.UPDATED_AT]: "desc"}]
    };
    if(type === C.TIMELINE.TYPES_ALLOWED.GALLERY || type === C.TIMELINE.TYPES_ALLOWED.GALLERY_SET){
      _body._source = [FEEDS_FIELDS.MEDIA, FEEDS_FIELDS.CREATED_AT];
    }
    return new Promise((resolve, reject) => super.indexSearch("feeds-*", _body, _fulfillPromiseCallback(resolve, reject)));
  }

  /**
  * Updating the privacy of the post
  * @param {*} feedId
  * @param {*} privacy
  * @param {*} callback
  */
  updatePrivacy(feedId, privacy, callback){
    super.updateWithPartialDocWithScript(feedId, FEEDS_SCRIPT.updatePrivacy(privacy), true, callback)
  }

  /**
  * Reporting a post
  * @param {*} feedId
  * @param {*} callback
  */
  reportPost(feedId, userId, callback){
    super.updateWithPartialDocWithScript(feedId, FEEDS_SCRIPT.reportPost(userId), false, callback)
  }

  /**
  * making post a live
  * @param {*} feedId
  * @param {*} callback
  */
  makePostLive(feedId, callback){
    super.updateWithPartialDocWithScript(feedId, FEEDS_SCRIPT.makePostLive(), true, callback)
  }

  getDetail(feedId){
    return new Promise((resolve, reject) => {
      super.getById(feedId, {}, (error, detail) => {
        if(error) return reject(error);
        resolve(detail);
      })
    })
  }

  totalRewards(){
    const query = FEEDS_QUERY.timelineRewards();
    const _body = {
      size: 0,
      query
    };
    return new Promise((resolve, reject) => super.indexSearch("feeds-*", _body, (error, result) => {
      let _return = 0;
      result && result.hits.total && result.hits.total.value && (_return = result.hits.total.value);
      resolve(_return);
    }));
  }
}

module.exports = {
  forDate,
  forId,
  getNextWeekIndexName,
  currentWeekInstance
}

function _fulfillPromiseCallback(resolve, reject) {
  return (err, response) => {
    if(err) {
      return reject(err);
    }
    resolve(response);
  };
}