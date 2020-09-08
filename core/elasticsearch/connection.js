const ElasticSearch = require('elasticsearch');

const config = require("../../config/jigrrConfig").getConfig();

if (!config.ES_CONFIG) {
  console.log("Missing ES_CONFIG in settings! quitting.");
  process.exit(1);
}
const ESClient = ElasticSearch.Client({
  hosts: config.ES_CONFIG.CONNECTION_STRING.toString().split(","),
  log: config.ES_CONFIG.LOG_LEVEL,
  apiVersion: config.ES_CONFIG.SERVER_API_VERSION
});

module.exports = {ESClient};