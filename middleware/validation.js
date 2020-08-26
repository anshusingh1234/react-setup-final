const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');


/**
 * loginValidation validation
 **/
exports.loginValidation = function (req, res, next) {
    if(!req.body.email  ||  !req.body.password){
        response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
    }else{
        next()
    }
}



