const moment = require("moment");
const { user } = require("./../../core/Redis");

module.exports = (req, res, next) => {
  console.log(`[${moment().format("YYYY-MM-DD hh:mm:ss")}]`, "URL & PARAMS", req.url, req.query, req.headers["_id"] ? {"user-id": req.headers["_id"]} : {}, req.method, JSON.stringify(req.body));
  const userId = req.headers._id;
  if(!userId) return res.status(401).send();

  user.isUserActive(userId).then(isActive=>{
    if(!isActive) return res.status(401).send();
    else next();
  })
  
}
