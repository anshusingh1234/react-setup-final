const events = {};

events.search = (keyword, friends, followings) => {
  let shouldArray = [];

  shouldArray.push({
    "wildcard": {
      "title": {
        "value": `*${keyword}*`,
        "boost": 1.0,
        "rewrite": "constant_score"
      }
    }
  })

  //TODO:
  //privacy
  //event time

  return {
    "bool": {
      "shouldArray": shouldArray
    }
  }
}

module.exports = events;