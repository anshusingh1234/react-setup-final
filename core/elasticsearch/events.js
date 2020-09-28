const AbstractElasticsearch = require('./abstract');
const {FIELDS: EVENTS_FIELDS, FIELDS_VALUES: EVENTS_FIELDS_VALUES} = require('./templates/index/events/v1');
const {events: EVENTS_QUERY} = require("./queries");

const indexName = 'events'

class Events extends AbstractElasticsearch{
  /**
  *
  * @param {*} id
  * @param {*} type
  * @param {*} circle
  * @param {*} title
  * @param {*} description
  * @param {*} privacy
  * @param {*} privateTo
  * @param {*} eventAt
  * @param {*} callback
  */
  indexDoc(id, type, circle, title, description, privacy, privateTo, createdAt, eventAt, callback){
    if(!id || !type || !circle || !title || !description || !privateTo || !createdAt || !eventAt) return callback("Invalid params events indexDoc()", null);

    super.indexDoc(id, {
      [EVENTS_FIELDS.TYPE]: type,
      [EVENTS_FIELDS.CIRCLE]: circle,
      [EVENTS_FIELDS.TITLE]: title,
      [EVENTS_FIELDS.DESCRIPTION]: description,
      [EVENTS_FIELDS.PRIVACY]: privacy,
      [EVENTS_FIELDS.PRIVATE_TO]: privateTo || [],
      [EVENTS_FIELDS.CREATED_AT]: createdAt,
      [EVENTS_FIELDS.EVENT_AT]: eventAt
    }, callback);
  }

  search(keyword, friends = [], followings = []){
    return new Promise((resolve, reject) => {
      if (!query) {
        throw new Error('Invalid argument(s)');
      }
      const _body = {
        "query": EVENTS_QUERY.search(keyword)
      }

      super.search(_body, (error, result) => {
        if(error){
          return reject(error);
        }
        if(result && result.hits && result.hits.total.value){
          return resolve(result.hits.hits);
        }
        return resolve([]);
      });
    })
  }

}

module.exports = new Events('events');