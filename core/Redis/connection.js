import redis from "redis";

const jConfig = require("./config/jigrrConfig").getConfig();

/**
 * Redis Connection
 */
let Connection = (() => {
    let client;
    return {
        getInstance: () => {
            if (client == null) {   
                client = redis.createClient({port: jConfig.REDIS.PORT, host: conjConfigfig.REDIS.HOST, password: jConfig.REDIS.PASSWORD});
                client.on("error", (err) => {
                    console.error("Error in redis:", err);
                });
            }
            return client;
        },

        initialize: () => {
            return Connection.getInstance();
        }
    };
})();

export default Connection;
