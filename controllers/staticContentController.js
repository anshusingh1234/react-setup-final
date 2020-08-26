
const staticPage = require('../models/staticContentModel')
const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { SuccessMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');
const { SuccessCode } = require('../helper/statusCode');
const commonFunction = require('../helper/commonFunction')
const eventCategoryModel = require('../models/eventCategoryModel')
const eventModel = require('../models/eventModel')
const marketingModel = require('../models/marketingModel')
const bcrypt = require("bcrypt-nodejs");
var jwt = require('jsonwebtoken');
module.exports={
 /**
    * Function Name :viewStaticContent
    * Description   : view static content in static management
    *
    * @return response
  */

 viewStaticContent: (req, res) => {
    try {
        if (req.body.Type && !req.body.staticId) {
            staticPage.find({ Type: req.body.Type }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                }
            })

        }
        else if (!req.body.Type && req.body.staticId) {
            staticPage.findOne({ _id: req.body.staticId }, (err, result) => {
                console.log("errrrrrr",err,result)
                if (err) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                }
            })
        }
        else if (req.body.Type && req.body.staticId) {
            staticPage.findOne({ _id: req.body.staticId, Type: req.body.Type }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessag.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                }
            })
        }
        else {
            response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
        }
    }
    catch (error) {
        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    }
},


 /**
        * Function Name :view Faq
        * Description   :  faq list of FAQ in  static management
        *
        * @return response
       */

      viewFaq: (req, res) => {
        try {
            faqModel.findOne({ _id: req.body.faqId, status: "ACTIVE" }, (error, faqData) => {
                console.log("kjhjjhhhhhhh",error,faqData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!faqData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, faqData, SuccessMessage.DATA_FOUND);
                }
            })

        }
        catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },


        /**
     * Function Name :editStaticPage
     * Description   : editStaticPage in static page management
     *
     * @return response
    */

   editStaticPage: (req, res) => {
    try {
        if (!req.body.staticId || !req.body.title || !req.body.description) {
            response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
        }
        else {
            staticPage.findOne({ _id: req.body.staticId, status: "ACTIVE" }, (findErr, findResult) => {
                if (findErr) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!findResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    staticPage.findByIdAndUpdate({ _id: findResult._id }, {$set:{title: req.body.title, description: req.body.description}}, { new: true }, (err, success) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, success, SuccessMessage.UPDATE_SUCCESS);
                        }
                    })
                }
            })
        }
    }
    catch (error) {
        console.log("139=====>",error)
        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    }
},
    /**
    * Function Name :faq List
    * Description   :  faq list of FAQ in  static management
    *
    * @return response
   */

    faqList: (req, res) => {
        try {
            // req.body.limit = parseInt(req.body.limit);
            var options = {
                page: req.body.page || 1,
                limit: req.body.limit || 1000,
                
            };
            var query = { status: { $ne: "DELETE" } };

            if (req.body.search) {
                query.title = { $regex: req.body.search, $options: 'i' };

            }
            if (req.body.Type) {
                query.Type = req.body.Type;
            }
            if (req.body.status) {
                query.status = req.body.status;
            }
            faqModel.paginate(query, options, (error, paginationData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (paginationData.docs.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, paginationData, SuccessMessage.DATA_FOUND);
                }
            })

        }
        catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    }, 
           /**
   * Function Name :staticContentList
   * Description   : staticContentList in content management
   *
   * @return response
 */

staticContentList: (req, res) => {
    try {
        var query = { status: { $ne: "DELETE" } };
        staticPage.find(query, (err, result) => {
            console.log(" i am here",err,result)
            if (err) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
            }
            else if (result.length == 0) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
            }
            else {
                response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
            }
        })
    }
    catch (error) {
        console.log("i am in error",error)
        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    }
},
 /**
    * Function Name :viewStaticContent
    * Description   : viewStaticContent in content management
    *
    * @return response
  */

 viewStatic: (req, res) => {
    try {
        console.log("enter")
        staticPage.findOne({ Type: req.body.Type, status:"ACTIVE"}, (error, pageData) => {
            console.log("i am in",error,pageData)
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
            }
            else if (!pageData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
            }
            else {
                response(res, SuccessCode.SUCCESS, pageData, SuccessMessage.DETAIL_GET);
            }
        })
    }
    catch (error) {
        console.log("i am in catch",error)
        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    }
},



}