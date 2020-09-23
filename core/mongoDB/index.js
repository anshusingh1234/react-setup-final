const {instance: MongoDBInstance} = require("./db");
const feeds = require("./feeds");
const comments = require("./comments");
const reactions = require("./reactions");

const mongo = {};

mongo.initMongoDB = async() => {
  await MongoDBInstance.connect();
  await feeds.instance.init();
  await comments.instance.init();
  await reactions.instance.init();
}

mongo.feeds = feeds;
mongo.comments = comments;
mongo.reactions = reactions;

module.exports = mongo;
