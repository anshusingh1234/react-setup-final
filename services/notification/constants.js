const constants = {};

constants.NOTIFICATION_TYPES = {
  FRIEND_REQUEST: 'friendRequest',
  REQUEST_ACCEPT: 'requestAccept',
  TAG_USER: 'tagUser',
  COMMENT: 'comment',
  REPLY: 'reply',
  REFERRAL_JOINED: 'referralJoined',
  FRIEND_JOINED: 'friendJoined'
}

constants.SCREEN_TYPES = {
  USER_PROFILE: 'userProfile',
  POST_DETAIL: 'postDetail'
}

constants.SCREEN_SUB_TYPES = {
  USER_PROFILE: 'userProfile',
  POST_DETAIL: 'postDetail'
}

module.exports = constants;