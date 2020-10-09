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

const EXPIRY_SECONDS = 120;

const event = {

  HASH_FIELDS,

  saveMatch: (data) => {
    return new Promise((resolve, reject) => {
      const {eventType, age, gender, userId} = data;
      const keyString = key.EVENT_MATCH(eventType, age, gender);

      query.set(`${keyString}:${userId}`, userId, (err, result)=>{
        query.expire(keyString, EXPIRY_SECONDS);
        if(err) return reject(err);
        else return resolve(result);
      });
    })
  },

  checkMatchComplete: (numberOfUsers, data) => {
    return new Promise((resolve, reject) => {
      const {eventType, age, gender, userId} = data;

      const keyString = key.EVENT_MATCH(eventType, age, gender)

      query.keys(`${keyString}:*`,(err, result)=>{
        if(result && result.length >= numberOfUsers){
          const selectedKeys = selectedUsers = result.slice(0, numberOfUsers);
          query.mget(selectedKeys, (err, userIDs)=>{
            query.del(selectedKeys, (err, deleted)=>{
              return resolve(userIDs);
            })            
          })
        }
        else{
          return resolve([]);
        }
      })
    })
  }

};

module.exports = event;