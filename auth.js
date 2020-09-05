const md5 = require('md5');
const unauthorizedText = 'Unauthorized Access';

/**
 * Static credentials to be replaced with process.env variables
 */
const credentials = {
  userName: 'jigrr',
  password: 'jigrr',
  realm: 'jigrr'
};

/**
 * Function to be used to return 401 + Authentication header in options call
 * @param {*} res 
 */
var authenticateUser = (res)=> {
  res.writeHead(401, { "Access-Control-Expose-Headers":"*", "Access-Control-Allow-Origin":"*", 'WWW-Authenticate': 'Digest realm="' + credentials.realm + '",qop="auth",nonce="' + Math.random() + '",opaque="' + md5(credentials.realm) + '"' });
  res.end(unauthorizedText);
}

/**
 * This function will parse complete request in order to get digest credentials
 * @param {*} authData 
 */
var parseAuthenticationInfo = (authData) => {
  var authenticationObj = {};
  authData.split(', ').forEach(function (d) {
    d = d.replace(/\=/,'|').split('|')
    authenticationObj[d[0]] = d[1].replace(/"/g, '');
  });
  return authenticationObj;
}
 
/**
 * Main function to process request and return response on the basis of conditions i.e., 401 if unauthorized, 200 if authorized
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
var auth = (req, res, next)=> {
  var authInfo, digestAuthObject = {};
  if (!req.headers.authorization) {
    authenticateUser(res);
  }
  else{
    authInfo = req.headers.authorization.replace(/^Digest /, '');
    authInfo = parseAuthenticationInfo(authInfo);

    if (authInfo.username !== credentials.userName) {
      res.end(unauthorizedText);
    }
    digestAuthObject.ha1 = md5(authInfo.username + ':' + credentials.realm + ':' + credentials.password);
    digestAuthObject.ha2 = md5(req.method + ':' + authInfo.uri);
    digestAuthObject.response = md5([digestAuthObject.ha1, authInfo.nonce, authInfo.nc, authInfo.cnonce, authInfo.qop, digestAuthObject.ha2].join(':'));

    if (authInfo.response !== digestAuthObject.response) {
      res.end(unauthorizedText);
    }
    else{
      next();
    }
  }
}

module.exports = auth;