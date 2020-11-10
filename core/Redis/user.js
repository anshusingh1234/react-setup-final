const query = require("./query");
const key = require("./keys");
const async = require("async");
const { FIELDS } = require("../elasticsearch/templates/index/feeds/v1");
const admin = require("../firebase/admin");
const jConfig = require("../../config/jigrrConfig").getConfig();

const HASH_FIELDS = {
  USER_ID: "id",
  PROFILE_PRIVACY: "profilePrivacy",
  NAME: "name",
  FIRSTNAME: "firstName",
  LASTNAME: "lastName",
  SURNAME: "surName",
  PICTURE: "picture",
  USER_TYPE: "userType",
  STATUS: "status",
  VERIFIED: "verified",
  MIRRORFLY_ID: "mirrorflyId",
  DOB: "dob",
  GENDER: "gender",
  LANGUAGE: "language",
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
        [HASH_FIELDS.SURNAME]: userData.surName || "",
        [HASH_FIELDS.PICTURE]: userData.profilePic ? userData.profilePic : '',
        [HASH_FIELDS.USER_TYPE]: userData.userType,
        [HASH_FIELDS.STATUS]: userData.status,
        [HASH_FIELDS.MIRRORFLY_ID]: userData.mirrorFlyId || "",
        [HASH_FIELDS.DOB]: userData.dob || "",
        [HASH_FIELDS.GENDER]: userData.gender || "",
        [HASH_FIELDS.LANGUAGE]: userData.applanguage || "",
      }
      !userProfile[HASH_FIELDS.FIRSTNAME] && delete userProfile[HASH_FIELDS.FIRSTNAME];
      !userProfile[HASH_FIELDS.LASTNAME] && delete userProfile[HASH_FIELDS.LASTNAME];
      !userProfile[HASH_FIELDS.NAME] && delete userProfile[HASH_FIELDS.NAME];
      !userProfile[HASH_FIELDS.SURNAME] && delete userProfile[HASH_FIELDS.SURNAME];
      
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

  getUserAllDetails: (userId) => {
    return new Promise((resolve, reject) => {
      query.hgetall(key.USER_SHORT_DETAIL(userId),(err, result)=>{
        return resolve(result);
      })
    })
  },
  
  getUserProfile: (userId) => {
    return new Promise((resolve, reject) => {
      query.hgetall(key.USER_SHORT_DETAIL(userId), (error, result) => {
        let shortDetail;
        if(result){
          let lastName;
          if(result[HASH_FIELDS.LASTNAME] && result[HASH_FIELDS.SURNAME]){
            lastName = result[HASH_FIELDS.LASTNAME] + " " + result[HASH_FIELDS.SURNAME];
          }else{
            lastName = result[HASH_FIELDS.LASTNAME] || result[HASH_FIELDS.SURNAME];
          }
         
          shortDetail = {
            [HASH_FIELDS.USER_ID]: result[HASH_FIELDS.USER_ID],
            [HASH_FIELDS.NAME]: result[HASH_FIELDS.NAME],
            [HASH_FIELDS.FIRSTNAME]: result[HASH_FIELDS.FIRSTNAME],
            [HASH_FIELDS.LASTNAME]: lastName,
            [HASH_FIELDS.PICTURE]: result[HASH_FIELDS.PICTURE],
            [HASH_FIELDS.VERIFIED]:  formatVerifiedStatus(userId, result[HASH_FIELDS.VERIFIED]),
            [HASH_FIELDS.MIRRORFLY_ID]: result[HASH_FIELDS.MIRRORFLY_ID] || ""
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

  linkMirrorflyId: (userId, mirrorFlyId) => {
    return new Promise((resolve, reject) => {
      
      const hash = {
        key : key.USER_SHORT_DETAIL(userId),
        field : HASH_FIELDS.MIRRORFLY_ID,
        value : mirrorFlyId
      }
      query.hset(hash, (err, result)=>{
        if(err) return reject(err);
        else return resolve(result);
      });
    })
  },
  
};

const formatVerifiedStatus = (userId, verified)=>{
  let _return = 0;

  const adminUserIds = jConfig.ADMIN_USER_IDS;
  if(adminUserIds.indexOf(userId) > -1) _return = 1;
  else _return = verified ? Number(verified) : 0

  return _return;
}

module.exports = user;