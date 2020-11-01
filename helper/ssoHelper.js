let randToken = require("rand-token");
const {sso: ssoRedis} = require("../core/Redis");''

const ssoHelper = {};

ssoHelper.generateAndSave = async(userId) => {
  const token = randToken.generate(64);
  await ssoRedis.save(userId, token);
  return token;
}

ssoHelper.verify = async(token, userId) => {
  const _userId = await ssoRedis.get(token);
  const isVerified = userId === _userId;
  isVerified && ssoRedis.updateExpiry(token);
  return isVerified;
}

module.exports = ssoHelper;