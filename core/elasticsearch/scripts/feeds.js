const {FIELDS: FEEDS_FIELDS, FIELDS_VALUES: FEEDS_FIELDS_VALUES} = require("../templates/index/feeds/v1");
const moment = require('moment');
const C = require("../../../constants");

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

/**
* updating the privacy
* @param {*} privacy
*/
script.updatePrivacy = (privacy) => {
  return {
    source: `ctx._source.${FEEDS_FIELDS.PRIVACY} = params.${FEEDS_FIELDS.PRIVACY};`,
    params: {
      [FEEDS_FIELDS.PRIVACY]: privacy
    },
    lang: "painless"
  }
}

/**
* reporting apost
*/
script.reportPost = (userId) => {
  return {
    source: `if(ctx._source.${FEEDS_FIELDS.REPORTED_BY} == null){
      List tmp = new ArrayList();
      tmp.add(params.token);
      ctx._source.${FEEDS_FIELDS.REPORTED_BY} = tmp;
    }else if(!ctx._source.${FEEDS_FIELDS.REPORTED_BY}.contains(params.token)){
      ctx._source.${FEEDS_FIELDS.REPORTED_BY}.add(params.token)
    }
    if(ctx._source.${FEEDS_FIELDS.REPORTED_BY}.length >= ${C.POST.MAX_REPORTS_ALLOWED} && ctx._source.${FEEDS_FIELDS.STATUS}===${FEEDS_FIELDS_VALUES[FEEDS_FIELDS.STATUS].LIVE}){
      ctx._source.${FEEDS_FIELDS.STATUS}=${FEEDS_FIELDS_VALUES[FEEDS_FIELDS.STATUS].REPORTED}
    }`,
    params: {
      token: userId
    },
    lang: "painless"
  }
}

/**
* making a post live and resetting the reported_by array
*/
script.makePostLive = () => {
  return {
    source: `ctx._source.${FEEDS_FIELDS.STATUS} = params.${FEEDS_FIELDS.STATUS};
    ctx._source.${FEEDS_FIELDS.REPORTED_BY} = new ArrayList();`,
    params: {
      [FEEDS_FIELDS.STATUS]: FEEDS_FIELDS_VALUES[FEEDS_FIELDS.STATUS].LIVE
    },
    lang: "painless"
  }
}

module.exports = script;