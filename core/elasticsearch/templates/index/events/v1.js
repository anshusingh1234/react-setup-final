const FIELDS = {
  ID: "id",
  CIRCLE: "circle", //private or public
  TYPE: "type", //antakshri or fika
  TITLE: "title",
  DESCRIPTION: "description",
  PRIVACY: "privacy",
  PRIVATE_TO: "private_to",
  CREATED_AT: "created_at",
  EVENT_AT: "event_at",
};

const FIELDS_VALUES = {
  [FIELDS.PRIVACY]: {
    PUBLIC: 0,
    PRIVATE: 1,
    FRIENDS: 2,
    CUSTOM: 3,
    ADMIN: 4
  },
  [FIELDS.CIRCLE]: {
    PRIVATE: 'private',
    PUBLIC: 'public'
  },
  [FIELDS.CIRCLE]: {
    ANTAKSHRI: "antakshri",
    FIKA: "fika"
  }
}

const MAPPING = {
  "settings": {
    "number_of_shards": 5,
    "number_of_replicas": 2
  },
  "mappings": {
      "properties": {
        [FIELDS.ID]: {
          type: "keyword"
        },
        [FIELDS.CIRCLE]: {
          type: "keyword"
        },
        [FIELDS.TYPE]: {
          type: "keyword"
        },
        [FIELDS.TITLE]: {
          type: "text",
          fields: {
            english: {
              type: "text",
              analyzer: "english"
            }
          }
        },
        [FIELDS.DESCRIPTION]: {
          type: "text",
          fields: {
            english: {
              type: "text",
              analyzer: "english"
            }
          }
        },
        [FIELDS.PRIVACY]: {
          "type": "keyword"
        },
        [FIELDS.PRIVATE_TO]: {
          "type": "keyword"
        },
        [FIELDS.CREATED_AT]: {
          "type": "date",
          "format": "epoch_second"
        },
        [FIELDS.EVENT_AT]: {
          "type": "date",
          "format": "epoch_second"
        }
      }
  }
};

module.exports = {
  FIELDS,
  MAPPING,
  FIELDS_VALUES
}
