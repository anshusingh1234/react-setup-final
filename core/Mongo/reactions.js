const {MongoDB} = require("./db");
const collectionName = "reactions";
const async = require("async");

const FIELDS = {
  ID: '_id',
  ENTITY_ID: 'entity_id',
  ENTITY_TYPE: 'entity_type',
  REACTION: 'reaction',
  REACTION_USERID: 'user_id',
  REACTION_TYPE: 'reaction_type',
  REACTION_CREATED_AT: 'created_at'
}


class Reactions extends MongoDB {
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

  async insert(comment) {
    return new Promise((resolve, reject) => {
      this.collection.insertOne(comment, (err, data) => {
        if(err) return reject(err);
        data.originalData = comment;
        resolve(data);
      });
    });
  }

  async delete(params) {
    return new Promise((resolve, reject) => {
      const where = {
        [FIELDS.ID]: params.commentId
      };

      this.collection.findOneAndDelete(where, (err, data)=> {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

  async getOwner(commentId){
    return new Promise((resolve, reject) => {
      const where = {
        _id: commentId
      }

      const selectField = { 
        projection: 
        { 
          [FIELDS.USER_ID]:1
        } 
      }

      this.collection.findOne(where, selectField, (err, data)=> {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

}

module.exports = {
  instance: new Reactions(),
  FIELDS
};