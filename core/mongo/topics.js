const {MongoDB} = require("./db");
const collectionName = "topics";
const async = require("async");

const FIELDS = {
  ID: '_id',
  TOPIC: 'topic',
  IMAGE: 'image',
  LANGUAGE: 'language',
  REGION: 'region',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at'
}


class Topics extends MongoDB {
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

  async insert(topic) {
    return new Promise((resolve, reject) => {
      this.collection.insertOne(topic, (err, data) => {
        if(err) return reject(err);
        data.originalData = topic;
        resolve(data);
      });
    });
  }

  async list(params) {
    return new Promise((resolve, reject) => {
      const skip = (params.page-1) * params.limit;
      const where = {
        [FIELDS.LANGUAGE]: params.language
      }
      this.collection.find(where).sort({ _id: -1 }).skip(skip).limit(params.limit).toArray((err, data) => {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

  async countTopics(params) {
    return new Promise((resolve, reject) => {
      const where = {
        [FIELDS.LANGUAGE]: params.language
      }
      this.collection.countDocuments(where,(err, data) => {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

  

  async delete(params) {
    return new Promise((resolve, reject) => {
      this.collection.findOneAndDelete(params, (err, data)=> {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

  async update(id, topic) {
    return new Promise((resolve, reject) => {
      this.collection.findOneAndUpdate({[FIELDS.ID]: id}, {$set: topic}, (err, data) => {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }


}

module.exports = {
  instance: new Topics(),
  FIELDS
};