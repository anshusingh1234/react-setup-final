const settings = {
  "config": {
    "ENV": process.env["NODE_ENV"],
    "PORT": process.env["PORT"],
    "ES_CONFIG": {
      "CONNECTION_STRING": process.env["ELASTIC_SEARCH:CONNECTION_STRING"],
      "LOG_LEVEL": process.env["ELASTIC_SEARCH:LOG_LEVEL"] || "info",
      "SERVER_API_VERSION": process.env["ELASTIC_SEARCH:SERVER_API_VERSION"] || "_default"
    },
    "LOG": {
      "PATH": process.env["LOG_PATH"],
      "LEVEL": process.env["LOG_LEVEL"] || "info"
    },
    "REDIS":{
      "PORT":process.env["REDIS:PORT"],
      "HOST":process.env["REDIS:HOST"],
      "PASSWORD":process.env["REDIS:PASSWORD"]
    },
    "MONGO":{
      "HOST":process.env["MONGO:HOST"],
      "DB_NAME":process.env["MONGO:DB_NAME"],
      "USER":process.env["MONGO:USER"],
      "PASS":process.env["MONGO:PASS"],
      "PORT":process.env["MONGO:PORT"],
      "REPLICA_SET":process.env["MONGO:REPLICA_SET"]
    },
    "CLOUDINARY": {
      "CLOUD_NAME": process.env["CLOUDINARY:CLOUD_NAME"],
      "API_KEY": process.env["CLOUDINARY:API_KEY"],
      "API_SECRET": process.env["CLOUDINARY:API_SECRET"]
    }
  }
};

module.exports = settings;
