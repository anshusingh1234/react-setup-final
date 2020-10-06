const {MongoDB} = require("./db");
const collectionName = "users";

const FIELDS = {
  ID: '_id',
  PROFILE_PIC: 'profilePic',
  STATUS: 'status',
  NAME: 'name',
  MOBILE: 'mobileNumber',
  FRIENDS: 'friends',
  VERIFIED: 'verified'
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
      this.collection.findOneAndUpdate({_id: super.getObjectIdFromString(userId)}, {
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
        const userIDs = data && data.length ? data.map(user=>user[FIELDS.ID].toString()) : []
        resolve(userIDs);
      });
    });
  }

  async countUsers() {
    return new Promise((resolve, reject) => {
      const where = {
        [FIELDS.STATUS]:'ACTIVE'
      };

      this.collection.countDocuments(where,(err, data) => {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

  async getReferredCount(userId) {
    return new Promise((resolve, reject) => {
      const where = {
        referrals: {
          referredBy:userId
        }
      };
      this.collection.countDocuments(where,(err, data) => {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

  saveVerified(userId){
    return new Promise((resolve, reject) => {
      const objectId = super.getObjectIdFromString(userId);
      this.collection.findOneAndUpdate({_id: objectId}, {
        $set: {
          [FIELDS.VERIFIED]: 1
        }
      }, (err, data) => {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

  getFriendsAndFollowings(userId){
    return new Promise((resolve, reject) => {
      this.collection.findOne({
        _id: super.getObjectIdFromString(userId)
      }, (err, data) => {
        if(err) return reject(err);
        let friends = [];
        let followings = [];
        let followers = [];
        friends = (data && Array.isArray(data.friends)) ? data.friends.map(_obj => {
          if(_obj.status === 'ACTIVE'){
            return _obj.friendId.toString();
          }
        }).filter(el => el): [];
        followings = (data && Array.isArray(data.following)) ? data.following.map(_obj => {
          if(_obj.status === 'ACTIVE'){
            return _obj.followingId.toString();
          }
        }).filter(el => el) : [];
        followers = (data && Array.isArray(data.follower)) ? data.follower.map(_obj => {
          if(_obj.status === 'ACTIVE'){
            return _obj.followerId.toString();
          }
        }).filter(el => el) : [];
        resolve({
          friends: [...new Set(friends)],
          followings: [...new Set(followings)],
          followers: [...new Set(followers)],
          profilePrivacy: data.profilePrivacy
        })
      })
    })
  }

  incrementBadgeCount(userId){
    return new Promise((resolve, reject) => {
      this.collection.findOneAndUpdate({_id: super.getObjectIdFromString(userId)}, {
        $inc: {
          badgeCount: 1
        }
      }, (error, result) => {
        if(error) return reject(error);
        resolve(result);
      })
    })
  }
}

module.exports = {
  instance: new Users(),
  FIELDS
};