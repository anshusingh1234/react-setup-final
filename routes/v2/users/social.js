const moment = require("moment");
const async = require("async");
const {user} = require("./../../../core/Redis");
const {users: userMongo} = require("../../../core/mongo");
const ApiError = require("../ApiError");
const Facebook = require("./../../../core/social/facebook");
const Instagram = require("./../../../core/social/instagram");

const VALID_SOCIAL = ['Facebook', 'Instagram']

const social = {

  validate: (req, res, next) => {
    const {type, token, accountId} = req.body;
    if(!type) return next(new ApiError(400, 'E0060001'))
    if(!token) return next(new ApiError(400, 'E0060002'));
    if(!accountId) return next(new ApiError(400, 'E0060003'));
    if(VALID_SOCIAL.indexOf(type) == -1) return next(new ApiError(400, 'E0060001'))
    next();
  },


  link: async (req, res, next) => {
    const userId = req.headers._id;
    const {type, token, accountId} = req.body;

    let accountVerified = 0, userProfile;

    async.series({

      checkVerified: cb => {
        if(type == 'Facebook'){
          Facebook.isVerified(token, accountId).then(isVerified=>{
            accountVerified = isVerified
            cb()
          })
        }
        else{
          Instagram.isVerified(token, accountId).then(isVerified=>{
            accountVerified = isVerified
            cb()
          })
        }
      },

      saveVerifiedDataInMongo: cb => {
        if(accountVerified){
          userMongo.instance.saveVerified(userId).then(res=>{
            cb();
          })
        }
        else cb();        
      },

      saveVerifiedDataInredis: cb => {
        if(accountVerified){
          user.saveVerified(userId).then(res=>{
            cb();
          })
        }
        else cb();        
      },

      getUserProfile: cb => {
        user.getUserProfile(userId).then(profile=>{
          userProfile = profile;
          cb();
        })   
      },

    },
    (error, result) => {
      res.status(200).send(userProfile);
      next();
    })
  },

};


module.exports = social;