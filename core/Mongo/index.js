const {instance: MongoDBInstance} = require("./db");
const feeds = require("./feeds");

const mongo = {};

mongo.initMongoDB = async() => {
  await MongoDBInstance.connect();
  await feeds.instance.init();
}

mongo.feeds = feeds;

module.exports = mongo;
