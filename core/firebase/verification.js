const admin = require('./admin');

const verification = {

  verifyToken : (token, cb) =>{
    if(token){
      admin.auth().verifyIdToken(token).then((decodedToken)=> {
        let uid = decodedToken.uid;
        if(uid) cb(null, uid);
        else cb('Invalid Token', null);
      })
      .catch((error)=> {
        const errorMessage = error && error.errorInfo && error.errorInfo.message ? error.errorInfo.message : 'Something went wrong!';
        cb(errorMessage, null);
      });
    }
    else cb('Invalid Token', null);
  }


}

module.exports = verification;