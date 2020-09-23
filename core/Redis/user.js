const query = require("./query");
const key = require("./keys");
const async = require("async");

const HASH_FIELDS = {
    USER_ID: "id",
    PROFILE_PRIVACY: "profilePrivacy",
    NAME: "name",
    PICTURE: "picture",
    USER_TYPE: "userType",
    STATUS: "status"
}

const user = {

  HASH_FIELDS,

  saveUserProfile: (userId, userData) => {
    return new Promise((resolve, reject) => {
      query.hmset(key.USER_SHORT_DETAIL(userId), {
        [HASH_FIELDS.USER_ID]: userData.id,
        [HASH_FIELDS.PROFILE_PRIVACY]: userData.profilePrivacy,
        [HASH_FIELDS.NAME]: userData.name,
        [HASH_FIELDS.PICTURE]: userData.profilePic,
        [HASH_FIELDS.USER_TYPE]: userData.userType,
        [HASH_FIELDS.STATUS]: userData.status,
      }, (err, result)=>{
        if(err) return reject(err);
        else return resolve(result);
      });
    })
  },

  isUserActive: (userId) => {
    return new Promise((resolve, reject) => {
        query.hget({key:key.USER_SHORT_DETAIL(userId), field:HASH_FIELDS.STATUS},(err, result)=>{
          return resolve(result == 'ACTIVE' ? true : false);
       })
    })
  },

  getUserProfile: (userId) => {
    return new Promise((resolve, reject) => {
        query.hgetall(key.USER_SHORT_DETAIL(userId),(result)=>{
          return resolve(result);
       })
    })
  },

  getAllUsersProfile: (userIds) =>{
    return new Promise ((resolve, reject) => {
      let map = new Map();
      let scripts = userIds.map(el => cb => {
        query.hgetall(key.USER_SHORT_DETAIL(el),(error, result)=>{
          map.set(el, result);
          cb()
        })
      })
      async.parallel(scripts, () => {
        resolve(map)
      })
    })
  }
};

module.exports = user;