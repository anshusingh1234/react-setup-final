const {MongoDB} = require("./db");
const collectionName = "feeds";
const FIELDS = {
  TYPE: 'type',
  CREATED_AT: 'created_at',
  DATA: 'data',
  TAGGED_USERS: 'tagged_users',
  FEELINGS: 'feelings',
  CHECK_IN_TEXT: 'check_in_text',
  CHECK_IN_GEO_POINTS: 'check_in_geo_points',
  AUTHOR: 'author',
  PRIVACY: 'privacy',
  PRIVATE_TO: 'private_to',
}

class Feeds extends MongoDB {
  constructor(){
    super();
  }


  async init() {
    if(!this.collection) {
      const db = await super.getDBInstance();
      this.collection = db.collection(collectionName);
    }
  }

  getCollectionInstance() {
    return this.collection;
  }

  async insertPost(post) {
    return new Promise((resolve, reject) => {
      this.collection.insertOne(post, (err, data) => {
        if(err) return reject(err);
        data.originalData = post;
        resolve(data);
      });
    });
  }
}

module.exports = {
  instance: new Feeds(),
  FIELDS
};