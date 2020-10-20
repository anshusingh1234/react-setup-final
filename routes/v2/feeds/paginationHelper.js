const stringHelper = require("../../../helper/stringHelper");

const DEFAULT_PAGE_SIZE = 100;

const paginationHelper = {};

paginationHelper.getPaginationInfo = (current) => {
  let from;
  let size;
  if(!current){
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
  return {cursor, from, size};
}



module.exports = paginationHelper;