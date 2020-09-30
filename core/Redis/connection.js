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
                client = redis.createClient({port: jConfig.REDIS.PORT, host: jConfig.REDIS.HOST, password: jConfig.REDIS.PASSWORD});
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
