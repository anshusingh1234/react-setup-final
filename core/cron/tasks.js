let Cron = require("cron").CronJob;
const elasticsearchAdmin = require('../elasticsearch/admin');
const elasticsearch = require("../elasticsearch");

module.exports = {
  createNextWeekDailyFeedsIndex: new Cron("0 0 0 * * 3,4", () => {
    const indexName = elasticsearch.feeds.getNextWeekIndexName();
    elasticsearchAdmin.createIndex(indexName, (err, response) => {
      if(err) {
        return console.log(`Error creating next week's daily feeds index:`, err);
      }
      console.log(`Created next week's daily feeds index: ${indexName}`);
    });
  }, null, true, "GMT"),
}

const indexName = elasticsearch.feeds.getNextWeekIndexName();
elasticsearchAdmin.createIndex(indexName, (err, response) => {
  if(err) {
    return console.log(`Error creating next week's daily feeds index:`, err);
  }
  console.log(`Created next week's daily feeds index: ${indexName}`);
});