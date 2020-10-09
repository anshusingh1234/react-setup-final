const C = require("../../../constants");
const ApiError = require("../ApiError");
const {users} = require("../../../core/mongo");
const {referralJoined: referralJoinedNotification} = require("../../../services/notification/events");

const referrals = {};

referrals.validate = (req, res, next) => {
  const {referredBy} = req.body;

  if(!referredBy) return next(new ApiError(400, 'E0010004'))

  next();
}

referrals.save = async (req, res, next) => {
  const userId = req._userId;
  const {referredBy} = req.body;

  try{
    await users.instance.saveReferredBy(userId, referredBy);
  }catch(e){
    console.log(e)
    return next(new ApiError(500, 'E0010002'));
  }
  res.status(200).send();
  next();
}

referrals.pushNotification = async(req, res, next) => {
  next();
  const from = req._userId;
  const to = req.body.referredBy;
  referralJoinedNotification.send(from, to);
}


module.exports = referrals;