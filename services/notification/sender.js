let C = require("../../constants");
let request = require("request");

let async = require("async");

let config = require("../../config/jigrrConfig").getConfig();

let dateTimeHelper = require("../../helper/dateTimeHelper");

const self = module.exports = {
  sendPushNotificationToSingleToken: (clevertapId, payload, callback) => {
    let notificationBody = {
      to: {
        objectId: [clevertapId]
      },
      tag_group: payload.data.tag_group || payload.data.notificationType,
      content: _addChannelId(payload),
      when: "now"
    };

    let options = {
      url: "https://api.clevertap.com/1/send/push.json",
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8;",
        "Content-Length": Buffer.byteLength(JSON.stringify(notificationBody)),
        "X-CleverTap-Account-Id": config.CLEVERTAP.ACCOUNT_ID,
        "X-CleverTap-Passcode": config.CLEVERTAP.PASSCODE
      },
      json: notificationBody
    };

    console.log(`[${dateTimeHelper.getIndiaCurrentTime()}] sending notification to: ${clevertapId}`, JSON.stringify(notificationBody, null, 2));
    request(options, (error, response, body) => {
      if (error) {
        console.log(`[${dateTimeHelper.getIndiaCurrentTime()}] Error in sending notification: ${error}`);
      }
      if (body) {
        console.log(`[${dateTimeHelper.getIndiaCurrentTime()}] Notification sent to ${clevertapId} | ${JSON.stringify(body, null, 2)}`);
      }
      callback(null, {error: error, response: response, body: body});
    });
  },

  sendPushNotificationToMultipleTokens: (clevertapIds, payload, callback) => {
    let scripts = [];
    clevertapIds = [... new Set(clevertapIds)];

    clevertapIds.forEach(id => {
      scripts.push(cb => {
        self.sendPushNotificationToSingleToken(id, payload, (error, result) => {
          cb(null, {error: error, result: result});
        });
      });
    });

    async.parallelLimit(scripts, 5, (error, result) => {
      callback(error, result);
    });
  }
};


const _addChannelId = (payload) => {
  if(payload &&  payload.platform_specific && payload.platform_specific.android){
    payload.platform_specific.android.wzrk_cid = C.CLEVERTAP.CHANNEL[config["ENV"]].GENERAL;
  }
  return payload;
}