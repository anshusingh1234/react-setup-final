const ApiError = require('./ApiError');

// const RESPONSE_INTERNAL_SERVER_ERROR = new ApiError(500, 'E0010002').toJSON();

module.exports = (err, req, res, next) => {
  if(err instanceof ApiError) {
    return res.status(err.httpStatusCode).json(err);
  }

  // req.logger.error({err}, '[Error] API error');

  res.status(500).json(new ApiError(500, 'E0010002', {debug: err}));
};
