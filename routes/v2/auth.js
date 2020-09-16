const moment = require("moment");

module.exports = (req, res, next) => {
  console.log(`[${moment().format("YYYY-MM-DD hh:mm:ss")}]`, "URL & PARAMS", req.url, req.query, req.headers["_id"] ? {"user-id": req.headers["_id"]} : {}, req.method, JSON.stringify(req.body));
  const userId = req.headers._id;
  if(!userId) return res.status(401).send();
  //TODO check if userId is active or not
  next();
}
