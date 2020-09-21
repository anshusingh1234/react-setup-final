const moment = require("moment");
const { user } = require("./../../core/Redis");
const C = require("../../constants");

module.exports = (req, res, next) => {
  console.log(`[${moment().format("YYYY-MM-DD hh:mm:ss")}]`, "URL & PARAMS", req.url, req.query, req.headers["_id"] ? {"user-id": req.headers["_id"]} : {}, req.method, JSON.stringify(req.body));
  const userId = req.headers._id;
  const platform = req.headers.platform;
  const version = req.headers.version;
  if(!userId || !Object.values(C.PLATFORM.SUPPORTED).includes(platform) || !version) return res.status(401).send();

  // user.isUserActive(userId).then(isActive=>{
  //   if(!isActive) return res.status(401).send();
  //   else next();
  // })
  next();

}
