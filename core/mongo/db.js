const { MongoClient, ObjectID} = require("mongodb");
const jConfig = require("../../config/jigrrConfig").getConfig();

const host = jConfig.MONGO.HOST || "localhost";
const dbName = jConfig.MONGO.DB_NAME || "build-socialMedia-stag";
const user = jConfig.MONGO.USER;
const pass = jConfig.MONGO.PASS;
const port = jConfig.MONGO.PORT || "27017"
const replicaSet = jConfig.MONGO.REPLICA_SET;

class MongoDB {
  constructor(){
    this.db = null;
    this.dbName = dbName;
    this.dbReady = false;
  }

  getDBName() {
    return this.dbName;
  }

  async getDBInstance() {
    if(!this.db) return this.connect();
    return this.db;
  }

  connect() {
    return new Promise((resolve) => {
      console.log("Starting conn");
      if(this.db) return resolve(this.db);
      let url;
      if(jConfig.ENV === 'prod'){
        url = host;
      }else{
        const authString = `${user}:${pass}@`
        url=`mongodb://`;
      if(user && pass) {
        url = `${url}${authString}`;
      }
      url = `${url}${host}/${dbName}`;
      if(replicaSet){
        url = `${url}&replicaSet=${replicaSet}`;
        }
      }
      
      console.log("MongoDB url", url);
      const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
      // Use connect method to connect to the Server
      client.connect((err) => {
        if(err) {
          console.log("Error while connecting to mongo", err);
          process.exit(1);
        }
        console.log("Connected successfully to mongo");
        this.db = client.db(this.dbName);
        this.dbReady = true;
        resolve(this.db);
      });
    })
  }

  getNewObjectId() {
    const objectId = new ObjectID();
    return objectId.toHexString();
  }

  getStringFromObjectId(objectId){
    return objectId.toHexString()
  }

  getObjectIdFromString(stringId) {
    const objectId = new ObjectID(stringId);
    return objectId;
  }
}

module.exports = {
  MongoDB,
  instance: new MongoDB()
};