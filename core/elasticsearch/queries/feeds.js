const {FIELDS: FEEDS_FIELDS, FIELDS_VALUES: FEEDS_FIELDS_VALUES} = require("../templates/index/feeds/v1");

const query = {};

query.searchFeeds = (userId, options) => {
  let shouldArray = [];
  let mustArray = [];

  mustArray.push({
    "term": {
      [FEEDS_FIELDS.STATUS]: FEEDS_FIELDS_VALUES[FEEDS_FIELDS.STATUS].LIVE
    }
  })

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
        "bool": {
          "should": [{
            "terms": {
              [FEEDS_FIELDS.REACTION_BY]: options.friends || []
            }
          },{
            "terms": {
              [FEEDS_FIELDS.COMMENTED_BY]: options.friends || []
            }
          },{
            "terms": {
              [FEEDS_FIELDS.AUTHOR]: options.friends || []
            }
          },{
            "terms": {
              [FEEDS_FIELDS.AUTHOR]: options.following || []
            }
          }]
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

  shouldArray.push({
    "bool": {
      "must": [{
        "term": {
          [FEEDS_FIELDS.PRIVACY]: FEEDS_FIELDS_VALUES[FEEDS_FIELDS.PRIVACY].ADMIN
        }
      }]
    }
  })

  return {
    "bool": {
      "should": shouldArray,
      "must": mustArray
    }
  }
}

query.timeline = (author, userId, isFriend, hideTime) => {
  let shouldArray = [];
  let mustArray = [];

  mustArray.push({
    "term": {
      [FEEDS_FIELDS.AUTHOR]: author
    }
  });

  (userId === author) && shouldArray.push({
    "bool": {
      "must": [{
        "term": {
          [FEEDS_FIELDS.PRIVACY]: FEEDS_FIELDS_VALUES[FEEDS_FIELDS.PRIVACY].PRIVATE
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
      }]
    }
  });

  isFriend && shouldArray.push({
    "bool": {
      "must": [{
        "term": {
          [FEEDS_FIELDS.PRIVACY]: FEEDS_FIELDS_VALUES[FEEDS_FIELDS.PRIVACY].FRIENDS
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
        "term": {
          [FEEDS_FIELDS.PRIVATE_TO]: userId
        }
      }]
    }
  });

  mustArray.push({
    "range": {
      [FEEDS_FIELDS.CREATED_AT]: {
        "gte": `now-${hideTime}`
      }
    }
  })

  mustArray.push({
    "term": {
      [FEEDS_FIELDS.STATUS]: FEEDS_FIELDS_VALUES[FEEDS_FIELDS.STATUS].LIVE
    }
  })

  return {
    "bool": {
      "should": shouldArray,
      "must": mustArray
    }
  }
}

module.exports = query;