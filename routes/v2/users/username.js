const moment = require("moment");
const async = require("async");
const {user} = require("./../../../core/Redis");
const {users: userMongo} = require("../../../core/mongo");
const ApiError = require("../ApiError");

const username = {

  validate: (req, res, next) => {
    const {username} = req.query;
    if(!username) return next(new ApiError(400, 'E0060004'))
    next();
  },

  suggest: async (req, res, next) => {
    const {username} = req.query;
    const formattedUsername = username.replace(/\s/g,'');

    const usernameCount = await userMongo.instance.checkUsername(formattedUsername);  

    const response = {
      username:formattedUsername,
      isAvailable: usernameCount > 0 ? false: true,
      suggestions: usernameCount > 0 ? await getUniqueName(formattedUsername) : []
    }

    res.status(200).send(response);
    next();
  }

};

const getUniqueName = async(name) =>{
  const username1 = await generateUniqueAccountName(name);
  const username2 = await generateUniqueAccountName(name);
  const username3 = await generateUniqueAccountName(name);
  return [username1, username2, username3];
}

const generateUniqueAccountName = async(proposedName)=> {
  proposedName += Math.floor((Math.random() * 100) + 1);
  const usernameCount = await userMongo.instance.checkUsername(proposedName);
  if(usernameCount>0){
    return generateUniqueAccountName(proposedName);
  }
  else return proposedName;
}



module.exports = username;