const {users: usersMongo} = require("../../../core/mongo");
const async = require('async');
const sender = require("../sender");
const notificationConstants = require("../constants");

const reply = {};

reply.send = (from, to, feedId, commentId, replyId) => {
  return new Promise(async (resolve, reject) => {
    try{
      if(!from || !to || !feedId || !commentId || !replyId) return resolve();

      const fromUserId = typeof from === 'string' ? from : from._id;
      const toUserId = typeof to === 'string' ? to : to._id;
      let userIdsToFetch = [];
      let userMap = new Map();
      if(typeof from === 'string'){
        userIdsToFetch.push(from);
      }else{
        userMap.set(from.id, from);
      }
      if(typeof to === 'string'){
        userIdsToFetch.push(to);
      }else{
        userMap.set(to.id, to);
      }
      if(userIdsToFetch.length){
        const _um = await _fetchUserDetail(userIdsToFetch);
        userMap = new Map([...userMap, ..._um]);
      }
      const payload = _createPayload(from, to, userMap, feedId, commentId, replyId);
      const {clevertapId} = typeof to === 'string' ? userMap.get(to) : to;
      if(!clevertapId) return resolve();
      const clevertapIds = [...new Set(clevertapId.map(_obj => _obj.id))];

      usersMongo.instance.incrementBadgeCount(toUserId);
      sender.sendPushNotificationToMultipleTokens(clevertapIds, payload, () => resolve());
    }catch(e){
      return reject(e);
    }
  })
}

module.exports = reply;

const _createPayload = (from, to, userMap, feedId, commentId, replyId) => {
  const fromUserDetail = typeof from === 'string' ? userMap.get(from): from;
  const toUserDetail = typeof to === 'string' ? userMap.get(to): to;
  const title = `${fromUserDetail.name} replied`;
  const subTitle = `on your comment`;
  const payloadData = {
    notificationType: notificationConstants.NOTIFICATION_TYPES.REPLY,
    title,
    subTitle,
    screenType: notificationConstants.SCREEN_TYPES.POST_DETAIL,
    screenSubType: notificationConstants.SCREEN_SUB_TYPES.POST_DETAIL,
    user: {
      id: fromUserDetail._id,
      name: fromUserDetail.name,
      profilePic: fromUserDetail.profilePic
    },
    data: {
      feedId, commentId, replyId
    },
    badge_count: toUserDetail.badgeCount || 1
  };
  let payload = {
    title,
    body: subTitle,
    platform_specific: {
      ios: payloadData,
      android: payloadData
    },
    data: payloadData
  };
  return payload;
}

const _fetchUserDetail = (userIds) => {
  return new Promise((resolve, reject) => {
    let userMap = new Map();
    let scripts = [];
    userIds.forEach(_userId => {
      scripts.push(cb => usersMongo.instance.fullDetail(_userId).then(_det => {
        if(!_det) return reject("Error in fetching user detail");
        userMap.set(_userId, _det);
        cb();
      }))
    })
    async.parallelLimit(scripts, 10, () => resolve(userMap));
  })
}