const moment = require("moment");
const async = require("async");
const {feeds} = require("../../../core/elasticsearch");
const {user} = require("./../../../core/Redis");
const {users: userMongo} = require("../../../core/mongo");
const {contacts: contactsMongo} = require("../../../core/mongo");
const { commonResponse: response } = require('../../../helper/commonResponseHandler')
const ApiError = require("../ApiError");
const { countBy } = require("lodash");


const DEFAULT = {
  LIMIT: 10,
  PAGE: 1
}

const friends = {

  /**
   * API to fetch friends suggestions starts here
   */
  suggestions: async (req, res, next) => {
    const userId = req.headers._id;
    const keyword = req.query.keyword || '';

    let userData, ignoreUserIDs = [], contacts = [], contactsUserIDs = [], suggestions = [];

    async.series({
      userDetail: cb => {
        userMongo.instance.fullDetail(userId).then(res=>{
          userData = res;
          const friend = res.friends.map(friend=>friend && friend.friendId ? friend.friendId.toString() : '');
          const friendRequest = res.friendRequestList.map(friend=>friend && friend.friendId ? friend.friendId.toString() : '');
          const requestSent = res.friendRequestSentList.map(friend=>friend && friend.friendId ? friend.friendId.toString() : '');
          ignoreUserIDs = [...new Set([...friend, ...friendRequest, ...requestSent])];
          cb();
        })
      },
      allContacts: cb => {
        const params = { userId, keyword };
        contactsMongo.instance.getContacts(params).then(res=>{
          contacts = res;
          cb();
        })
      },
      getContactsUserIDs: cb =>{
        if(contacts && contacts.length){
          const allMobiles = contacts.map(contact=>contact[contactsMongo.NESTED_FIELDS[contactsMongo.FIELDS.CONTACTS].NATIONAL_NUMBER].toString())
          userMongo.instance.getMobileUserIDs(allMobiles).then(res=>{
            contactsUserIDs = res && res.length ? res.filter(userId=>ignoreUserIDs.indexOf(userId) == -1) : [];
            cb();
          })
        }
        else cb();
      },
      getRecommendedUserData: cb =>{
        if(contactsUserIDs && contactsUserIDs.length){
          user.getAllUsersProfile(contactsUserIDs).then(res=>{
            const allUsers = contactsUserIDs.map(userId=>res.get(userId)).filter(el => el);
            suggestions = allUsers;
            cb();
          })
        }
        else cb();
      }
    },
    (error, result) => {
      const response = {
        total: suggestions.length,
        response: suggestions
      }
      res.status(200).send(response);
      next();
    })
  }


};


module.exports = friends;