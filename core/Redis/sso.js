
const query = require("./query");
const keys = require("./keys");
const moment = require('moment');

const sso = {};

const MAX_AGE = 30*24*60*60;

const fields = {
  USER_ID: 'USER_ID',
  CREATED_AT: 'CREATED_AT',
  TOKEN: 'TOKEN'
}

sso.fields = fields;

sso.save = (userId, token) => {
  return new Promise((resolve, reject) => {
    const key = keys.SSO_TOKEN(token);
    query.hmset(key, {
      [fields.TOKEN]: token,
      [fields.USER_ID]: userId,
      [fields.CREATED_AT]: moment().valueOf() 
    }, () => {
      query.expire(key, moment().unix() + MAX_AGE);
      resolve();
    })
  })
}

sso.updateExpiry = (token) => {
  const key = keys.SSO_TOKEN(token);
  query.expire(key, moment().unix() + MAX_AGE);
  return;
}

sso.get = (token) => {
  return new Promise((resolve, reject) => {
    const key = keys.SSO_TOKEN(token);
    query.hget({
      key, field: fields.USER_ID
    }, (error, result) => {
      resolve(result);
    })
  })
}

module.exports = sso;