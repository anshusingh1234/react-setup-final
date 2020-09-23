const {instance: MongoDBInstance} = require("./db");
const feeds = require("./feeds");
const comments = require("./comments");
const reactions = require("./reactions");
const users = require("./users");

const mongo = {};

mongo.initMongoDB = async() => {
  await MongoDBInstance.connect();
  await feeds.instance.init();
  await comments.instance.init();
  await reactions.instance.init();
  await users.instance.init();
}

mongo.feeds = feeds;
mongo.comments = comments;
mongo.reactions = reactions;
mongo.users = users;

module.exports = mongo;
