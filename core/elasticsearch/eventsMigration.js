const events = require("./events");
const moment = require("moment");

const migrate = {};

migrate.start = (callback) => {
  events.indexDoc(moment().valueOf(), 'antakshri', 'private', "Ankit Gurgaon", "Hello my everyone", 0, [], moment().unix(), moment("2020-09-27", "YYYY-MM-DD").unix(), (error, result) => {
    console.log(error, result)
  callback();
});
}

module.exports = migrate;