const {MongoDB} = require("./db");
const collectionName = "users";

const FIELDS = {
  ID: '_id',
  PROFILE_PIC: 'profilePic',
  STATUS: 'status',
  NAME: 'name',
}


class Users extends MongoDB {
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

  async shortDetail(userId) {
    return new Promise((resolve, reject) => {
      const where = {
        [FIELDS.ID] : userId, 
        [FIELDS.STATUS]:'ACTIVE'
      }

      const selectFields = {
        [FIELDS.PROFILE_PIC]:1,
        [FIELDS.NAME]:1,
        [FIELDS.ID]:1
      }

      this.collection.findOne(where, selectFields).toArray((err, data) => {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

}

module.exports = {
  instance: new Users(),
  FIELDS
};