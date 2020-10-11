const FIELDS = {
  FEED_ID: 'feed_id',
  TYPE: 'type',
  SUB_TYPE: 'sub_type',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  DATA: 'data',
  MEDIA: 'media',
  TAGGED_USERS: 'tagged_users',
  FEELINGS: 'feelings',
  CHECK_IN_TEXT: 'check_in_text',
  CHECK_IN_GEO_POINTS: 'check_in_geo_points',
  AUTHOR: 'author',
  PRIVACY: 'privacy',
  PRIVATE_TO: 'private_to',
  COMMENTED_BY: 'commented_by',
  REACTION_BY: 'reaction_by',
  COMMENTS_COUNT: 'comments_count',
  REACTIONS_COUNT: 'reactions_count',
  STATUS: 'status',
  REPORTED_BY: 'reported_by',
  HIDDEN_BY: 'hidden_by',
  SEARCHABLE_CONTENT: 'searchable_content'
}

const FIELDS_VALUES = {
  [FIELDS.PRIVACY]: {
    PUBLIC: 0,
    FRIENDS: 1,
    PRIVATE: 2,
    CUSTOM: 3,
    ADMIN: 4
  },
  [FIELDS.TYPE]: {
    MOMENTS: 'moments'
  },
  [FIELDS.STATUS]: {
    LIVE: 1,
    REPORTED: 2
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
      [FIELDS.SUB_TYPE]: {
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
      [FIELDS.DATA]: {
        enabled: false
      },
      [FIELDS.MEDIA]: {
        enabled: false
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
      },
      [FIELDS.COMMENTED_BY]: {
        type: "keyword"
      },
      [FIELDS.REACTION_BY]: {
        type: "keyword"
      },
      [FIELDS.STATUS]: {
        type: "keyword"
      },
      [FIELDS.REPORTED_BY]: {
        type: "keyword"
      },
      [FIELDS.HIDDEN_BY]: {
        type: "keyword"
      },
      [FIELDS.SEARCHABLE_CONTENT]: {
        type: "text",
        fields: {
          english: {
            type: "text",
            analyzer: "english"
          }
        }
      }
    }
  }
}

module.exports = {
  FIELDS,
  MAPPING,
  FIELDS_VALUES
}