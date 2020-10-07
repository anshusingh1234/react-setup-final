const CONSTANTS = {};

CONSTANTS.TIMELINE = {
  TYPES_ALLOWED: {
    GALLERY: 'gallery',
    GALLERY_SET: 'gallerySet',
    FEEDS: 'feeds'
  },
  DEFAULT_HIDE_TIME: "3d",
  ALLOWED_HIDE_TIME: {
    "3_DAYS": '3d',
    "1_MONTH": '1m',
    "3_MONTHS": '3m',
    "6_MONTHS": '6m'
  }
}

CONSTANTS.POST = {
  MAX_REPORTS_ALLOWED: 30,
  MAX_MEDIA_ALLOWED: 9
}

CONSTANTS.PLATFORM = {
  SUPPORTED: {
    ANDROID: 'android',
    IOS: 'ios'
  }
}

CONSTANTS.REFERRALS = {
  TYPES: {
    PRIVATE: 'private',
    PUBLIC: 'public'
  }
}

CONSTANTS.CLEVERTAP = {
  CHANNEL: {
    local: {    //this key is env name. Pick env name to access it
      GENERAL: "jigrr-dev"
    },
    dev: {    //this key is env name. Pick env name to access it
      GENERAL: "jigrr-dev"
    },
    prod: {   //this key is env name. Pick env name to access it
      GENERAL: "jigrr-prod"
    },
    stg: {    //this key is env name. Pick env name to access it
      GENERAL: "jigrr-stage"
    }
  }
}

CONSTANTS.EVENTTYPE_ALLOWED = [
  'ONLINE_ANTAKSHRI',
  'ONLINE_GENERAL'
]

module.exports = CONSTANTS;