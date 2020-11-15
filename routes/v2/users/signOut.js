const {users: mongoUsers} = require("../../../core/mongo")
const ApiError = require("../ApiError");

const signOut = {};

signOut.handle = async (req, res, next) => {
  let {clevertapId, deviceId} = req.body;
  const userId = req._userId;

  if(typeof clevertapId !== 'string') clevertapId = undefined;
  if(typeof deviceId !== 'string') deviceId = undefined;

  (clevertapId || deviceId) && mongoUsers.instance.deleteClevertapIdDevideId(userId, clevertapId, deviceId);
  
  res.status(200).send();
  next();
}

module.exports = signOut;