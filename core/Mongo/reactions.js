const {MongoDB} = require("./db");
const collectionName = "reactions";
const async = require("async");

const FIELDS = {
  ID: '_id',
  ENTITY_ID: 'entityId',
  ENTITY_TYPE: 'entityType',
  REACTION: 'reaction',
  REACTION_USERID: 'userId',
  REACTION_TYPE: 'reaction',
  REACTION_CREATED_AT: 'createdAt'
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

  async insert(entity, reactionObj) {
    return new Promise((resolve, reject) => {
      this.collection.findOneAndUpdate(entity, {$set: entity, $addToSet: { [FIELDS.REACTION]: reactionObj  }}, { upsert: true, new: true, runValidators: true}, (err, data)=>{
        if(err) return reject(err);
        resolve(data);
      })
    });
  }

  async update(entity, reactionObj) {
    return new Promise((resolve, reject) => {

      const uniqueReactionContraint = {
        ...entity,
        [`${FIELDS.REACTION}.${[FIELDS.REACTION_USERID]}`]:reactionObj[FIELDS.REACTION_USERID]
      } 

      const pullParams = {
        [FIELDS.REACTION] : {
          [FIELDS.REACTION_USERID] : reactionObj[FIELDS.REACTION_USERID]
        }
      }

      this.collection.findOneAndUpdate(uniqueReactionContraint, {$pull: pullParams}, (err, data)=>{
        if(err) return reject(err);
        this.collection.findOneAndUpdate(entity, {$set: entity, $addToSet: { [FIELDS.REACTION]: reactionObj  }}, { upsert: true, new: true, runValidators: true}, (err, data)=>{
          if(err) return reject(err);
          resolve(data);
        })
      })
    });
  }


  

  async delete(entity, userId) {
    return new Promise((resolve, reject) => {
      const uniqueReactionContraint = {
        ...entity,
        [`${FIELDS.REACTION}.${[FIELDS.REACTION_USERID]}`]:userId
      } 

      const pullParams = {
        [FIELDS.REACTION] : {
          [FIELDS.REACTION_USERID] : userId
        }
      }

      this.collection.findOneAndUpdate(uniqueReactionContraint, {$pull: pullParams}, (err, data)=>{
        if(err) return reject(err);
        resolve(data);
      })
    });
  }

  async checkIfAlreadyReacted(entity, userId){
    return new Promise((resolve, reject) => {
      const uniqueReactionContraint = {
        ...entity,
        [`${FIELDS.REACTION}.${[FIELDS.REACTION_USERID]}`]:userId
      } 
      const selectField = { 
        projection: 
        { 
          [FIELDS.ID]:1
        } 
      }

      this.collection.findOne(uniqueReactionContraint,selectField, (err, data)=>{
        if(err) return reject(err);
        resolve(data && data[FIELDS.ID] ? true : false);
      })
    });
  }

}

module.exports = {
  instance: new Reactions(),
  FIELDS
};