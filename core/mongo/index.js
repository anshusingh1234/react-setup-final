const {instance: MongoDBInstance} = require("./db");
const feeds = require("./feeds");
const comments = require("./comments");
const reactions = require("./reactions");
const users = require("./users");
const contacts = require("./contacts");
const topics = require("./topics");
const events = require("./events");

const mongo = {};

mongo.initMongoDB = async() => {
  await MongoDBInstance.connect();
  await feeds.instance.init();
  await comments.instance.init();
  await reactions.instance.init();
  await users.instance.init();
  await contacts.instance.init();
  await topics.instance.init();
  await events.instance.init();
  
}

mongo.feeds = feeds;
mongo.comments = comments;
mongo.reactions = reactions;
mongo.users = users;
mongo.contacts = contacts;
mongo.topics = topics;
mongo.events = events;

module.exports = mongo;
