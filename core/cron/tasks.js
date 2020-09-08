// This module consists all the periodic tasks.
//  # ┌────────────── second (optional)
//  # │ ┌──────────── minute
//  # │ │ ┌────────── hour
//  # │ │ │ ┌──────── day of month
//  # │ │ │ │ ┌────── month
//  # │ │ │ │ │ ┌──── day of week
//  # │ │ │ │ │ │
//  # │ │ │ │ │ │
//  # * * * * * *


let Cron = require("cron").CronJob;
const elasticsearchAdmin = require('../elasticsearch/admin');
const elasticsearch = require("../elasticsearch");

module.exports = {
  createNextWeekFeedsIndex: new Cron("0 0 0 * * 3,4", () => {
    const indexName = elasticsearch.feeds.getNextWeekIndexName();
    elasticsearchAdmin.createIndex(indexName, (err, response) => {
      if(err) {
        return console.log(`Error creating next week's daily feeds index:`, err);
      }
      console.log(`Created next week's daily feeds index: ${indexName}`);
    });
  }, null, true, "GMT"),
}
