const helper = {

  isUserOnOldVersion : (userVersion, checkPointVersion)=>{
    if(!userVersion) return true;

    let userVersionArr = userVersion.toString().split(".").map(Number)
    let checkPointVersionArr = checkPointVersion.toString().split(".").map(Number)
    if(checkPointVersionArr.length > userVersionArr.length){
      for(let i = 0; i< checkPointVersionArr.length - userVersionArr.length; i++){
        userVersionArr.push(0)
        if(checkPointVersionArr.length === userVersionArr.length) break;
      }
    }else if(checkPointVersionArr.length < userVersionArr.length){
      for(let i = 0; i< userVersionArr.length - checkPointVersionArr.length; i++){
        checkPointVersionArr.push(0)
        if(checkPointVersionArr.length === userVersionArr.length) break;
      }
    }


    let old = "";

    for(let i =0; i<checkPointVersionArr.length; i++){
      if(checkPointVersionArr[i] > userVersionArr[i]){
        old = "user"
        break;
      }
      if(checkPointVersionArr[i] < userVersionArr[i]){
        old = "check"
        break;
      }
    }

    if(old.length === 0) return false;

    if(old === "user"){
      return true
    }else{
      return  false;
    }
  }

  
}

module.exports = helper;