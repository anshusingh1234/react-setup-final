const {user} = require("../../../core/Redis");
const {reactions: mongoReactions, comments: mongoComments} = require("../../../core/mongo");
const async = require('async');

const info = {};

info.fetch = async(postIds, userId) => {
  return new Promise((resolve, reject) => {
    let reactionMap = new Map();
    let commentMap = new Map();
    async.parallel({
      REACTIONS: cb => mongoReactions.instance.reactionsWithTotal(postIds, 'post').then(_obj => {
        reactionMap = _obj;
        cb();
      }),
      COMMENTS: cb => mongoComments.instance.commentsWithTotal(postIds).then(_obj => {
        commentMap = _obj;
        cb();
      })
    }, async() => {
      const reactionIdsMap = new Map();
      const postUsersMap = new Map();
      let userIds = [];
      userIds.push(userId);
      [...reactionMap.keys()].forEach(_postId => {
        const _det = reactionMap.get(_postId);
        reactionIdsMap.set(_postId, _det.map(_obj => _obj[mongoReactions.FIELDS.REACTION_TYPE]));
        userIds = userIds.concat(_det.map(_obj => _obj[mongoReactions.FIELDS.REACTION_USERID]));
        postUsersMap.set(_postId, userIds);
      });
      [...commentMap.keys()].forEach(_postId => {
        const _userId = commentMap.get(_postId);
        userIds.push(_userId);
        let current = postUsersMap.get(_postId) || [];
        current = current.concat(userIds);
        postUsersMap.set(_postId, current);
      })
      userIds = ([...new Set(userIds)]);
      const userMap = await user.getAllUsersProfile(userIds);

      let finalInfoMap = new Map();

      postIds.forEach(_postId => {
        let userIds = (postUsersMap.get(_postId) || []);
        userIds = [... new Set(userIds)];
        const _text = _getText(userIds, userMap, userId);
        if(_text){
          finalInfoMap.set(_postId, {
            "reactions": (reactionIdsMap.get(_postId) || []).map(_obj => Number(_obj)).slice(0, 2),
            "message": _text
          })
        }
      })

      resolve(finalInfoMap)
    })
  })
}

info.getPostActivitiesCountString = (count) => {
  if(!count) return 0 + '';
  if(count < 10000) return count+'';
  if(count === 10000) return 10+'k';
  if(count > 10000 && count < 1000000) return (count/1000).toFixed(1) + 'k';
  if(count === 1000000) return 1+'m';
  if(count > 1000000 && count < 1000000000) return (count/1000000).toFixed(1) + 'm';
  if(count === 1000000000) return 1+'b';
  if(count > 1000000000) return (count/1000000000).toFixed(1) + 'b';
}

module.exports = info;

const _getText = (userIds, userMap, userId) => {
  switch(userIds.length){
    case 0: return ``;
    case 1: {
      const user = userMap.get(userIds[0]);
      if(user && (user.firstName || user.name)){
        return `${userIds[0] === userId ? 'You are' : (user.firstName || user.name) + " is"} participating`;
      }else{
        return '';
      }
    }
    case 2: {
      const user1 = userMap.get(userIds[0]);
      const user2 = userMap.get(userIds[1]);
      if(user1 && (user1.firstName || user1.name) && user2 && (user2.firstName || user2.name)){
        return `${userIds[0] === userId ? 'You' : user1.firstName || user1.name} and ${userIds[1] === userId ? 'You' : user2.firstName || user2.name} are participating`;
      }else{
        return '';
      }
    }
    default: {
      const user1 = userMap.get(userIds[0]);
      const user2 = userMap.get(userIds[1]);
      if(user1 && (user1.firstName || user1.name) && user2 && (user2.firstName || user2.name)){
        return `${userIds[0] === userId ? 'You' : user1.firstName || user1.name}, ${userIds[1] === userId ? 'You' : user2.firstName || user2.name} and ${userIds.length - 2} more are participating`;
      }else{
        return '';
      }
    }
  }
}