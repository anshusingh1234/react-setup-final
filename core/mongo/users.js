const {MongoDB} = require("./db");
const collectionName = "users";

const FIELDS = {
  ID: '_id',
  PROFILE_PIC: 'profilePic',
  STATUS: 'status',
  NAME: 'name',
  MOBILE: 'mobileNumber',
  FRIENDS: 'friends'
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

  async list(params) {
    return new Promise((resolve, reject) => {
      const where = {
        [FIELDS.STATUS]:'ACTIVE'
      }
      this.collection.find(where).sort({ _id: -1 }).toArray((err, data) => {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

  async shortDetail(userId) {
    return new Promise((resolve, reject) => {
      const where = {
        [FIELDS.ID] : userId,
        [FIELDS.STATUS]:'ACTIVE'
      }

      const selectField = {
        projection:
        {
          [FIELDS.PROFILE_PIC]:1,
          [FIELDS.NAME]:1,
          [FIELDS.ID]:1
        }
      }

      this.collection.findOne(where, selectField).toArray((err, data) => {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

  async fullDetail(userId) {
    return new Promise((resolve, reject) => {
      const where = {
        [FIELDS.ID] : this.getObjectIdFromString(userId),
        [FIELDS.STATUS]:'ACTIVE'
      }
      this.collection.findOne(where, (err, data) => {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

  saveReferredBy(userId, referredBy){
    return new Promise((resolve, reject) => {
      this.collection.findOneAndUpdate({_id: userId}, {
        $set: {
          referrals: {
            referredBy
          }
        }
      }, (error, result) => {
        if(error) return reject(error);
        resolve(result);
      })
    })
  }

  async getMobileUserIDs(mobileNumbers) {
    return new Promise((resolve, reject) => {
      const where = {
        [FIELDS.STATUS]:'ACTIVE',
        [FIELDS.MOBILE]: {$in: mobileNumbers}
      }
      const selectField = {
        projection:
        {
          [FIELDS.ID]:1
        }
      }
      this.collection.find(where, selectField).sort({ _id: -1 }).toArray((err, data) => {
        if(err) return reject(err);
        const userIDs = data && data.length ? data.map(user=>{return user[FIELDS.ID].toString()}) : []
        resolve(userIDs);
      });
    });
  }


  getFriends(userId){
    return new Promise((resolve, reject) => {
      this.collection.findOne({
        _id: userId
      }, (err, data) => {
        if(err) return reject(err);
        console.log(JSON.stringify(data, null, 2))
        let friends = data && Array.isArray(data.friends) && data.friends.map(_obj => {
          if(_obj.status === 'ACTIVE'){
            return _obj.friendId;
          }
        }).filter(el => el);
        Array.isArray(data) ? resolve(friends) : resolve([])
      })
    })
  }
}

module.exports = {
  instance: new Users(),
  FIELDS
};