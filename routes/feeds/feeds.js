const {feeds} = require("../../core/elasticsearch");
const moment = require("moment");

const feedsSearch = {};

feedsSearch.search = async (req, res, next) => {
  const feedsInstance = feeds.forDate(moment().format("YYYY-MM-DD"));
  const searchResult  = await feedsInstance.searchFeed(req.headers._id, ["dkjnsjknjsdknjksdnsjkd"], []);
  res.status(200).send(searchResult);
  next();
}

module.exports = feedsSearch;