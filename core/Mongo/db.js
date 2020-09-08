import { MongoClient, ObjectID} from "mongodb";
const jConfig = require("./config/jigrrConfig").getConfig();

const host = jConfig.MONGO.HOST || "0.0.0.0";
const dbName = jConfig.MONGO.DB_NAME || "jigrr";
const user = jConfig.MONGO.USER;
const pass = jConfig.MONGO.PASS;
const port = jConfig.MONGO.PORT || "27017"
const replicaSet = jConfig.MONGO.REPLICA_SET;

class MongoDB {
  static db = null;
  static dbName = dbName;
  static dbReady = false;

  static getDBName() {
    return MongoDB.dbName;
  }

  static async getDBInstance() {
    if(!MongoDB.db) return MongoDB.connect();
    return MongoDB.db;
  }

  static connect() {
    return new Promise((resolve) => {
      console.log("Starting conn");
      if(MongoDB.db) return resolve(MongoDB.db);

      const authString = `${user}:${pass}@`
      let url=`mongodb://`;
      if(user && pass) {
        url = `${url}${authString}`;
      }
      url = `${url}${host}:27017/?authSource=${dbName}`;
      if(replicaSet) {
        url = `${url}&replicaSet=${replicaSet}`;
      }
      console.log("MongoDB url", url);
      const client = new MongoClient(url);
      // Use connect method to connect to the Server
      client.connect((err) => {
        if(err) {
          console.log("Error while connecting to mongo", err);
          process.exit(1);
        }
        console.log("Connected successfully to mongo");
        MongoDB.db = client.db(MongoDB.dbName);
        MongoDB.dbReady = true;
        resolve(MongoDB.db);
      });
    })
  }

  static getNewObjectId() {
    const objectId = new ObjectID();
    return objectId.toHexString();
  }
}

module.exports = MongoDB;
