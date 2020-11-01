const moment = require("moment");
const { user } = require("./../../core/Redis");
const C = require("../../constants");
const ssoHelper = require("../../helper/ssoHelper")

module.exports = async (req, res, next) => {
  console.log(`[${moment().format("YYYY-MM-DD hh:mm:ss")}]`, "URL & PARAMS", req.url, req.query, req.headers["_id"] ? {"user-id": req.headers["_id"]} : {}, req.method, JSON.stringify(req.body));
  const userId = req.headers._id;
  const platform = req.headers.platform;
  const version = req.headers.version;
  const token = req.headers.token;
  
  req._userId = userId;
  
  
  // if(!userId || !Object.values(C.PLATFORM.SUPPORTED).includes(platform) || !version || !token) return res.status(401).send();
  if(!userId || !Object.values(C.PLATFORM.SUPPORTED).includes(platform) || !version) return res.status(401).send();
  
  // const isTokenVerified = await ssoHelper.verify(token, userId);
  // if(!isTokenVerified) return res.status(401).send();
  
  const userProfile = await user.getUserAllDetails(userId);
  if(!userProfile || userProfile.status !== 'ACTIVE') return res.status(401).send();
  
  req._userProfile = userProfile;
  next();
}
