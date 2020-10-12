const ApiError = require("../ApiError");
const notificationSender = require("../../../services/notification/sender");

const notification = {};

notification.trigger = async (req, res, next) => {
  const {payload, id = []} = req.body;
  if(!payload || !id.length) return next(new ApiError(400, 'E0010004', {debug: "invalid json body"}));

  notificationSender.sendPushNotificationToMultipleTokens(id, payload, (error, result) => {
    res.status(200).send({
      response: result || error
    })
    next();
  })
}

module.exports = notification;