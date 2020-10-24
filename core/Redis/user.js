const query = require("./query");
const key = require("./keys");
const async = require("async");
const { FIELDS } = require("../elasticsearch/templates/index/feeds/v1");

const HASH_FIELDS = {
  USER_ID: "id",
  PROFILE_PRIVACY: "profilePrivacy",
  NAME: "name",
  FIRSTNAME: "firstName",
  LASTNAME: "lastName",
  PICTURE: "picture",
  USER_TYPE: "userType",
  STATUS: "status",
  VERIFIED: "verified"
}

const user = {

  HASH_FIELDS,

  saveUserProfile: (userId, userData) => {
    return new Promise((resolve, reject) => {
      let firstName, lastName;
      if(userData.name && userData.name.includes(" ")){
        [firstName, lastName] = userData.name.split(' ')
      };
      const userProfile = {
        [HASH_FIELDS.USER_ID]: userId.toString(),
        [HASH_FIELDS.PROFILE_PRIVACY]: userData.profilePrivacy,
        [HASH_FIELDS.NAME]: userData.name,
        [HASH_FIELDS.FIRSTNAME]: userData.firstName || firstName || userData.name,
        [HASH_FIELDS.LASTNAME]: userData.lastName || lastName || "",
        [HASH_FIELDS.PICTURE]: userData.profilePic ? userData.profilePic : '',
        [HASH_FIELDS.USER_TYPE]: userData.userType,
        [HASH_FIELDS.STATUS]: userData.status,
      }
      !userProfile[HASH_FIELDS.FIRSTNAME] && delete userProfile[HASH_FIELDS.FIRSTNAME];
      !userProfile[HASH_FIELDS.LASTNAME] && delete userProfile[HASH_FIELDS.LASTNAME];
      !userProfile[HASH_FIELDS.NAME] && delete userProfile[HASH_FIELDS.NAME];

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
      query.hgetall(key.USER_SHORT_DETAIL(userId),(error, result)=>{
        let shortDetail;
        if(result){
          shortDetail = {
            [HASH_FIELDS.USER_ID]: result[HASH_FIELDS.USER_ID],
            [HASH_FIELDS.NAME]: result[HASH_FIELDS.NAME],
            [HASH_FIELDS.FIRSTNAME]: result[HASH_FIELDS.FIRSTNAME],
            [HASH_FIELDS.LASTNAME]: result[HASH_FIELDS.LASTNAME],
            [HASH_FIELDS.PICTURE]: result[HASH_FIELDS.PICTURE],
            [HASH_FIELDS.VERIFIED]: result[HASH_FIELDS.VERIFIED] ? Number(result[HASH_FIELDS.VERIFIED]) : 0
          }
        }
        return resolve(shortDetail);
      })
    })
  },

  getAllUsersProfile: (userIds) =>{
    return new Promise ((resolve, reject) => {
      let map = new Map();
      let scripts = userIds.map(el => cb => {
        user.getUserProfile(el).then(shortDetail => {
          shortDetail && map.set(el, shortDetail);
          cb()
        })
      })
      async.parallelLimit(scripts, 10, () => {
        resolve(map)
      })
    })
  },

  saveVerified: (userId) => {
    return new Promise((resolve, reject) => {

      const hash = {
        key : key.USER_SHORT_DETAIL(userId),
        field : HASH_FIELDS.VERIFIED,
        value : 1
      }
      query.hset(hash, (err, result)=>{
        if(err) return reject(err);
        else return resolve(result);
      });
    })
  },

};

module.exports = user;