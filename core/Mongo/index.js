const {instance: MongoDBInstance} = require("./db");
const feeds = require("./feeds");
const comments = require("./comments");

const mongo = {};

mongo.initMongoDB = async() => {
  await MongoDBInstance.connect();
  await feeds.instance.init();
  await comments.instance.init();
}

mongo.feeds = feeds;
mongo.comments = comments;

module.exports = mongo;
