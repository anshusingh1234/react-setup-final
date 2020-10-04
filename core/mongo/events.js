const {MongoDB} = require("./db");
const collectionName = "events";

const FIELDS = {
  ID: '_id',
  USER_ID: 'userId',
  STATUS: 'status',
  TITLE: 'title',
  PARTICIPANT: 'participant',
  PARTICIPANT_ID: 'participantId',
  EXPIRY_DATE: 'expiryDate'
}


class Events extends MongoDB {
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


  async countEvents(userId) {
    return new Promise((resolve, reject) => {
      const where = {
        [FIELDS.USER_ID]:this.getObjectIdFromString(userId)
      };

      this.collection.countDocuments(where,(err, data) => {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

  async countEventsAttended(userId) {
    return new Promise((resolve, reject) => {
      const where = {
        [FIELDS.PARTICIPANT]:{
          $elemMatch:{
            [FIELDS.PARTICIPANT_ID] : userId
          }
        },
        [FIELDS.EXPIRY_DATE]:{
          "$lte":`${new Date()}`
        }
      }

      this.collection.countDocuments(where,(err, data) => {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

}

module.exports = {
  instance: new Events(),
  FIELDS
};