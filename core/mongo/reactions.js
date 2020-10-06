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

  async getCount(commentIDs){
    return new Promise((resolve, reject) => {
      let map = new Map();

      const project =  [
        { '$match': {
          [FIELDS.ENTITY_ID]: {$in:commentIDs},
          [FIELDS.ENTITY_TYPE]: 'comment'
        },
      },
      {$project: {  'commentId':`$${FIELDS.ENTITY_ID}`,count: { $size:`$${FIELDS.REACTION}` }}}
    ]
    this.collection.aggregate(project).toArray((err, data)=>{
      if(err) return reject(err);

      data.map(el=>{
        map.set(el.commentId, el.count);
      })

      return resolve(map);
    });
  })
}

async checkIfUserReacted(entityIds, userId, entityType){
  return new Promise((resolve, reject) => {
    let map = new Map();
    const project = [
      {$match: {
        [FIELDS.ENTITY_ID]: {$in:entityIds},
        [FIELDS.ENTITY_TYPE]: entityType,
      }},
      {$project: {
        reaction: {$filter: {
          input: `$${FIELDS.REACTION}`,
          as: `${FIELDS.REACTION}`,
          cond: {$eq: [`$$${FIELDS.REACTION}.${FIELDS.REACTION_USERID}`, userId]}
        }},
        _id: 0,
        'entityId':`$${FIELDS.ENTITY_ID}`,
      }}
    ]
    this.collection.aggregate(project).toArray((err, data)=>{
      if(err) return reject(err);

      data.map(el=>{
        if(el.reaction && el.reaction[0] && el.reaction[0].reaction)
        map.set(el.entityId, el.reaction[0].reaction);
      })
      return resolve(map);
    });
  })
}

async reactionsWithTotal(entityIds, entityType){
  const reactionUserKey = `${FIELDS.REACTION}.${FIELDS.REACTION_USERID}`;
  const reactionReactionKey = `${FIELDS.REACTION}.${FIELDS.REACTION_TYPE}`;
  return new Promise((resolve, reject) => {
    const matchQuery = {
      [FIELDS.ENTITY_ID]: {
        $in: entityIds
      },
      [FIELDS.ENTITY_TYPE]: entityType
    }
    this.collection.aggregate([{
      $facet: {
        allData: [{
          $match: matchQuery
        },{
          $sort: {
            [FIELDS.REACTION_CREATED_AT]: -1
          }
        },{
          $project: {
            "_id": 0,
            [reactionUserKey]: 1,
            [reactionReactionKey]: 1,
            [FIELDS.ENTITY_ID]: 1,
          }
        }]
      }
    }]).toArray((error, result = []) => {
      let map = new Map();
      if(result){
        result[0].allData.forEach(_obj => {
          map.set(_obj[FIELDS.ENTITY_ID], _obj[FIELDS.REACTION]);
        })
      }
      return resolve(map);
    })
  })
}
}

module.exports = {
  instance: new Reactions(),
  FIELDS
};