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
      const userProfile = {
        [HASH_FIELDS.USER_ID]: userId.toString(),
        [HASH_FIELDS.PROFILE_PRIVACY]: userData.profilePrivacy,
        [HASH_FIELDS.NAME]: userData.name,
        [HASH_FIELDS.PICTURE]: userData.profilePic ? userData.profilePic : '',
        [HASH_FIELDS.USER_TYPE]: userData.userType,
        [HASH_FIELDS.STATUS]: userData.status,
      }
      
      query.hmset(key.USER_SHORT_DETAIL(userId), userProfile, (err, result)=>{
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
          let shortDetail = {
            [HASH_FIELDS.USER_ID]: result[HASH_FIELDS.USER_ID],
            [HASH_FIELDS.NAME]: result[HASH_FIELDS.NAME],
            [HASH_FIELDS.PICTURE]: result[HASH_FIELDS.PICTURE]
          }
          return resolve(shortDetail);
       })
    })
  },

  getAllUsersProfile: (userIds) =>{
    return new Promise ((resolve, reject) => {
      let map = new Map();
      let scripts = userIds.map(el => cb => {
        query.hgetall(key.USER_SHORT_DETAIL(el),(error, result)=>{
          let shortDetail = {
            [HASH_FIELDS.USER_ID]: result[HASH_FIELDS.USER_ID],
            [HASH_FIELDS.NAME]: result[HASH_FIELDS.NAME],
            [HASH_FIELDS.PICTURE]: result[HASH_FIELDS.PICTURE]
          }
          map.set(el, shortDetail);
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