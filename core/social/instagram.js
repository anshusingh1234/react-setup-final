const Instagram = {
  isVerified: (token, accountID) =>{
    return new Promise((resolve, reject) => {
      return resolve(true);
    })
  }
};

module.exports = Instagram;