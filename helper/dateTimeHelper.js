let moment = require("moment");
let moment_timezone = require("moment-timezone");

module.exports = {
  getIndiaCurrentTime() {
    return moment(moment_timezone.tz(moment(), "Asia/Kolkata")).format("YYYY-MM-DD hh:mm:ss");
  }
}