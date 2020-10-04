const fetch = require('node-fetch');
const API_ENDPOINT = 'https://graph.facebook.com/v8.0';

const Facebook = {
  isVerified: (token, accountID) =>{
    return new Promise((resolve, reject) => {
      const apiURL = `${API_ENDPOINT}/${accountID}?access_token=${token}&fields=is_verified`;
      CURL_GET(apiURL, (resp)=>{
        const isUserverified = resp && resp.is_verified ? resp.is_verified : false;
        return resolve(isUserverified);
      })
    })
  }
};


const CURL_GET = (url, cb) =>{
  fetch(url).then(res => res.json()).then(json => {
    if(json && json.error){
      json.error.api = url;
      json.error.message = json.error.error_user_title ? json.error.error_user_title : json.error.message;
    }
    cb(json);
  });
}

module.exports = Facebook;