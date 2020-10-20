const { Base64 } = require('js-base64');

const stringHelper = {};

stringHelper.getSubString = (old, limit) => {
  old = old.toString().trim();
  let arr = old.toString().split(" ");

  let count = 0;
  let newString = "";

  for (let word of arr) {
    if (count <= limit && (count + word.length + 1) <= limit) {
      newString += count === 0 ? word : " " + word;
      count = newString.length;
    } else {
      break;
    }
  }
  return (newString.length < old.length ? `${newString}...` : newString);
}

stringHelper.toBase64 = (string) => {
  return Base64.encode(string);
}

stringHelper.fromBase64 = (string) => {
  return Base64.decode(string);
}

module.exports = stringHelper;