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
  PRIVATE_TO: 'private_to'
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

  async deletePost(id){
    return new Promise((resolve, reject) => {
      if(!id) return reject(`Invalid post id ro delete ${id}`);
      const objectId = super.getObjectIdFromString(id);
      this.collection.remove({_id: objectId}, (err, data) => {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

  async updatePrivacy(id, privacy){
    return new Promise((resolve, reject) => {
      if(!id) return reject(`Invalid post id ro delete ${id}`);
      const objectId = super.getObjectIdFromString(id);
      this.collection.findOneAndUpdate({_id: objectId}, {
        $set: {
          [FIELDS.PRIVACY]: privacy
        }
      }, (err, data) => {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }
}

module.exports = {
  instance: new Feeds(),
  FIELDS
};