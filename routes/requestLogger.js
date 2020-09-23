const logger = require('../logger');
const shortUuid = require('short-uuid');

module.exports = (options) => {
  return (req, res, next) => {
    req.requestId = req.headers['x-amzn-trace-id'] || req.headers['x-lgwk-request-id'] || shortUuid.generate();
    res.set('x-lgwk-request-id', req.requestId);

    req.logger = logger.child({
      requestId: req.requestId
    });

    const oldWrite = res.write;
    const oldEnd = res.end;

    const chunks = [];

    res.write = function (chunk) {
      chunks.push(chunk);

      oldWrite.apply(res, arguments);
    };

    res.end = function (chunk) {
      if (chunk){
        chunks.push(chunk);
      }

      oldEnd.apply(res, arguments);
    };

    const time = process.hrtime();
    res.on('finish', () => {
      const structuredLog = {...getStructuredLog(req, res)};

      // Log response body also in case of error status code.
      if(res.statusCode >= 400) {
        if(!structuredLog.response) structuredLog.response = {};
        structuredLog.response.body = chunks.join('\n');
      }
      const diff = process.hrtime(time);
      req.logger.info({
        responseTime: diff[0] * 1e3 + diff[1] * 1e-6,
        ...structuredLog
      });
    });
    next();
  };
};

const obsfucateStringPartially = (str, noOfVisibleChars=10) => {
  if(!str) return '';
  return `${str.substr(0, noOfVisibleChars)}*******`;
}

const obfuscateReqHeaders = (headersOriginal) => {
  let headers = {...headersOriginal};
  if(headers && headers.token) {
    headers.token = obsfucateStringPartially(headers.token, 15);
  }
  return headers;
}


const getStructuredLog = (req, res) => {
  const reqHeaders = obfuscateReqHeaders(req.headers);
  // const resHeaders = obfuscateResHeaders(res.getHeaders());

  const logData = {
    status: res.statusCode,
    platform: req.headers['platform'],
    appVersion: req.headers['version'],
    url: req.originalUrl,
    method: req.method,
    path: req.path,
    remoteAddress: req.remoteAddress,
    request: {
      query: req.query,
      body: req.body,
      headers: JSON.stringify(reqHeaders),
      hostname: req.hostname
    },
    response: {
      body: res.body,
      headers: JSON.stringify(res.getHeaders())
    }
  }

  return logData;
}
