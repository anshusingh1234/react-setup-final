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
  MAX_REPORTS_ALLOWED: 30
}

module.exports = CONSTANTS;