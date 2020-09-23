const bunyan = require("bunyan");

const config = require('./config/jigrrConfig').getConfig()

const ERR_SERIALIZER = (err) => {
  return {
    ...err,
    ...bunyan.stdSerializers.err(err)
  };
};

const REQ_SERIALIZER = (req) => {
  return {
    ...bunyan.stdSerializers.req(req),
    hostname: req.hostname,
    body: req.body,
    cookies: req.cookies,
    originalUrl: req.originalUrl,
    query: req.query
  }
};

const RES_SERIALIZER = (res) => {
  return {
    ...bunyan.stdSerializers.res(res),
    headers: res._headers
  };
};

const logger = bunyan.createLogger({
    name: "longwalks",
    src: true,
    serializers: {
      err: ERR_SERIALIZER,
      req: REQ_SERIALIZER,
      res: RES_SERIALIZER
    },
    streams: [{
        path: config.LOG.PATH,
        level: config.LOG.LEVEL
    }]
});

logger.logSentry = function(err) {
    //TODO sentry
};

module.exports = logger;
