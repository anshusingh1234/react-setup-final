const {ESClient} = require("./connection");
let request = require("request");
const config = require("../../config/jigrrConfig").getConfig();

// NOTE: do NOT add this to index.js. Admin module is supposed to be used internally for admin operations.
let _admin = {};

/**
* Creates an index with given name.
* NOTE: mappings and settings are automatically applied from matching template (if any)
* @param indexName
*/
// _admin.createIndex = (indexName, cb) => ESClient.indices.create({index: indexName}, cb);
_admin.createIndex = (indexName, cb) => _createNewIndex(indexName, cb);

module.exports = _admin;

const _createNewIndex = (indexName, callback) => {
  var headers = {
    'Content-Type': 'application/json'
  };

  var options = {
    url: `http://${config.ES_CONFIG.CONNECTION_STRING.toString().split(",")[0]}/${indexName}?pretty`,
    method: 'PUT',
    headers: headers,
    json: require("./templates/index/feeds/v1").MAPPING
  };
  function cb(error, response, body) {
    if (error) {
      console.log(`Error in creating new index: ${error}`);
    }
    if (body) {
      console.log(`Successfully created new index | ${JSON.stringify(options, null, 2)}\n${JSON.stringify(body, null, 2)}`);
    }
    return callback(null, {error: error, response: response, body: body});
  }
  request(options, cb);
}
