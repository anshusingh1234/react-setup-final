const settings = {
  "config": {
    "ENV": process.env["NODE_ENV"],
    "PORT": process.env["PORT"],
    "ES_CONFIG": {
      "CONNECTION_STRING": process.env["ELASTIC_SEARCH:CONNECTION_STRING"],
      "LOG_LEVEL": process.env["ELASTIC_SEARCH:LOG_LEVEL"] || "info",
      "SERVER_API_VERSION": process.env["ELASTIC_SEARCH:SERVER_API_VERSION"] || "_default"
    }
  }
};

module.exports = settings;
