const friendRequest = {};

friendRequest.send = async (from, to) => {
  let userIdsToFetch = [];
  let userMap = new Map();
  if(typeof from === 'string'){
    userIdsToFetch.push(from);
  }else{
    userMap.set(from.id, from);
  }
  if(typeof to === 'string'){
    userIdsToFetch.push(to);
  }else{
    userMap.set(to.id, to);
  }
  if(userIdsToFetch.length){
    const _um = await _fetchUserDetail(userIdsToFetch);
    userMap = new Map([...userMap, ..._um]);
  }
}

module.exports = friendRequest;

const _fetchUserDetail = (userIds) => {
  return new Promise((resolve, reject) => {
    
  })
}