const stringHelper = require("../../../helper/stringHelper");

const DEFAULT_PAGE_SIZE = 10;

const paginationHelper = {};

paginationHelper.getPaginationInfo = (current) => {
  let from;
  let size;
  console.log("-----current, from, size------", current, from, size)
  if(!current){
  console.log("-----current, from, size------", current, from, size)
    from = 0;
    size = DEFAULT_PAGE_SIZE;
  }else{
    const cursor = stringHelper.fromBase64(current);
    [from, size] = cursor.includes(":") ? cursor.split(':'): ['',''];
    if(!from || !size){
      from = 0;
      size = DEFAULT_PAGE_SIZE;
    }else{
      from = Number(from);
      from += DEFAULT_PAGE_SIZE;
      size = DEFAULT_PAGE_SIZE;
    }
  }
  const cursor = stringHelper.toBase64(`${from}:${size}`);
  console.log("------cursor-----", cursor)

  return {cursor, from, size};
}



module.exports = paginationHelper;