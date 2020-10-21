const redis = require("redis");
const jConfig = require("../../config/jigrrConfig").getConfig();

/**
* Redis RedisConnection
*/
let RedisConnection = (() => {
    let client;
    return {
        getInstance: () => {
            if (client == null) {
              let createClientObj = {port: jConfig.REDIS.PORT, host: jConfig.REDIS.HOST};
              if(jConfig.REDIS.PASSWORD) createClientObj = {...createClientObj, password:jConfig.REDIS.PASSWORD};
                client = redis.createClient([createClientObj]);
                client.on("error", (err) => {
                    console.error("Error in redis:", err);
                });
            }
            return client;
        },

        initialize: () => {
            return RedisConnection.getInstance();
        }
    };
})();

module.exports = RedisConnection;
