const errorCodes = require('./errorCodes');
const jConfig = require("../../config/jigrrConfig").getConfig();

const IS_PROD_ENV = jConfig.ENV === 'prod';

//TODO: extend Error class
class ApiError {
  /**
   *Creates an instance of ApiError.
   * @param {*} httpStatusCode HTTP status code to send in API response
   * @param {*} errorCode application error code
   * @param {*} options (optional)
   * @memberof ApiError
   */
  constructor(httpStatusCode, errorCode, options) {
    this.httpStatusCode = httpStatusCode;
    this.errorCode = errorCode;
    this.options = options;
  }

  /**
   * Builds a json object as per the error schema defined for APIs
   */
  toJSON() {
    return {
      error: {
        ...errorCodes.errors[this.errorCode],
        type: 'error',
        code: this.errorCode,
        errorData: _getErrorData(this.options),
        debug: _getDebugInfo(this.options)
      }
    };
  }
}

function _getErrorData(options) {
  if(options && options.errorData && !(options.errorData instanceof Error)) {
    return options.errorData;
  }
  return;
}

function _getDebugInfo(options) {
  if(IS_PROD_ENV) return;
  if(options && options.debug) {
    return options.debug;
  }
  return;
}

module.exports = ApiError;
