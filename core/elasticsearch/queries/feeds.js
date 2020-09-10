const {FIELDS: FEEDS_FIELDS, FIELDS_VALUES: FEEDS_FIELDS_VALUES} = require("../templates/index/feeds/v1");

const query = {};

query.searchFeeds = (userId, options) => {
  let shouldArray = [];

  shouldArray.push({
    "term": {
      [FEEDS_FIELDS.AUTHOR]: userId
    }
  });

  shouldArray.push({
    "bool": {
      "must": [{
        "term": {
          [FEEDS_FIELDS.PRIVACY]: FEEDS_FIELDS_VALUES[FEEDS_FIELDS.PRIVACY].PRIVATE
        }
      },{
        "term": {
          [FEEDS_FIELDS.AUTHOR]: userId
        }
      }]
    }
  });

  shouldArray.push({
    "bool": {
      "must": [{
        "term": {
          [FEEDS_FIELDS.PRIVACY]: FEEDS_FIELDS_VALUES[FEEDS_FIELDS.PRIVACY].PUBLIC
        }
      },{
        "term": {
          [FEEDS_FIELDS.PRIVATE_TO]: userId
        }
      }]
    }
  });

  shouldArray.push({
    "bool": {
      "must": [{
        "term": {
          [FEEDS_FIELDS.PRIVACY]: FEEDS_FIELDS_VALUES[FEEDS_FIELDS.PRIVACY].FRIENDS
        }
      },{
        "terms": {
          [FEEDS_FIELDS.AUTHOR]: options.friends || []
        }
      }],
      "must_not": [{
        "term": {
          [FEEDS_FIELDS.PRIVATE_TO]: userId
        }
      }]
    }
  })

  shouldArray.push({
    "bool": {
      "must": [{
        "term": {
          [FEEDS_FIELDS.PRIVACY]: FEEDS_FIELDS_VALUES[FEEDS_FIELDS.PRIVACY].CUSTOM
        }
      },{
        "terms": {
          [FEEDS_FIELDS.AUTHOR]: options.friends || []
        }
      },{
        "term": {
          [FEEDS_FIELDS.PRIVATE_TO]: userId
        }
      }]
    }
  });

  return {
    "bool": {
      "should": shouldArray
    }
  }
}

module.exports = query;