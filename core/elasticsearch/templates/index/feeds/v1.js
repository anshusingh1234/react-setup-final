const FIELDS = {
  FEED_ID: 'feed_id',
  TYPE: 'type',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  CONTENT: 'content',
  TAGGED_USERS: 'tagged_users',
  FEELINGS: 'feelings',
  CHECK_IN_TEXT: 'check_in_text',
  CHECK_IN_GEO_POINTS: 'check_in_geo_points',
  AUTHOR: 'author',
  PRIVACY: 'privacy',
  PRIVATE_TO: 'private_to',
  COMMENTS_COUNT: 'comments_count',
  REACTIONS_COUNT: 'reactions_count'
}

const FIELDS_VALUES = {
  [FIELDS.PRIVACY]: {
    PUBLIC: 0,
    PRIVATE: 1,
    FRIENDS: 2,
    CUSTOM: 3
  },
  [FIELDS.TYPE]: {
    MOMENTS: 'moments'
  }
}

const MAPPING = {
  "settings": {
    "number_of_shards": 5,
    "number_of_replicas": 2
  },
  "mappings": {
    "properties": {
      [FIELDS.FEED_ID]: {
        type: "keyword"
      },
      [FIELDS.TYPE]: {
        type: "keyword"
      },
      [FIELDS.CREATED_AT]: {
        "type": "date",
        "format": "epoch_second"
      },
      [FIELDS.UPDATED_AT]: {
        "type": "date",
        "format": "epoch_second"
      },
      [FIELDS.CONTENT]: {
        type: "keyword"
      },
      [FIELDS.TAGGED_USERS]: {
        type: "keyword"
      },
      [FIELDS.FEELINGS]: {
        type: "keyword"
      },
      [FIELDS.CHECK_IN_TEXT]: {
        type: "keyword"
      },
      [FIELDS.CHECK_IN_GEO_POINTS]: {
        type: "geo_point"
      },
      [FIELDS.AUTHOR]: {
        type: "keyword"
      },
      [FIELDS.PRIVACY]: {
        type: "integer"
      },
      [FIELDS.PRIVATE_TO]: {
        type: "keyword"
      },
      [FIELDS.COMMENTS_COUNT]: {
        type: "integer"
      },
      [FIELDS.REACTIONS_COUNT]: {
        type: "integer"
      }
    }
  }
}

module.exports = {
  FIELDS,
  MAPPING,
  FIELDS_VALUES
}