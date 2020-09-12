const {FIELDS: FEEDS_FIELDS} = require("../templates/index/feeds/v1");
const moment = require('moment');

const script = {};

/**
* incrementing reaction count by some value
* @param {*} incrementBy incrementing value
*/
script.incrementReactionCount = (incrementBy) => {
  return {
    inline: `if(ctx._source.${FEEDS_FIELDS.REACTIONS_COUNT} == null){
      ctx._source.${FEEDS_FIELDS.REACTIONS_COUNT} = ${incrementBy};
      ctx._source.${FEEDS_FIELDS.UPDATED_AT} = ${moment().unix()};
    }else{
      ctx._source.${FEEDS_FIELDS.REACTIONS_COUNT} += ${incrementBy};
      ctx._source.${FEEDS_FIELDS.UPDATED_AT} = ${moment().unix()};
    }`
  }
}

/**
* decrementing reaction count by some value
* @param {*} decrementBy decrementing value
*/
script.decrementReactionCount = (decrementBy) => {
  return {
    inline: `if(ctx._source.${FEEDS_FIELDS.REACTIONS_COUNT} >= ${decrementBy}){
      ctx._source.${FEEDS_FIELDS.REACTIONS_COUNT} -= ${decrementBy};
    }else{
      ctx._source.${FEEDS_FIELDS.REACTIONS_COUNT} = 0;
    }`
  }
}

/**
* incrementing comment count by some value
* @param {*} incrementBy incrementing value
*/
script.incrementCommentCount = (incrementBy) => {
  return {
    inline: `if(ctx._source.${FEEDS_FIELDS.COMMENTS_COUNT} == null){
      ctx._source.${FEEDS_FIELDS.COMMENTS_COUNT} = ${incrementBy};
      ctx._source.${FEEDS_FIELDS.UPDATED_AT} = ${moment().unix()};
    }else{
      ctx._source.${FEEDS_FIELDS.COMMENTS_COUNT} += ${incrementBy};
      ctx._source.${FEEDS_FIELDS.UPDATED_AT} = ${moment().unix()};
    }`
  }
}

/**
* decrementing comment count by some value
* @param {*} decrementBy decrementing value
*/
script.decrementCommentCount = (decrementBy) => {
  return {
    inline: `if(ctx._source.${FEEDS_FIELDS.COMMENTS_COUNT} >= ${decrementBy}){
      ctx._source.${FEEDS_FIELDS.COMMENTS_COUNT} -= ${decrementBy};
    }else{
      ctx._source.${FEEDS_FIELDS.COMMENTS_COUNT} = 0;
    }`
  }
}

module.exports = script;