const {instance: MongoDBInstance} = require("./db");
const feeds = require("./feeds");
const comments = require("./comments");

const mongo = {
  
  initMongoDB = async() => {
    await MongoDBInstance.connect();
    await feeds.instance.init();
    await comments.instance.init();
  },

  feeds,
  comments
};

module.exports = mongo;
