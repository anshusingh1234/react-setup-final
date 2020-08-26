const userModel = require('../models/userModel');
const foodModel = require('../models/foodModel')
const dishModel = require('../models/dishModel')
const ageMasterModel = require('../models/ageMasterModel')
const customerModel = require('../models/customerModel')
const rewardModel = require('../models/rewardModel');
const postModel = require('../models/postModel')
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
const feedbackModel = require('../models/feedBackModel')
const countryModel = require('../models/countryModel')
const chefModel = require('../models/chefModel')
const genderModel = require('../models/genderModel')
const languageModel = require('../models/languageModel')
const interestModel = require('../models/interestModel')
const favouriteModel = require('../models/favouriteModel')
const siteModel = require('../models/siteModel');
const { imageUploadCloudinary } = require('../helper/commonFunction');
const reportModel = require('../models/reportModel');
const faqModel = require('../models/faqModel')
const offlineEvent = require('../models/offlineEvent')
const onlineEvent = require('../models/onlineEvent')
const offlineCountry = require('../models/offlineCountry')
const onlineCountry = require('../models/onlineCountry')
const roleModel = require('../models/roleModel')




module.exports = {
    //**_____________________________________ Admin Management ______________________________ */
    /**
     * Function Name :login
     * Description   : login for admin
     *
     * @return response
   */
    login: (req, res) => {
        try {
            userModel.findOne({ email: req.body.email, userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    const check = bcrypt.compareSync(req.body.password, adminData.password)
                    if (check) {
                        var token = jwt.sign({ id: adminData._id, iat: Math.floor(Date.now() / 1000) - 30 }, 'socialMedia', { expiresIn: '24h' });
                        var result = {
                            userId: adminData._id,
                            token: token,
                            name: adminData.name,
                            email: adminData.email,
                            mobileNumber: adminData.mobileNumber,
                            country: adminData.country,
                            profilePic: adminData.profilePic,
                            permissions: adminData.permissions
                        };
                        response(res, SuccessCode.SUCCESS, result, SuccessMessage.LOGIN_SUCCESS)
                    }
                    else {
                        response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.INVALID_CREDENTIAL)
                    }

                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },


    /**
    * Function Name : getProfile
    * Description   : Admin getProfile
    *
    * @return response
    */
    viewProfile: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers.adminid, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONGg);
                } else if (!adminData) {
                    console.log("hhhhhhhh", adminData)
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                } else {
                    response(res, SuccessCode.SUCCESS, adminData, SuccessMessage.DETAIL_GET);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },



    /**
    * Function Name : editProfile
    * Description   : Admin getProfile
    *
    * @return response
    */

    editProfile: async (req, res) => {
        try {
            if (!req.headers.adminid) {
                response(res, ErrorCode.UNAUTHORIZED, [], ErrorMessage.PARAMETER_MISSING);
            } else {
                let admin = await userModel.findOne({ _id: req.headers.adminid, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } });
                if (admin) {
                    let editAdmin = await userModel.findOneAndUpdate({ _id: req.headers.adminid, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, req.body, { new: true });
                    if (editAdmin) {
                        response(res, SuccessCode.SUCCESS, admin, SuccessMessage.PROFILE_DETAILS);
                    }
                }
            }
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :forgotPassword
    * Description   :forgot password
    *
    * @return response
    */


    forgotPassword: (req, res) => {
        try {
            userModel.findOne({ email: req.body.email, userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, userDetails) => {
                console.log(".............153", error, userDetails)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                }
                else if (!userDetails) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.EMAIL_NOT_REGISTERED);
                } else {
                    var link = `${global.gConfig.url}/${userDetails._id}/`;
                    commonFunction.sendMail(req.body.email, 'reset Password', userDetails.name, link, (err, sendMail) => {
                        console.log("the mail message....", err, sendMail)
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                        } else {
                            response(res, SuccessCode.SUCCESS, [userDetails._id], SuccessMessage.LINK_SEND);
                        }
                    })
                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :resetPassword
    * Description   :Updated password
    *
    * @return response
    */
    resetPassword: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers.adminid, userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, userDetails) => {
                console.log("The admin data........", error, userDetails)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                } else if (userDetails) {
                    req.body.password = bcrypt.hashSync(req.body.password)
                    userModel.findOneAndUpdate({ _id: userDetails._id }, { $set: { password: req.body.password } }, { multi: true }, (err, passwordUpdate) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                        } else {
                            response(res, SuccessCode.SUCCESS, [], SuccessMessage.PASSWORD_UPDATE);
                        }
                    })
                } else {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_FOUND);
                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }

    },

    /**
    * Function Name :changePassword
    * Description   :change password
    *
    * @return response
    */

    changePassword: (req, res) => {
        try {
            if (
                !req.headers.adminid ||
                !req.body.newPassword ||
                !req.body.confirmPassword ||
                !req.body.oldPassword
            ) {
                response(res, ErrorCode.UNAUTHORIZED, [], ErrorMessage.PARAMETER_MISSING);
            } else {
                userModel.findOne(
                    { _id: req.headers.adminid, status: "ACTIVE" },
                    (err, result1) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else if (!result1) {
                            response(res, ErrorCode.NOT_FOUND, ErrorMessage.ADMIN_NOT_FOUND);
                        } else {
                            var check = bcrypt.compareSync(req.body.oldPassword, result1.password)
                            if (check) {
                                if (req.body.newPassword == req.body.confirmPassword) {
                                    var hashPassword = bcrypt.hashSync(req.body.confirmPassword);
                                    userModel.findOneAndUpdate(
                                        { _id: req.headers.adminid, status: "ACTIVE" },
                                        { $set: { password: hashPassword } },
                                        { new: true },
                                        (error, result2) => {
                                            if (error) {
                                                response(res, ErrorCode.SOMETHING_WRONG, ErrorMessage.INTERNAL_ERROR);
                                            } else if (!result2) {
                                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.ADMIN_NOT_FOUND);

                                            } else {
                                                console.log("success in resetPassword", result2);
                                                var result = { _id: result2._id };
                                                response(res, SuccessCode.SUCCESS, result, SuccessMessage.CHANGE_PASSWORD);
                                            }
                                        }
                                    );
                                } else {
                                    response(res, ErrorCode.NOT_FOUND, [userDetails._id], ErrorMessage.PASSWORD_NOT_MATCHED);
                                }
                            } else {
                                console.log("old password not matched")
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.PASSWORD_NOT_MATCHED);
                            }
                        }
                    }
                );
            }
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name : editProfile
    * Description   : Admin getProfile
    *
    * @return response
    */
    addSubAdmin: (req, res) => {

        if (!req.body.name || !req.body.mobileNumber || !req.body.email || !req.body.roleId || !req.body.password) {
            response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.INVALID_CREDENTIAL);

        } else {
            try {
                var obj = {
                    name: req.body.name,
                    countryCode: req.body.countryCode || "+91",
                    mobileNumber: req.body.mobileNumber,
                    email: req.body.email,
                    roleId: req.body.roleId,
                    password: bcrypt.hashSync(req.body.password),
                    userType: "SUBADMIN"
                };
                roleModel.findOne({ _id: req.body.roleId, status: "ACTIVE" }, (err, role) => {
                    if (err) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!role) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                    }
                    else {
                        let query = { $and: [{ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }] }, { status: { $in: ["ACTIVE", "BLOCK"] } }] }
                        userModel.findOne(query, (error, result) => {
                            if (error) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (result) {
                                if (result.email == obj.email) {
                                    response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.EMAIL_EXIST);
                                }
                                else {
                                    response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.MOBILE_EXIST);
                                }
                            }
                            else {
                                let mailBody = `Your account has been created as a subadmin. Your email is ${req.body.email} and password is ${req.body.password}`
                                commonFunction.subAdminEmail(req.body.email, mailBody, "BUILD_SOCIAL_MEDIA", (er, info) => {
                                    if (er) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        new userModel(obj).save((saveErr, subadmin) => {
                                            if (saveErr) {
                                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else {
                                                response(res, SuccessCode.SUCCESS, subadmin, SuccessMessage.SUB_ADMIN_CREATED);
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
            catch (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
            }

        }

    },

    /**
     * Function Name :editSubAdmin
     * Description   : editSubAdmin in sub-admin management
     *
     * @return response
    */

    editSubAdmin: (req, res) => {
        try {
            let query = { $and: [{ _id: req.body.subadminId }, { status: "ACTIVE" }] }
            userModel.findOne(query, (err, subadmin) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!subadmin) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    let query1 = { $and: [{ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }] }, { status: { $in: ["ACTIVE", "BLOCK"] } }, { _id: { $ne: subadmin._id } }] }
                    userModel.findOne(query1, (error, result) => {
                        if (error) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }

                        else if (result) {
                            if (result.email == req.body.email) {
                                response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.EMAIL_EXIST);
                            }
                            else {
                                response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.MOBILE_EXIST);
                            }
                        }
                        else {

                            let emailBody = 'Your profile is updated successfully.'
                            if (req.body.email) {
                                emailBody = emailBody + `Your updated email is ${req.body.email}.`
                                req.body["email"] = req.body.email
                            }
                            else {
                                emailBody = emailBody + `Your  email is ${subadmin.email}.`
                                req.body['email'] = subadmin.email
                            }
                            if (req.body.password) {
                                emailBody = emailBody + `Your new password is ${req.body.password}.`
                                req.body["password"] = bcrypt.hashSync(req.body.password)
                            }

                            commonFunction.subAdminEmail(req.body.email, emailBody, "BUILD_SOCIAL_MEDIA", (emailErr, info) => {
                                if (emailErr) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    userModel.findByIdAndUpdate({ _id: subadmin._id }, { $set: req.body }, { new: true }, (upErr, success) => {
                                        if (upErr) {
                                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                        }
                                        else {
                                            response(res, SuccessCode.SUCCESS, success, SuccessMessage.EDIT_SUCC);
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }

    },

    /**
 * Function Name :viewSubAdmin
 * Description   : viewSubAdmin
 *
 * @return response
*/

    viewSubAdmin: (req, res) => {
        try {

            userModel.findOne({ _id: req.headers.adminid, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (adminErr, adminData) => {
                if (adminErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    userModel.findById({ _id: req.params._id, status: { $ne: "DELETE" } }, (err, result) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!result) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                        }
                    })
                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },


    /**
    * Function Name : listSubAdmin
    * Description   : list of all admin and sub-admin
    *
    * @return response
    */
    listSubAdmin: async (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (adminErr, adminData) => {
            if (adminErr) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                let query = { status: { $ne: "DELETE" }, userType: "SUBADMIN" };
                let optionss = {
                    page: req.body.pageNumber || 1,
                    populate: { path: 'roleId', match: { status: "ACTIVE" } },
                    limit: req.body.limit || 10,
                    sort: {
                        createdAt: -1
                    }
                }
                userModel.paginate(query, optionss, (couuntryError, countryData) => {
                    if (couuntryError) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (countryData.docs.length == 0) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, countryData, SuccessMessage.DATA_FOUND);
                    }
                })
            }
        })
    },


    /**
     * Function Name :editSubAdmin
     * Description   : editSubAdmin in Sub-admin management
     *
     * @return response
    */



    deleteSubAdmin: (req, res) => {
        try {
            userModel.findOneAndUpdate({ _id: req.body.subAdminId, status: { $ne: "DELETE" } }, { $set: { status: "DELETE" } }, { new: true }, (error, success) => {
                console.log("i am in ", error, success)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                }
                else if (!success) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, success, SuccessMessage.UPDATE_SUCCESS);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },


    addCountry: (req, res) => {
        userModel.findOne({ _id: req.headers.adminid, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (adminErr, adminData) => {
            if (adminErr) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                var query = {
                    $and: [
                        {
                            countryName: req.body.countryName
                        },
                        { status: { $in: ["ACTIVE", "BLOCK"] } }
                    ]
                };
                countryModel.findOne(query, (couuntryError, countryData) => {
                    console.log("81=========>", couuntryError, countryData)
                    if (couuntryError) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (countryData) {
                        if (countryData.countryName == req.body.countryName) {
                            response(res, ErrorCode.COUNTRY_EXIST, [], ErrorMessage.COUNTRY_EXIST)
                        }
                    }
                    else {
                        var obj = {
                            countryName: req.body.countryName
                        }
                        new countryModel(obj).save((saveError, saveResult) => {
                            if (saveError) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, [], SuccessMessage.DATA_SAVED)
                            }
                        })
                    }
                })
            }
        })
    },
    editCountry: async (req, res) => {
        try {
            userModel.findOne({ _id: req.headers.adminid, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, async (adminErr, adminData) => {
                if (adminErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    var query = {
                        $and: [
                            {
                                countryName: req.body.countryName
                            },
                            { status: { $in: ["ACTIVE", "BLOCK"] } }
                        ]
                    };
                    countryModel.findOne(query, async (error, result) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (result) {
                            if (result.countryName == req.body.countryName) {
                                response(res, ErrorCode.COUNTRY_EXIST, [], ErrorMessage.COUNTRY_EXIST)
                            }
                        }
                        else {
                            var countryData = await countryModel.findOneAndUpdate({ _id: req.body.countryId, status: "ACTIVE" }, { $set: { countryName: req.body.countryName } }, { new: true })
                            if (countryData) {
                                response(res, SuccessCode.SUCCESS, [countryData], SuccessMessage.UPDATE_SUCCESS)
                            }
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    deleteCountry: async (req, res) => {
        try {
            userModel.findOne({ _id: req.headers.adminid, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, async (adminErr, adminData) => {
                if (adminErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    var countryData = await countryModel.findOneAndUpdate({ _id: req.body.countryId, status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true })
                    if (countryData) {
                        response(res, SuccessCode.SUCCESS, countryData, SuccessMessage.DELETE_SUCCESS)
                    }
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    listOfCountry: (req, res) => {
        userModel.findOne({ _id: req.headers.adminid, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (adminErr, adminData) => {
            if (adminErr) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                let query = { status: { $eq: "ACTIVE" } };
                if (req.body.countryName) {
                    query.countryName = new RegExp('^' + req.body.countryName, "i")
                }
                let options = {
                    page: req.body.pageNumber || 1,
                    limit: req.body.limit || 10,
                    sort: {
                        createdAt: -1
                    }
                }
                countryModel.paginate(query, options, (couuntryError, countryData) => {
                    if (couuntryError) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (countryData.docs.length == 0) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, [countryData], SuccessMessage.DATA_FOUND);
                    }
                })
            }
        })
    },

    /**
 * Function Name :viewCountry
 * Description   : viewCountry
 *
 * @return response
*/

    viewCountry: (req, res) => {
        try {

            userModel.findOne({ _id: req.headers.adminid, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (adminErr, adminData) => {
                if (adminErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    countryModel.findById({ _id: req.params._id, status: { $ne: "DELETE" } }, (err, result) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!result) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                        }
                    })
                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    addCustomer: async (req, res) => {
        try {

            var query = {
                $and: [
                    {
                        $or: [
                            { email: req.body.email },
                            { mobileNumber: req.body.mobileNumber }
                        ]
                    },
                    { status: { $in: ["ACTIVE", "BLOCK"] } }
                ]
            };
            userModel.findOne(query, async (customerError, customerResult) => {
                if (customerError) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (customerResult) {
                    if (customerResult.email == req.body.email) {
                        response(res, ErrorCode.EMAIL_EXIST, [], ErrorMessage.EMAIL_EXIST)
                    }
                    else if (customerResult.mobileNumber == req.body.mobileNumber) {
                        response(res, ErrorCode.MOBILE_EXIST, [], ErrorMessage.MOBILE_EXIST)
                    }
                }
                else {
                    countryModel.findOne({ _id: req.body.countryId, status: "ACTIVE" }, async (couuntryError, countryData) => {
                        if (couuntryError) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            if (req.body.image) {
                                var pic = await upload(req.body.image)
                            }
                            var hashPassword = bcrypt.hashSync(req.body.password);
                            var obj = new userModel({
                                name: req.body.name,
                                mobileNumber: req.body.mobileNumber,
                                email: req.body.email,
                                profilePic: pic ? pic : "",
                                password: hashPassword,
                                gender: req.body.gender,
                                userType: "USER",
                                countryId: req.body.countryId,
                                countryName: countryData.countryName,
                                countryCode: req.body.countryCode
                            })
                            obj.save((error, result) => {
                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    // response(res, SuccessCode.SUCCESS, [result], SuccessMessage.DATA_SAVED)
                                    let mailBody = `Your account has been created as a Customer. Your email is ${req.body.email} and password is ${req.body.password}`
                                    commonFunction.subAdminEmail(req.body.email, mailBody, "BUILD_SOCIAL_MEDIA", (err, info) => {
                                        if (err) {
                                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                        }
                                        else {
                                            new userModel(obj).save((saveErr, userData) => {
                                                if (saveErr) {
                                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                                }
                                                else {
                                                    response(res, SuccessCode.SUCCESS, [userData], SuccessMessage.DATA_SAVED)
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    editCustomer: (req, res) => {
        try {
            let query = { $and: [{ _id: req.body.customerId }, { status: "ACTIVE" }] }
            userModel.findOne(query, async (err, subadmin) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!subadmin) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    let query1 = { $and: [{ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }] }, { status: { $in: ["ACTIVE", "BLOCK"] } }, { _id: { $ne: subadmin._id } }] }
                    userModel.findOne(query1, async (findErr, result) => {
                        if (findErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (result) {
                            if (result.email == req.body.email) {
                                response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.EMAIL_EXIST);
                            }
                            else {
                                response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.MOBILE_EXIST);
                            }
                        }
                        else {

                            let emailBody = 'Your profile is updated successfully.'
                            if (req.body.email) {
                                emailBody = emailBody + `Your updated email is ${req.body.email}.`
                                req.body["email"] = req.body.email
                            }
                            else {
                                emailBody = emailBody + `Your  email is ${subadmin.email}.`
                                req.body['email'] = subadmin.email
                            }
                            if (req.body.password) {
                                emailBody = emailBody + `Your new password is ${req.body.password}.`
                                req.body["password"] = bcrypt.hashSync(req.body.password)
                            }
                            if (req.body.image) {
                                req.body["profilePic"] = await imgUpload(req.body.image)
                            }
                            commonFunction.subAdminEmail(req.body.email, emailBody, "BUILD_SOCIAL_MEDIA", (suberr, info) => {
                                if (suberr) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    userModel.findByIdAndUpdate({ _id: subadmin._id }, { $set: req.body }, { new: true }, (updateErr, success) => {
                                        if (updateErr) {
                                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                        }
                                        else {
                                            response(res, SuccessCode.SUCCESS, success, SuccessMessage.UPDATE_SUCCESS);
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }

    },


    verifyCustomer: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers.adminid, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, async (adminErr, adminData) => {
                if (adminErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    var data = await userModel.findOne({ _id: req.body.customerId, status: "ACTIVE" })
                    if (data) {
                        userModel.findOneAndUpdate({ _id: req.body.customerId, status: "ACTIVE" }, { $set: { verifyStatus: "true" } }, { new: true }, (customerError, customerData) => {
                            if (customerError) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (!customerData) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, [customerData], SuccessMessage.CUSTOMER_VERIFY);
                            }
                        })
                    }
                    else {
                        res.send({ response_code: 404, response_message: "Customer is blocked please unblock this customer" })
                    }

                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    customerList: async (req, res) => {
        try {
            var userData = await userModel.find({ userType: "USER", status: "ACTIVE" })
            response(res, SuccessCode.SUCCESS, [userData], SuccessMessage.DATA_FOUND);
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    listOfCustomer: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers.adminid, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (adminErr, adminData) => {
                if (adminErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    // }
                    // else {
                    console.log(req.body)
                    let query = { status: { $ne: "DELETE" }, userType: "USER" };
                    if (req.body.customerName) {
                        query.$and = [
                            { name: new RegExp('^' + req.body.customerName, "i") },
                            { status: { $ne: "DELETE" } }
                        ]
                    }
                    if (req.body.email) {
                        query.$and = [
                            { email: new RegExp('^' + req.body.email, "i") },
                            { status: { $ne: "DELETE" } }
                        ]
                    }
                    if (req.body.gender) {
                        query.$and = [
                            { gender: new RegExp('^' + req.body.gender, "i") },
                            { status: { $ne: "DELETE" } }
                        ]
                    }
                    let options = {
                        page: req.body.pageNumber || 1,
                        limit: req.body.limit || 10,
                        sort: {
                            createdAt: -1
                        }
                    }
                    userModel.paginate(query, options, (customerError, customerData) => {
                        if (customerError) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (customerData.docs.length == 0) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, [customerData], SuccessMessage.DATA_FOUND);
                        }
                    })
                    // }
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },


    blockCustomer: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: { $ne: "DELETE" }, userType: { $in: ["ADMIN", "SUBADMIN"] } }, (adminErr, adminData) => {
                if (adminErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    userModel.findOneAndUpdate({ _id: req.body.customerId, status: { $ne: "DELETE" } }, { $set: { status: req.body.status } }, { new: true }, (error, result) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, [result], SuccessMessage.UPDATE_SUCCESS);
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    /**
 * Function Name :viewCustomer
 * Description   : view customer
 *
 * @return response
*/

    viewCustomer: (req, res) => {
        try {
            userModel.findOne({ _id: req.params._id, status: { $ne: "DELETE" } }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    deleteCustomer: async (req, res) => {
        try {
            userModel.findOne({ _id: req.headers.adminid, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, async (adminErr, adminData) => {
                if (adminErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    var customerData = await userModel.findOneAndUpdate({ _id: req.body.customerId, status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true })
                    if (customerData) {
                        response(res, SuccessCode.SUCCESS, [customerData], SuccessMessage.DELETE_SUCCESS)
                    }
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    addChef: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers.adminid, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, async (adminErr, adminData) => {
                if (adminErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    var query = {
                        $and: [
                            {
                                $or: [
                                    { email: req.body.email },
                                    { phone: req.body.phone }
                                ]
                            },
                            { status: { $in: ["ACTIVE", "BLOCK"] } }
                        ]
                    };
                    chefModel.findOne(query, async (chefError, chefResult) => {
                        if (chefError) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (chefResult) {
                            if (chefResult.email == req.body.email) {
                                response(res, ErrorCode.EMAIL_EXIST, [], ErrorMessage.EMAIL_EXIST)
                            }
                            else if (chefResult.phone == req.body.phone) {
                                response(res, ErrorCode.MOBILE_EXIST, [], ErrorMessage.MOBILE_EXIST)
                            }
                        }
                        else {
                            countryModel.findOne({ _id: req.body.countryId, status: "ACTIVE" }, async (couuntryError, countryData) => {
                                if (couuntryError) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    if (req.body.image) {
                                        var pic = await upload(req.body.image)
                                    }
                                    var obj = new chefModel({
                                        name: req.body.name,
                                        phone: req.body.phone,
                                        email: req.body.email,
                                        profilePic: pic ? pic : "",
                                        gender: req.body.gender,
                                        countryId: req.body.countryId,
                                        countryName: countryData.countryName,
                                        state: req.body.state,
                                        city: req.body.city
                                    })
                                    obj.save((error, result) => {
                                        if (error) {
                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                        }
                                        else {
                                            response(res, SuccessCode.SUCCESS, [result], SuccessMessage.DATA_SAVED)
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    editChef: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers.adminid, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, async (adminErr, adminData) => {
                if (adminErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    var query = {
                        $and: [
                            {
                                $or: [
                                    { email: req.body.email },
                                    { phone: req.body.phone }
                                ]
                            },
                            { status: { $in: ["ACTIVE", "BLOCK"] } }
                        ]
                    };
                    chefModel.findOne(query, async (chefError, chefResult) => {
                        if (chefError) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (chefResult) {
                            if (chefResult.email == req.body.email) {
                                response(res, ErrorCode.EMAIL_EXIST, [], ErrorMessage.EMAIL_EXIST)
                            }
                            else if (chefResult.phone == req.body.phone) {
                                response(res, ErrorCode.MOBILE_EXIST, [], ErrorMessage.MOBILE_EXIST)
                            }
                        }
                        else {
                            var set = {}
                            if (req.body.name) {
                                set["name"] = req.body.name
                            }
                            if (req.body.countryName) {
                                set["countryName"] = req.body.countryName
                            }
                            if (req.body.gender) {
                                set["gender"] = req.body.gender
                            }
                            if (req.body.phone) {
                                set["phone"] = req.body.phone
                            }
                            if (req.body.email) {
                                set["email"] = req.body.email
                            }
                            if (req.body.image) {
                                set["profilePic"] = await upload(req.body.image)
                            }
                            if (req.body.state) {
                                set["state"] = req.body.state
                            }
                            if (req.body.city) {
                                set["city"] = req.body.city
                            }
                            var chefData = await chefModel.findOneAndUpdate({ _id: req.body.chefId, status: "ACTIVE" }, { $set: set }, { new: true })
                            if (chefData) {
                                response(res, SuccessCode.SUCCESS, [chefData], SuccessMessage.UPDATE_SUCCESS)
                            }
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    listOfChef: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers.adminid, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, async (adminErr, adminData) => {
                if (adminErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    if (req.body.chefId) {
                        chefModel.findOne({ _id: req.body.chefId, status: "ACTIVE" }, (userErr, userResult) => {
                            if (userErr) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (!userResult) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, [userResult], SuccessMessage.DATA_FOUND);
                            }
                        })
                    }
                    else {
                        let query = { status: { $eq: "ACTIVE" } };
                        if (req.body.name) {
                            query.$and = [
                                { name: new RegExp('^' + req.body.name, "i") },
                                { status: { $ne: "DELETE" } }]
                        }
                        if (req.body.email) {
                            query.$and = [
                                { email: new RegExp('^' + req.body.email, "i") },
                                { status: { $ne: "DELETE" } }]
                        }
                        let options = {
                            page: req.body.pageNumber || 1,
                            limit: req.body.limit || 10,
                            sort: {
                                createdAt: -1
                            }
                        }
                        chefModel.paginate(query, options, (customerError, chefData) => {
                            if (customerError) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (chefData.docs.length == 0) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, [chefData], SuccessMessage.DATA_FOUND);
                            }
                        })
                    }
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    deleteChef: async (req, res) => {
        try {
            userModel.findOne({ _id: req.headers.adminid, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, async (adminErr, adminData) => {
                if (adminErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    var chefData = await chefModel.findOneAndUpdate({ _id: req.body.chefId, status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true })
                    if (chefData) {
                        response(res, SuccessCode.SUCCESS, [chefData], SuccessMessage.DELETE_SUCCESS)
                    }
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    //=========================================Food==============================//
    addFoodCategory: async (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } },
                (error, adminData) => {
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!adminData) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                    }
                    else {
                        foodModel.findOne({ "name": req.body.name }, async (err, result) => {
                            console.log("i am here", err, result)
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (result) {
                                if (req.body.name == result.name) {
                                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.ALREADY_EXITS)
                                }
                            }
                            else {
                                if (req.body.image) {
                                    var picture = await convertImage()
                                }
                                var obj = {
                                    "name": req.body.name,
                                    "minimumPrice": req.body.minimumPrice,
                                    "maximumPrice": req.body.maximumPrice,
                                    image: picture
                                }
                                new foodModel(obj).save((saveErr, save) => {
                                    if (saveErr) {
                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                                    }
                                    else {
                                        response(res, SuccessCode.SUCCESS, save, SuccessMessage.DATA_SAVED)
                                    }
                                })
                                //*********************Function for profile pic upload *************************************/
                                function convertImage() {
                                    return new Promise((resolve, reject) => {
                                        commonFunction.uploadImage(req.body.image, (uploadErr, uploaded) => {
                                            if (uploadErr) {
                                                console.log("Error uploading image")
                                            }
                                            else {
                                                resolve(uploaded)
                                            }
                                        })
                                    })
                                }

                            }
                        })
                    }
                })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    viewFoodCategory: (req, res) => {
        try {
            foodModel.findOne({ _id: req.params._id, status: { $ne: "DELETE" } }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    editFoodCategory: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, async (error, adminData) => {
                console.log("error", adminData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    var set = {}
                    if (req.body.name) {
                        set.name = req.body.name
                    }
                    if (req.body.minimumPrice) {
                        set.minimumPrice = req.body.minimumPrice
                    }
                    if (req.body.maximumPrice) {
                        set.maximumPrice = req.body.maximumPrice
                    }
                    if (req.body.image) {
                        set.image = await imgUpload(req.body.image)
                    }
                    foodModel.findOneAndUpdate({ _id: req.body.foodCategoryId, status: "ACTIVE" }, { $set: set }, { new: true },
                        (err, updateData) => {
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (!updateData) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.UPDATE_SUCCESS)
                            }
                        })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    foodCateoryList: (req, res) => {
        try {
            if (req.body.search) {
                var query = { name: { $regex: req.body.search, $options: 'i' }, status: { $ne: "DELETE" } }
            }
            var options = {
                page: req.body.pageNumber || 1,
                limit: req.body.limit || 10,
            }
            foodModel.paginate(query, options, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (userData.docs == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } else {
                    response(res, SuccessCode.SUCCESS, userData, SuccessMessage.DATA_FOUND);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    deleteFoodCatagory: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                console.log("==================>1", error, adminData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    foodModel.findOneAndUpdate({ _id: req.body.foodCategoryId, status: "ACTIVE" }, { $set: { status: "DELETE" } },
                        { new: true }, (err, updateData) => {
                            console.log("==================>2", err, updateData)
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                            }
                            else if (!updateData) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.DELETE_SUCCESS)
                            }
                        })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    //=================================================Dish=============================================//
    addDish: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                console.log("i am in user", error, adminData)

                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    foodModel.findOne({ _id: req.body.foodCategoryId, status: "ACTIVE" }, async (err, foodData) => {

                        console.log("==============>", err, foodData)
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                        }
                        else if (!foodData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                        }
                        else {
                            if (req.body.image) {
                                var picture = await convertImage()
                            }
                            var obj = {
                                name: req.body.name,
                                foodCategory: foodData.name,
                                description: req.body.description,
                                youTubeLink: req.body.youTubeLink,
                                image: picture
                            }
                            new dishModel(obj).save((saveErr, save) => {
                                console.log("XXXXXXXXXXXXXXXXXXxxx", saveErr, save)
                                if (saveErr) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, save, SuccessMessage.DATA_SAVED)
                                }
                            })
                            //*********************Function for profile pic upload *************************************/
                            function convertImage() {
                                return new Promise((resolve, reject) => {
                                    commonFunction.uploadImage(req.body.image, (uploadErr, uploadData) => {
                                        if (uploadErr) {
                                            console.log("Error uploading image")
                                        }
                                        else {
                                            resolve(uploadData)
                                        }
                                    })
                                })
                            }
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    /**
* Function Name :viewDish
* Description   : view Dish
*
* @return response
*/

    viewDish: (req, res) => {
        try {
            dishModel.findOne({ _id: req.params._id, status: { $ne: "DELETE" } }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    editDish: async (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, async (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    var set = {}
                    if (req.body.name) {
                        set.name = req.body.name
                    }
                    if (req.body.description) {
                        set.description = req.body.description
                    }
                    if (req.body.youTubeLink) {
                        set.youTubeLink = req.body.youTubeLink
                    }
                    if (req.body.image) {
                        set.image = await imgUpload(req.body.image)
                    }
                    if (req.body.foodCatagroy) {
                        var foodSelect = await findFood(req.body.foodCatagroy)
                        set.foodCatagroy = foodSelect
                    }
                    dishModel.findOneAndUpdate({ _id: req.body.dishId, status: "ACTIVE" }, { $set: set }, { new: true },
                        (err, updateData) => {
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                            }
                            else if (!updateData) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.UPDATE_SUCCESS)
                            }
                        })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    dishesList: (req, res) => {
        try {
            if (req.body.search) {
                var query = { name: { $regex: req.body.search, $options: 'i' }, status: { $ne: "DELETE" } }
            }
            var options = {
                page: req.body.pageNumber || 1,
                limit: req.body.limit || 10,
            }
            dishModel.paginate(query, options, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (userData.docs == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } else {
                    response(res, SuccessCode.SUCCESS, userData, SuccessMessage.DATA_FOUND);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    deleteDish: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                console.log("==================>1", error, adminData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    dishModel.findOneAndUpdate({ _id: req.body.dishId, status: "ACTIVE" }, { $set: { status: "DELETE" } },
                        { new: true }, (err, updateData) => {
                            console.log("==================>2", err, updateData)
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (!updateData) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.DELETE_SUCCESS)
                            }
                        })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    addAge: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } },
                (error, adminData) => {
                    console.log("============>", adminData)
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!adminData) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                    }
                    else {
                        var obj = {
                            ageName: req.body.ageName
                        }
                        new ageMasterModel(obj).save((saveError, save) => {
                            if (saveError) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, save, SuccessMessage.DATA_SAVED)
                            }
                        })
                    }
                })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    editAge: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } },
            (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    ageMasterModel.findOneAndUpdate({ _id: req.body.ageId, status: "ACTIVE" },
                        { $set: { ageName: req.body.ageName } }, { new: true }, (err, updateAge) => {
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (!updateAge) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateAge, SuccessMessage.UPDATE_SUCCESS)
                            }
                        })
                }
            })
    },
    viewAge: (req, res) => {
        try {
            ageMasterModel.findOne({ _id: req.params._id, status: { $ne: "DELETE" } }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    ageList: (req, res) => {
        try {
            if (req.body.search) {
                var query = { ageName: { $regex: req.body.search, $options: 'i' }, status: { $ne: "DELETE" } }
            }
            var options = {
                page: req.body.pageNumber || 1,
                limit: req.body.limit || 10,
            }
            ageMasterModel.paginate(query, options, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (userData.docs == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } else {
                    response(res, SuccessCode.SUCCESS, userData, SuccessMessage.DATA_FOUND);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    deleteAge: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                console.log("==================>1", error, adminData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    ageMasterModel.findOneAndUpdate({ _id: req.body.ageId, status: "ACTIVE" }, { $set: { status: "DELETE" } },
                        { new: true }, (err, updateData) => {
                            console.log("==================>2", err, updateData)
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (!updateData) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.DELETE_SUCCESS)
                            }
                        })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },


    addEventCategory: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE" }, (error, adminData) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
            }
            else if (!adminData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
            }
            else {
                eventCategoryModel.findOne({ eventCategoryName: req.body.eventCategoryName, status: { $ne: "DELETE" } }, async (err, eventCategory) => {
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                    }
                    else if (eventCategory) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.ALREADY_EXITS)
                    }
                    else {
                        if (req.body.image) {
                            var pic = await convertImage()
                        }
                        var data = {
                            eventCategoryName: req.body.eventCategoryName,
                            image: pic
                        }
                        var obj = new eventCategoryModel(data)
                        obj.save((saveErr, save) => {
                            if (saveErr) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, save, SuccessMessage.DATA_SAVED)
                            }
                        })
                        //*********************Function for profile pic upload *************************************/
                        function convertImage() {
                            return new Promise((resolve, reject) => {
                                commonFunction.uploadImage(req.body.image, (uploadErr, uploaded) => {
                                    if (uploadErr) {
                                        console.log("Error uploading image")
                                    }
                                    else {
                                        resolve(uploaded)
                                    }
                                })
                            })
                        }
                    }
                })
            }
        })
    },
    editEventCategory: async (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "SUBADMIN"] } }, async (error, adminData) => {
                console.log("i am in user", error, adminData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    var set = {}
                    if (req.body.image) {
                        set["image"] = await convertImage()
                    }
                    if (req.body.eventCategoryName) {
                        set["eventCategoryName"] = req.body.eventCategoryName
                    }
                    eventCategoryModel.findOneAndUpdate({ _id: req.body.eventCategoryId, status: "ACTIVE" }, { $set: set }, { new: true }, async (err, categoryData) => {
                        // console.log(" iam in event category",err,categoryData)
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                        }
                        else if (!categoryData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, categoryData, SuccessMessage.UPDATE_SUCCESS);
                        }
                    })
                    //*********************Function for profile pic upload *************************************/
                    function convertImage() {
                        return new Promise((resolve, reject) => {
                            commonFunction.uploadImage(req.body.image, (err, uploadData) => {
                                if (err) {
                                    console.log("Error uploading image")
                                }
                                else {
                                    resolve(uploadData)
                                }
                            })
                        })
                    }
                }
            })
        }
        catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    eventCategoryList: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    var query = { status: { $ne: "DELETE" } }
                    if (req.body.eventCategoryName) {
                        query.eventCategoryName = new RegExp('^' + req.body.eventCategoryName, 'i')
                    }
                    req.body.limit = parseInt(req.body.limit);
                    var options = {
                        page: req.body.pageNumber || 1,
                        limit: req.body.limit || 10,
                        sort: {
                            createdAt: -1
                        }
                    };
                    eventCategoryModel.paginate(query, options, (err, event) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, err, ErrorMessage.SOMETHING_WRONG)
                        }
                        else if (event.docs.length == 0) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, event, SuccessMessage.DATA_FOUND)
                        }
                    })
                }
            })
        }
        catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    deleteEventCategory: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    eventCategoryModel.findOneAndUpdate({ _id: req.body.eventCategoryId, status: { $ne: "DELETE" } }, { $set: { status: "DELETE" } }, { new: true }, (deleteError, eventData) => {
                        if (deleteError) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!eventData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, eventData, SuccessMessage.DELETE_SUCCESS);
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    viewEventCategory: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    eventCategoryModel.findOne({ _id: req.params.eventCategoryId, status: { $ne: "DELETE" } }, (eventErr, eventData) => {
                        if (eventErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!eventData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, eventData, SuccessMessage.DETAIL_GET);
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    // approveEventCategory: (req, res) => {
    //     try {
    //         userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
    //             if (error) {
    //                 response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
    //             }
    //             else if (!adminData) {
    //                 response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
    //             }
    //             else {
    //                 eventCategoryModel.findOneAndUpdate({ _id: req.body.eventCategoryId, status:"PENDING" }, { $set: { status: "APPROVE" } }, { new: true }, (deleteError, eventData) => {
    //                     if (deleteError) {
    //                         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //                     }
    //                     else if (!eventData) {
    //                         response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
    //                     }
    //                     else {
    //                         response(res, SuccessCode.SUCCESS, eventData, SuccessMessage.DELETE_SUCCESS);
    //                     }
    //                 })
    //             }
    //         })
    //     }
    //     catch (error) {
    //         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    //     }
    // },
    //************************************************************************************************************************ */
    addEvent: (req, res) => {
        console.log("ewrewr", req, res)
        try {
            userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                console.log("190000>", error, adminData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    userModel.findOne({ _id: req.body.userId, status: "ACTIVE" }, async (err, customer) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                        }
                        else if (!customer) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                        }
                        else {
                            if (req.body.image) {
                                var image = await convertImage()
                            }

                            if (req.body.video) {
                                var eventVideo = await convertVideo()

                            }
                            var data = {
                                image: image ? image : "",
                                video: eventVideo ? eventVideo : "",
                                userId: req.body.userId,
                                name: customer.name,
                                eventTitle: req.body.eventTitle,
                                eventType: req.body.eventType,
                                description: req.body.description,
                                Address: req.body.Address,
                                date: req.body.date,
                                time: req.body.time,
                                invite: req.body.invite,
                                MaxPersonCapacity: req.body.MaxPersonCapacity,
                                pricePerPerson: req.body.pricePerPerson,
                                privacy: req.body.privacy,
                            }
                            eventModel.findOne({ eventTitle: req.body.eventTitle, status: { $ne: "DELETE" } }, async (findError, eventData) => {
                                if (findError) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                                }
                                else if (eventData) {
                                    response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.EVENT_EXISTS);
                                }
                                else {
                                    var obj = new eventModel(data)
                                    obj.save((saveError, eventResult) => {
                                        if (saveError) {
                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                                        }
                                        else {
                                            response(res, SuccessCode.SUCCESS, eventResult, SuccessMessage.DATA_SAVED)
                                        }
                                    })
                                }
                            })
                            //*********************Function for profile pic upload *************************************/
                            function convertImage() {
                                return new Promise((resolve, reject) => {
                                    commonFunction.multipleImageUploadCloudinary(req.body.image, (imgErr, imgUpl) => {
                                        if (imgErr) {
                                            console.log("Error uploading image")
                                        }
                                        else {
                                            resolve(imgUpl)
                                        }
                                    })
                                })
                            }
                            //*************************function for video upload*****************************/
                            function convertVideo() {
                                return new Promise((resolve, reject) => {
                                    commonFunction.multipleVideoUploadCloudinary(req.body.video, (videoErr, uploadData) => {
                                        console.log("i am in video")
                                        if (videoErr) {
                                            console.log("error while video Uploading")
                                        }
                                        else {
                                            resolve(uploadData)
                                        }
                                    })
                                })
                            }
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    editEvent: async (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "SUBADMIN"] } }, async (adminErr, adminData) => {
                if (adminErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    let set = {}
                    if (req.body.eventTitle) {
                        set["eventTitle"] = req.body.eventTitle
                    }
                    if (req.body.userId) {
                        set["userId"] = req.body.userId
                    }
                    if (req.body.eventType) {
                        set["eventType"] = req.body.eventType
                    }
                    if (req.body.description) {
                        set["description"] = req.body.description
                    }
                    if (req.body.Address) {
                        set["Address"] = req.body.Address
                    }
                    if (req.body.date) {
                        set["date"] = req.body.date
                    }
                    if (req.body.time) {
                        set["time"] = req.body.time
                    }
                    if (req.body.invite) {
                        set["invite"] = req.body.invite
                    }
                    if (req.body.MaxPersonCapacity) {
                        set["MaxPersonCapacity"] = req.body.MaxPersonCapacity
                    }
                    if (req.body.pricePerPerson) {
                        set["pricePerPerson"] = req.body.pricePerPerson
                    }
                    if (req.body.privacy) {
                        set["privacy"] = req.body.privacy
                    }
                    if (req.body.image) {
                        set["image"] = await convertImage()
                    }
                    if (req.body.video) {
                        set["video"] = await convertVideo()
                    }

                    eventModel.findOneAndUpdate({ _id: req.body.eventId, status: { $ne: "DELETE" } }, { $set: set }, { new: true }, async (eventErr, eventUpdate) => {
                        if (eventErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, eventUpdate, SuccessMessage.EDIT_SUCC);
                        }
                    })
                    function convertImage() {
                        return new Promise((resolve, reject) => {
                            commonFunction.multipleImageUploadCloudinary(req.body.image, (error, upload) => {
                                if (error) {
                                    console.log("Error uploading image")
                                }
                                else {
                                    resolve(upload)
                                }
                            })
                        })
                    }
                    //*************************function for video upload*****************************/
                    function convertVideo() {
                        return new Promise((resolve, reject) => {
                            commonFunction.multipleVideoUploadCloudinary(req.body.video, (videoErr, uploadData) => {
                                console.log("i am in video")
                                if (videoErr) {
                                    console.log("error while video Uploading")
                                }
                                else {
                                    resolve(uploadData)
                                }
                            })
                        })
                    }
                }
            })
        }
        catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }


        //*********************Function for profile pic upload *************************************/
        function convertImage() {
            return new Promise((resolve, reject) => {
                commonFunction.uploadImage(req.body.image, (error, uploaded) => {
                    if (error) {
                        console.log("Error uploading image")
                    }
                    else {
                        resolve(uploaded)
                    }
                })
            })
        }
        //*************************function for video upload*****************************/
        function convertVideo() {
            return new Promise((resolve, reject) => {
                commonFunction.videoUpload(req.body.videoLink, (videoErr, uploadData) => {
                    console.log("i am in video")
                    if (videoErr) {
                        console.log("error while video Uploading")
                    }
                    else {
                        resolve(uploadData)
                    }
                })
            })
        }
    },
    eventList: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    var query = { status: { $ne: "DELETE" } }
                    if (req.body.customerName) {
                        query.name = new RegExp('^' + req.body.customerName, 'i')
                    }
                    if (req.body.foodCategory) {
                        query.foodCategory = new RegExp('^' + req.body.foodCategory, 'i')
                    }
                    req.body.limit = req.body.limit;
                    var options = {
                        page: req.body.pageNumber || 1,
                        limit: req.body.limit || 10,
                        sort: {
                            createdAt: -1
                        }
                    };
                    eventModel.paginate(query, options, (err, event) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, err, ErrorMessage.SOMETHING_WRONG)
                        }
                        else if (event.docs.length == 0) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, event, SuccessMessage.DATA_FOUND)
                        }
                    })
                }
            })
        }
        catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    deleteEvent: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    eventModel.findOneAndUpdate({ _id: req.body.eventId, status: { $ne: "DELETE" } }, { $set: { status: "DELETE" } }, { new: true }, (deleteError, eventData) => {
                        if (deleteError) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!eventData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, eventData, SuccessMessage.DELETE_SUCCESS);
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    viewEvent: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {

                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    eventModel.findOne({ _id: req.body.eventId, status: "ACTIVE" }, (eventErr, eventData) => {
                        console.log("i am in event", eventErr, eventData)
                        if (eventErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!eventData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, eventData, SuccessMessage.DETAIL_GET);
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    //******************************************************************************************************************************************* */
    addMarketing: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    marketingModel.findOne({ marketingName: req.body.marketingName, status: { $ne: "DELETE" } }, (err, data) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                        }
                        else if (data) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.ALREADY_EXITS)
                        }
                        else {
                            const obj = new marketingModel({
                                marketingName: req.body.marketingName,
                                link: req.body.link
                            })
                            obj.save().then(data1 => {
                                res.send({ responseCode: 200, responseMessage: "Data added successfully", data1 })

                            }).catch(newErr => {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG, newErr)
                            })
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    deleteMarketing: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    marketingModel.findOneAndUpdate({ _id: req.body.marketingId, status: { $ne: "DELETE" } }, { $set: { status: "DELETE" } }, { new: true }, (deleteError, marketingdata) => {
                        if (deleteError) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!marketingdata) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, marketingdata, SuccessMessage.DELETE_SUCCESS);
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    marketingList: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                }
                else if (!adminData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    var query = { status: { $ne: "DELETE" } }
                    if (req.body.marketingName) {
                        query.marketingName = new RegExp('^' + req.body.marketingName, 'i')
                    }
                    req.body.limit = parseInt(req.body.limit);
                    var options = {
                        page: req.body.pageNumber || 1,
                        limit: req.body.limit || 10,
                        sort: {
                            createdAt: -1
                        }
                    };
                    marketingModel.paginate(query, options, (err, marketingdata) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, err, ErrorMessage.SOMETHING_WRONG)
                        }
                        else if (marketingdata.docs.length == 0) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, marketingdata, SuccessMessage.DATA_FOUND)
                        }
                    })
                }
            })
        }
        catch (error) {
            console.log(error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
       * Function Name :addGender
       * Description   : addGender by admin
       *
       * @return response
     */
    addGender: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
            }
            else if (!adminData) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
            }
            else {
                var query = {
                    $and: [
                        {
                            genderName: req.body.genderName
                        },
                        { status: { $in: ["ACTIVE", "BLOCK"] } }
                    ]
                };
                genderModel.findOne(query, (genderError, genderData) => {
                    if (genderError) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                    }
                    else if (genderData) {
                        if (genderData.genderName == req.body.genderName) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.ALREADY_EXITS)
                        }
                    }
                    else {
                        var obj = {
                            genderName: req.body.genderName
                        }
                        new genderModel(obj).save((saveError, saveResult) => {
                            if (saveError) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.DATA_SAVED)
                            }
                        })
                    }
                })

            }
        })

    },
    /**
    * Function Name :editGender
    * Description   : editGender by admin
    *
    * @return response
  */
    editGender: async (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, ErrorMessage.INTERNAL_ERROR)
                }
                else if (!adminData) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
                } else {
                    var query = {
                        $and: [
                            {
                                genderName: req.body.genderName
                            },
                            { status: { $in: ["ACTIVE", "BLOCK"] } }
                        ]
                    };
                    genderModel.findOne(query, async (err, result) => {
                        console.log("i am in gender", err, result)
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                        }
                        else if (result) {
                            if (result.genderName == req.body.genderName) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.ALREADY_EXITS)
                            }
                        }
                        else {
                            var genderData = await genderModel.findOneAndUpdate({ _id: req.body.genderId, status: "ACTIVE" }, { $set: { genderName: req.body.genderName } }, { new: true })
                            if (genderData) {
                                response(res, SuccessCode.SUCCESS, [], SuccessMessage.EDIT_SUCC);

                            }
                        }
                    })

                }
            })

        }
        catch (error) {
            return res.send({ responseCode: 500, responseMessage: "Internal server error", error })
        }
    },

    /**
    * Function Name :deleteGender
    * Description   : deleteGender by admin
    *
    * @return response
  */
    deleteGender: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                }
                else if (!adminData) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
                } else {
                    genderModel.findOneAndUpdate({ _id: req.body.genderId, status: "ACTIVE" }, { $set: { status: "DELETE" } },
                        { new: true }, (err, updateData) => {
                            console.log("==================>2", err, updateData)
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (!updateData) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.DELETE_SUCCESS)
                            }
                        })
                }
            })

        }
        catch (error) {
            return res.send({ responseCode: 500, responseMessage: "Internal server error", error })
        }

    },

    viewGender: (req, res) => {
        try {
            genderModel.findOne({ _id: req.params._id, status: { $ne: "DELETE" } }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :listOfGender
    * Description   : listOfGender by admin
    *
    * @return response
  */
    listOfGender: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
            }
            else if (!adminData) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
            } else {
                let query = { status: { $eq: "ACTIVE" } };
                if (req.body.search) {
                    query = { genderName: new RegExp('^' + req.body.search, "i") }
                }
                let options = {
                    page: req.body.pageNumber || 1,
                    limit: req.body.limit || 10,
                    sort: {
                        createdAt: -1
                    }
                }
                genderModel.paginate(query, options, (genderError, genderData) => {
                    if (genderError) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                    }
                    else if (genderData.docs.length == 0) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, genderData, SuccessMessage.DATA_FOUND)
                    }
                })
            }
        })

    },

    /**
      * Function Name :addLanguage
      * Description   : addLanguage by admin
      *
      * @return response
    */

    addLanguage: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
            }
            else if (!adminData) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
            }
            else {
                var query = {
                    $and: [
                        {
                            languageName: req.body.languageName
                        },
                        { status: { $in: ["ACTIVE", "BLOCK"] } }
                    ]
                };
                languageModel.findOne(query, (languageError, languageData) => {
                    if (languageError) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                    }
                    else if (languageData) {
                        if (languageData.languageName == req.body.languageName) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.ALREADY_EXITS)
                        }
                    }
                    else {
                        var obj = {
                            languageName: req.body.languageName
                        }
                        new languageModel(obj).save((saveError, saveResult) => {
                            if (saveError) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.DATA_SAVED)
                            }
                        })
                    }
                })

            }
        })

    },

    /**
    * Function Name :editLanguage
    * Description   : editLanguage by admin
    *
    * @return response
  */
    editLanguage: async (req, res) => {

        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, ErrorMessage.INTERNAL_ERROR)
                }
                else if (!adminData) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
                } else {
                    var query = {
                        $and: [
                            {
                                languageName: req.body.languageName
                            },
                            { status: { $in: ["ACTIVE", "BLOCK"] } }
                        ]
                    };
                    languageModel.findOne(query, async (err, result) => {
                        console.log("i am in gender", error, result)
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                        }
                        else if (result) {
                            if (result.languageName == req.body.languageName) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.ALREADY_EXITS)
                            }
                        }
                        else {
                            var languageData = await languageModel.findOneAndUpdate({ _id: req.body.languageId, status: "ACTIVE" }, { $set: { languageName: req.body.languageName } }, { new: true })
                            if (languageData) {
                                response(res, SuccessCode.SUCCESS, [], SuccessMessage.EDIT_SUCC);
                            }
                        }
                    })

                }
            })

        }
        catch (error) {
            return res.send({ responseCode: 500, responseMessage: "Internal server error", error })
        }
    },
    /**
        * Function Name :deleteLanguage
        * Description   : deleteLanguage by admin
        *
        * @return response
      */
    deleteLanguage: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                }
                else if (!adminData) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
                } else {
                    languageModel.findOneAndUpdate({ _id: req.body.languageId, status: "ACTIVE" }, { $set: { status: "DELETE" } },
                        { new: true }, (err, updateData) => {
                            console.log("==================>2", err, updateData)
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (!updateData) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.DELETE_SUCCESS)
                            }
                        })
                }
            })

        }
        catch (error) {
            return res.send({ responseCode: 500, responseMessage: "Internal server error", error })
        }

    },


    viewLanguage: (req, res) => {
        try {
            languageModel.findOne({ _id: req.params._id, status: { $ne: "DELETE" } }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    /**
    * Function Name :languageList
    * Description   : listOfLanguage by admin
    *
    * @return response
  */
    languageList: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
            }
            else if (!adminData) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
            } else {
                let query = { status: { $eq: "ACTIVE" } };
                if (req.body.search) {
                    query = { languageName: new RegExp('^' + req.body.search, "i") }
                }
                let options = {
                    page: req.body.pageNumber || 1,
                    limit: req.body.limit || 10,
                    sort: {
                        createdAt: -1
                    }
                }
                languageModel.paginate(query, options, (languageError, languageData) => {
                    if (languageError) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                    }
                    else if (languageData.docs.length == 0) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, languageData, SuccessMessage.DATA_FOUND)
                    }
                })
            }
        })

    },

    /**
    * Function Name :addInterest
    * Description   : addInterest by admin
    *
    * @return response
  */
    addInterest: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
            }
            else if (!adminData) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
            }
            else {
                var query = {
                    $and: [
                        {
                            interestName: req.body.interestName
                        },
                        { status: { $in: ["ACTIVE", "BLOCK"] } }
                    ]
                };
                interestModel.findOne(query, (interestError, interestData) => {
                    if (interestError) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                    }
                    else if (interestData) {
                        if (interestData.interestName == req.body.interestName) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.ALREADY_EXITS)
                        }
                    }
                    else {
                        var obj = {
                            interestName: req.body.interestName
                        }
                        new interestModel(obj).save((saveError, saveResult) => {
                            if (saveError) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.DATA_SAVED)
                            }
                        })
                    }
                })

            }
        })

    },

    /**
    * Function Name :editInterest
    * Description   : editInterest by admin
    *
    * @return response
  */
    editInterest: async (req, res) => {

        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, ErrorMessage.INTERNAL_ERROR)
                }
                else if (!adminData) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
                } else {
                    var query = {
                        $and: [
                            {
                                interestName: req.body.interestName
                            },
                            { status: { $in: ["ACTIVE", "BLOCK"] } }
                        ]
                    };
                    interestModel.findOne(query, async (err, result) => {
                        console.log("i am in gender", err, result)
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                        }
                        else if (result) {
                            if (result.interestName == req.body.interestName) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.ALREADY_EXITS)
                            }
                        }
                        else {
                            var interestData = await interestModel.findOneAndUpdate({ _id: req.body.interestId, status: "ACTIVE" }, { $set: { interestName: req.body.interestName } }, { new: true })
                            if (interestData) {
                                response(res, SuccessCode.SUCCESS, result, SuccessMessage.EDIT_SUCC);
                            }
                        }
                    })

                }
            })

        }
        catch (error) {
            return res.send({ responseCode: 500, responseMessage: "Internal server error", error })
        }
    },

    /**
    * Function Name :deleteInterest
    * Description   : deleteInterest by admin
    *
    * @return response
  */
    deleteInterest: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                }
                else if (!adminData) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
                } else {
                    interestModel.findOneAndUpdate({ _id: req.body.interestId, status: "ACTIVE" }, { $set: { status: "DELETE" } },
                        { new: true }, (err, updateData) => {
                            console.log("==================>2", err, updateData)
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (!updateData) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.DELETE_SUCCESS)
                            }
                        })
                }
            })

        }
        catch (error) {
            return res.send({ responseCode: 500, responseMessage: "Internal server error", error })
        }

    },


    viewInterest: (req, res) => {
        try {
            interestModel.findOne({ _id: req.params._id, status: { $ne: "DELETE" } }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    /**
    * Function Name :interestList
    * Description   : interest List view By admin
    *
    * @return response
  */
    interestList: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
            }
            else if (!adminData) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
            } else {
                let query = { status: { $ne: "DELETE" } };
                // if (req.body.search) {
                //     query = { interestName: new RegExp('^' + req.body.search, "i") }
                // }
                if (req.body.search) {
                    query = { interestName: { $regex: req.body.search, $options: 'i' } }
                }
                if (req.body.search) {
                    query = {
                        $and: [{ status: { $ne: "DELETE" } }, {
                            $or: [{ interestName: { $regex: req.body.search, $options: 'i' } },
                            { shopName: { $regex: req.body.search, $options: 'i' } }]
                        }]
                    }
                }

                let options = {
                    page: req.body.pageNumber || 1,
                    limit: req.body.limit || 10,
                    sort: {
                        createdAt: -1
                    }
                }
                interestModel.paginate(query, options, (interestError, interestData) => {
                    if (interestError) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                    }
                    else if (interestData.docs.length == 0) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, interestData, SuccessMessage.DATA_FOUND)
                    }
                })
            }
        })

    },
    /**
   * Function Name :addFavourite
   * Description   : addFavourite by admin
   *
   * @return response
 */
    addFavourite: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
            }
            else if (!adminData) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
            }
            else {
                var query = {
                    $and: [
                        {
                            foodName: req.body.foodName
                        },
                        { status: { $in: ["ACTIVE", "BLOCK"] } }
                    ]
                };
                favouriteModel.findOne(query, (favouriteError, favouriteData) => {
                    if (favouriteError) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                    }
                    else if (favouriteData) {
                        if (favouriteData.foodName == req.body.foodName) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.ALREADY_EXITS)
                        }
                    }
                    else {
                        var obj = {
                            foodName: req.body.foodName
                        }
                        new favouriteModel(obj).save((saveError, saveResult) => {
                            if (saveError) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.DATA_SAVED)
                            }
                        })
                    }
                })

            }
        })

    },

    /**
        * Function Name :editFavorite
        * Description   : editFavorite by admin
        *
        * @return response
      */
    editFavorite: async (req, res) => {

        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, ErrorMessage.INTERNAL_ERROR)
                }
                else if (!adminData) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
                } else {
                    var query = {
                        $and: [
                            {
                                foodName: req.body.foodName
                            },
                            { status: { $in: ["ACTIVE", "BLOCK"] } }
                        ]
                    };
                    favouriteModel.findOne(query, async (err, result) => {
                        console.log("i am in gender", err, result)
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                        }
                        else if (result) {
                            if (result.foodName == req.body.foodName) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.ALREADY_EXITS)
                            }
                        }
                        else {
                            var favouriteData = await favouriteModel.findOneAndUpdate({ _id: req.body.favouriteId, status: "ACTIVE" }, { $set: { foodName: req.body.foodName } }, { new: true })
                            if (favouriteData) {
                                response(res, SuccessCode.SUCCESS, result, SuccessMessage.EDIT_SUCC);
                            }
                        }
                    })

                }
            })

        }
        catch (error) {
            return res.send({ responseCode: 500, responseMessage: "Internal server error", error })
        }
    },

    /**
    * Function Name :deleteFavourite
    * Description   : delete Favourite food by admin
    *
    * @return response
  */
    deleteFavourite: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                }
                else if (!adminData) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
                } else {
                    favouriteModel.findOneAndUpdate({ _id: req.body.favouriteId, status: "ACTIVE" }, { $set: { status: "DELETE" } },
                        { new: true }, (err, updateData) => {
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (!updateData) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.DELETE_SUCCESS)
                            }
                        })
                }
            })

        }
        catch (error) {
            return res.send({ responseCode: 500, responseMessage: "Internal server error", error })
        }

    },


    viewFavourite: (req, res) => {
        try {
            favouriteModel.findOne({ _id: req.params._id, status: { $ne: "DELETE" } }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    /**
    * Function Name :favouriteList
    * Description   : favourite List view By admin
    *
    * @return response
  */
    favouriteList: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
            }
            else if (!adminData) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
            } else {
                let query = { status: { $eq: "ACTIVE" } };
                if (req.body.search) {
                    query = { foodName: new RegExp('^' + req.body.search, "i") }
                }
                let options = {
                    page: req.body.pageNumber || 1,
                    limit: req.body.limit || 10,
                    sort: {
                        createdAt: -1
                    }
                }
                favouriteModel.paginate(query, options, (favouriteError, favouriteData) => {
                    if (favouriteError) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                    }
                    else if (favouriteData.docs.length == 0) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, favouriteData, SuccessMessage.DATA_FOUND)
                    }
                })
            }
        })

    },
    siteView: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (error, adminData) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
            }
            else if (!adminData) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
            } else {
                var query = { status: { $ne: "DELETE" } };
                siteModel.find(query, (siteErr, siteData) => {
                    if (siteErr) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                    }
                    else if (!siteData) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, siteData, SuccessMessage.DATA_FOUND)
                    }
                })
            }
        })
    },
    editSite: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, async (error, adminData) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
            }
            else if (!adminData) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
            } else {
                let set = {}
                if (req.body.name) {
                    set["name"] = req.body.name
                }
                if (req.body.email) {
                    set["email"] = req.body.email
                }
                if (req.body.website) {
                    set["website"] = req.body.website
                }
                if (req.body.phone) {
                    set["phone"] = req.body.phone
                }
                if (req.body.mobile) {
                    set["mobile"] = req.body.mobile
                }
                if (req.body.address) {
                    set["address"] = req.body.address
                }
                if (req.body.chatMaxUserInGroup) {
                    set["chatMaxUserInGroup"] = req.body.chatMaxUserInGroup
                }
                if (req.body.logo) {
                    set["logo"] = await imgUpload(req.body.logo)
                }
                if (req.body.favicon) {
                    set["favicon"] = await favicon(req.body.favicon)
                }
                siteModel.findOneAndUpdate({ _id: req.body.siteId, status: { $ne: "DELETE" } }, { $set: set }, { new: true }, (err, pageData) => {
                    if (err) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                    }
                    else if (!pageData) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, pageData, SuccessMessage.UPDATE_SUCCESS);
                    }
                })
            }
        })

    },

    addReward: async (req, res) => {
        try {
            var picData = await upload(req.body.photo)
            var obj = new rewardModel({
                userId: req.body.userId,
                reward: req.body.reward,
                rewardAmount: req.body.rewardAmount,
                comment: req.body.comment,
                photo: picData
            })
            obj.save((error, result) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_SAVED)
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    giveReward: (req, res) => {
        userModel.findOne({ _id: req.body.adminId, status: "ACTIVE" }, (err, adminData) => {
            if (err) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!adminData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
            }
            else {
                userModel.findOne({ _id: req.body.userId, status: "ACTIVE" }, (userDataError, userData) => {
                    if (userDataError) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!userData) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                    }
                    else {
                        var obj = new rewardModel({
                            adminId: adminData._id,
                            name: adminData.name,
                            profilePic: adminData.profilePic,
                            rewardType: "GIVE",
                            userId: req.body.userId,
                            reward: req.body.reward,
                            countryCode: userData.countryCode,
                            rewardAmount: req.body.rewardAmount,
                        })
                        commonFunction.sendRewardMail(userData.email, "REWARD BY JIGR", userData.name, (mailError, mailed) => {
                            if (mailError) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                obj.save((error, result) => {
                                    if (error) {
                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_SAVED)
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })

    },

    viewReward: (req, res) => {
        try {
            rewardModel.findOne({ _id: req.params.rewardId, status: "ACTIVE" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_SAVED)
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    editReward: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, async (error, adminData) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
            }
            else if (!adminData) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.NOT_FOUND)
            } else {
                let set = {}
                if (req.body.reward) {
                    set["reward"] = req.body.reward
                }
                if (req.body.email) {
                    set["rewardAmount"] = req.body.rewardAmount
                }
                if (req.body.comment) {
                    set["comment"] = req.body.comment
                }
                if (req.body.photo) {
                    set["photo"] = await imgUpload(req.body.photo)
                }
                rewardModel.findOneAndUpdate({ _id: req.body.siteId, status: { $ne: "DELETE" } }, { $set: set }, { new: true }, (err, pageData) => {
                    if (err) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                    }
                    else if (!pageData) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, pageData, SuccessMessage.UPDATE_SUCCESS);
                    }
                })
            }
        })
    },

    userListForReward: (req, res) => {
        var query = { userType: "USER" }
        if (req.body.fromDate && req.body.toDate) {
            query.$and = [{
                createdAt: { $gte: req.body.fromDate }
            },
            {
                createdAt: { $lte: req.body.toDate }
            }]
        }

        if (req.body.fromDate && !req.body.toDate) {
            query.createdAt = { $gte: req.body.fromDate }
        }
        if (!req.body.fromDate && req.body.toDate) {
            query.createdAt = { $lte: req.body.toDate }
        }
        if (req.body.countryName) {
            query.countryName = new RegExp('^' + req.body.countryName, "i")
        }
        let options = {
            page: req.body.pageNumber || 1,
            limit: req.body.limit || 10,
            sort: {
                createdAt: -1
            }
        }
        userModel.paginate(query, options, (error, result) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
            }
            else if (result.docs.length == 0) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
            }
            else {
                response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_SAVED)
            }
        })
    },

    reportList: (req, res) => {
        userModel.findOne({ _id: req.headers.adminid, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (adminErr, adminData) => {
            if (adminErr) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                let query = { status: { $eq: "ACTIVE" } };
                if (req.body.countryName) {
                    query.countryName = new RegExp('^' + req.body.countryName, "i")
                }
                let options = {
                    page: req.body.pageNumber || 1,
                    limit: req.body.limit || 10,
                    sort: {
                        createdAt: -1
                    }
                }
                reportModel.paginate(query, options, (couuntryError, countryData) => {
                    if (couuntryError) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (countryData.docs.length == 0) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, [countryData], SuccessMessage.DATA_FOUND);
                    }
                })
            }
        })
    },

    viewReport: (req, res) => {
        reportModel.findOne({ _id: req.body.reportId, status: "ACTIVE" }, (error, result) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
            }
            else {
                response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
            }
        })
    },

    deleteReport: (req, res) => {
        reportModel.findOneAndUpdate({ _id: req.body.reportId, status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true }, (error, result) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
            }
            else {
                response(res, SuccessCode.SUCCESS, result, SuccessMessage.DELETE_SUCCESS);
            }
        })
    },
    deletePost: (req, res) => {
        postModel.findOneAndUpdate({ _id: req.body.postId, postStatus: "ACTIVE" }, { $set: { postStatus: "DELETE" } }, { new: true }, (error, result) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
            }
            else {
                response(res, SuccessCode.SUCCESS, result, SuccessMessage.DELETE_SUCCESS);
            }
        })
    },

    dashboard: (req, res) => {
        userModel.count({ userType: "USER", status: "ACTIVE" }, (error, result) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
            }
            else {
                eventModel.count({ status: "ACTIVE" }, (eventError, eventData) => {
                    if (eventError) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                    }
                    else {
                        feedbackModel.count((feedbackError, feedback) => {
                            if (feedbackError) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                            }
                            else {
                                userModel.count({ verifyStatus: false }, (verifyError, verifyStatus) => {
                                    if (verifyError) {
                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                                    }
                                    else {
                                        var data = {
                                            customerCount: result,
                                            event: eventData,
                                            feedback: feedback,
                                            verifyStatus: verifyStatus
                                        }
                                        response(res, SuccessCode.SUCCESS, data, SuccessMessage.DATA_SAVED)
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    },

    //-------faq management-----------------------------------

    addFaq: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (adminErr, adminData) => {
                if (adminErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    faqModel.findOne({ question: req.body.question, status: { $ne: "DELETE" } }, (findErr, findRes) => {
                        if (findErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (findRes) {
                            response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.QUESTION_EXIST);
                        }
                        else {
                            new faqModel(req.body).save((err, saveResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.FAQ_ADDED);
                                }
                            })
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },



    editFaq: (req, res) => {
        try {
            if (!req.body.faqId) {
                response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
            }
            else {
                faqModel.findOne({ _id: req.body.faqId, status: "ACTIVE" }, (err, findRes) => {
                    if (err) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!findRes) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                    }
                    else {
                        let obj = {}

                        if (req.body.question) {
                            obj.question = req.body.question
                        }
                        if (req.body.answer) {
                            obj.answer = req.body.answer
                        }
                        let query = { _id: findRes.id, status: "ACTIVE" }
                        faqModel.findByIdAndUpdate(query, { $set: obj }, { new: true }, (updateErr, updateRes) => {
                            if (updateErr) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateRes, SuccessMessage.UPDATE_SUCCESS);
                            }
                        })
                    }
                })
            }
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }

    },
    faqList: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (adminErr, adminData) => {
            if (adminErr) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                let query = { status: { $eq: "ACTIVE" } };

                let options = {
                    page: req.body.pageNumber || 1,
                    limit: req.body.limit || 5,
                    sort: {
                        createdAt: -1
                    }
                }
                faqModel.paginate(query, options, (couuntryError, faqData) => {
                    if (couuntryError) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (faqData.docs.length == 0) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, [faqData], SuccessMessage.DATA_FOUND);
                    }
                })
            }
        })
    },
    viewFaq: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (adminErr, adminData) => {
            if (adminErr) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                faqModel.findOne({ _id: req.body.faqId, status: "ACTIVE" }, (viewErr, viewData) => {
                    if (viewErr) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!viewData) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, [viewData], SuccessMessage.DATA_FOUND);
                    }
                })
            }
        })
    },
    addOfflineCountry: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (adminErr, adminData) => {
                if (adminErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    var query = {
                        $and: [
                            { countryName: req.body.countryName },
                            { status: { $in: ["ACTIVE", "BLOCK"] } }
                        ]
                    };
                    offlineCountry.findOne(query, (checkErr, checkResult) => {
                        if (checkErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (checkResult) {
                            if (checkResult.countryName == req.body.countryName) {
                                res.send({ responseCode: 404, responseMessage: "Country name already exist" })
                            }
                        }
                        else {
                            var imageArray = [];
                            req.body.eventCategory.forEach(a => imageArray.push({ category: a }));
                            let newsObj = new offlineCountry({
                                countryName: req.body.countryName,
                                eventCategory: imageArray,
                            })
                            newsObj.save((err, saveResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.FAQ_ADDED);
                                }
                            })
                        }
                    })

                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    editOfflineEvent: async (req, res) => {

        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (userErr, userDetails) => {
            if (userErr) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                if (req.body.image) {
                    commonFunction.uploadImage(req.body.image, (imageErr, imageResult) => {
                        if (imageErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            req.body.image = imageResult
                            offlineEvent.findOneAndUpdate({ _id: req.body.eventId, status: "ACTIVE" }, req.body, { new: true }, (error, result) => {
                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    res.send({ responseCode: 200, responseMessage: "Edited successfully.", result })
                                }
                            })

                        }
                    })
                }
                else {
                    offlineEvent.findOneAndUpdate({ _id: req.body.eventId, status: "ACTIVE" }, req.body, { new: true }, (error, result) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            res.send({ responseCode: 200, responseMessage: "Edited successfully.", result })
                        }
                    })
                }
            }
        })

    },
    addOfflineEvent: async (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } },
                async (error, adminData) => {
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!adminData) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                    }
                    else {
                        if (req.body.image) {
                            var picture = await convertImage()
                        }
                        var obj = {
                            "feedbackTime": req.body.feedbackTime,
                            "image": picture
                        }
                        new offlineEvent(obj).save((saveErr, save) => {
                            if (saveErr) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, save, SuccessMessage.DATA_SAVED)
                            }
                        })
                        //*********************Function for profile pic upload *************************************/
                        function convertImage() {
                            return new Promise((resolve, reject) => {
                                commonFunction.uploadImage(req.body.image, (uploadErr, uploaded) => {
                                    if (uploadErr) {
                                        console.log("Error uploading image")
                                    }
                                    else {
                                        resolve(uploaded)
                                    }
                                })
                            })
                        }
                    }
                })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    getOfflineEvent: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (userErr, userDetails) => {
            if (userErr) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                offlineEvent.findOne({ status: "ACTIVE" }, (eventErr, eventResult) => {
                    if (eventErr) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else {
                        offlineCountry.find({ status: "ACTIVE" }, (countryErr, countryData) => {
                            if (countryErr) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                res.send({ responseCode: 200, responseMessage: "Data found sucessfully", eventResult, countryData })

                            }
                        })

                    }
                })
            }
        })
    },
    editOfflineCountry: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, async (userErr, userDetails) => {
            console.log("3642====>", userErr, userDetails)
            if (userErr) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                let query1 = { $and: [{ _id: req.body.countryId }, { status: "ACTIVE" }] }
                offlineCountry.findOne(query1, (existErr, existResult) => {
                    if (existErr) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!existResult) {
                        res.send({ responseCode: 404, responseMessage: "Data not found" })
                    }
                    else {
                        var query = {
                            $and: [
                                { countryName: req.body.countryName },
                                { status: { $in: ["ACTIVE", "BLOCK"] } },
                                { _id: { $ne: existResult._id } }
                            ]
                        };
                        offlineCountry.findOne(query, (checkErr, checkResult) => {
                            if (checkErr) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (checkResult) {
                                if (checkResult.countryName == req.body.countryName) {
                                    res.send({ responseCode: 404, responseMessage: "Country name already exist" })
                                }
                            }
                            else {

                                if (req.body.countryName) {
                                    offlineCountry.findOneAndUpdate({ _id: req.body.countryId, status: "ACTIVE" },
                                        { $set: { countryName: req.body.countryName } },
                                        { new: true },
                                        (eventErr, eventResult) => {
                                            console.log("3647=======>", eventErr, eventResult)
                                            if (eventErr) {
                                                console.log(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR, eventErr);
                                            }
                                            else {
                                                console.log({ responseCode: 200, responseMessage: "Data updated sucessfully", eventResult })
                                            }
                                        })
                                }
                                if (req.body.eventCategory) {
                                    var imageArray = [];
                                    req.body.eventCategory.forEach(a => imageArray.push({ category: a }));

                                    offlineCountry.findOneAndUpdate({ _id: req.body.countryId, status: "ACTIVE" },
                                        { $push: { eventCategory: imageArray } },
                                        { new: true },
                                        (eventErr, eventResult) => {
                                            if (eventErr) {
                                                console.log(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR, eventErr);
                                            }
                                            else {
                                                console.log({ responseCode: 200, responseMessage: "Data updated sucessfully", eventResult })
                                            }
                                        })
                                }
                                res.send({ responseCode: 200, responseMessage: "Data updated sucessfully" })
                            }
                        })
                    }
                })
            }
        })
    },
    deleteOfflineCountry: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (userErr, userDetails) => {
            if (userErr) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                offlineCountry.findOneAndUpdate({ "_id": req.body.countryId, status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true }, (eventErr, eventResult) => {
                    if (eventErr) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else {
                        res.send({ responseCode: 200, responseMessage: "Data deleted sucessfully", eventResult })
                    }
                })
            }
        })

    },
    viewOfflineCountry: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (userErr, userDetails) => {
            if (userErr) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                offlineCountry.findOne({ _id: req.body.countryId, status: "ACTIVE" }, (countryErr, countryData) => {
                    if (countryErr) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else {
                        res.send({ responseCode: 200, responseMessage: "Data found sucessfully", countryData })
                    }
                })
            }
        })
    },

    deleteOfflineCategory: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (adminErr, adminData) => {
            if (adminErr) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                req.body.categoryData.forEach(a => {

                    offlineCountry.findOneAndUpdate({ _id: req.body.countryId, "eventCategory._id": a.categoryId },
                        { $set: { "eventCategory.$.categoryStatus": a.categoryStatus } },
                        { new: true },
                        (eventErr, eventResult) => {
                            console.log("3647=======>", eventErr, eventResult)
                            if (eventErr) {
                                console.log(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR, eventErr);
                            }
                            else {
                                console.log({ responseCode: 200, responseMessage: "Data updated sucessfully", eventResult })
                            }
                        })
                })
                res.send({ responseCode: 200, responseMessage: "Data updated sucessfully" })

            }
        })
    },

    addOnlineCountry: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (adminErr, adminData) => {
                if (adminErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    var query = {
                        $and: [
                            { countryName: req.body.countryName },
                            { status: { $in: ["ACTIVE", "BLOCK"] } }
                        ]
                    };
                    onlineCountry.findOne(query, (checkErr, checkResult) => {
                        if (checkErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (checkResult) {
                            if (checkResult.countryName == req.body.countryName) {
                                res.send({ responseCode: 404, responseMessage: "Country name already exist" })
                            }
                        }
                        else {
                            var imageArray = [];
                            req.body.eventCategory.forEach(a => imageArray.push({ category: a }));
                            let newsObj = new onlineCountry({
                                countryName: req.body.countryName,
                                eventCategory: imageArray,
                            })
                            newsObj.save((err, saveResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.FAQ_ADDED);
                                }
                            })
                        }
                    })

                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    editOnlineCountry: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, async (userErr, userDetails) => {
            console.log("3642====>", userErr, userDetails)
            if (userErr) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                let query1 = { $and: [{ _id: req.body.countryId }, { status: "ACTIVE" }] }
                onlineCountry.findOne(query1, (existErr, existResult) => {
                    if (existErr) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!existResult) {
                        res.send({ responseCode: 404, responseMessage: "Data not found" })
                    }
                    else {
                        var query = {
                            $and: [
                                { countryName: req.body.countryName },
                                { status: { $in: ["ACTIVE", "BLOCK"] } },
                                { _id: { $ne: existResult._id } }
                            ]
                        };
                        onlineCountry.findOne(query, (checkErr, checkResult) => {
                            if (checkErr) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (checkResult) {
                                if (checkResult.countryName == req.body.countryName) {
                                    res.send({ responseCode: 404, responseMessage: "Country name already exist" })
                                }
                            }
                            else {

                                if (req.body.countryName) {
                                    onlineCountry.findOneAndUpdate({ _id: req.body.countryId, status: "ACTIVE" },
                                        { $set: { countryName: req.body.countryName } },
                                        { new: true },
                                        (eventErr, eventResult) => {
                                            console.log("3647=======>", eventErr, eventResult)
                                            if (eventErr) {
                                                console.log(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR, eventErr);
                                            }
                                            else {
                                                console.log({ responseCode: 200, responseMessage: "Data updated sucessfully", eventResult })
                                            }
                                        })
                                }
                                if (req.body.eventCategory) {
                                    var imageArray = [];
                                    req.body.eventCategory.forEach(a => imageArray.push({ category: a }));

                                    onlineCountry.findOneAndUpdate({ _id: req.body.countryId, status: "ACTIVE" },
                                        { $push: { eventCategory: imageArray } },
                                        { new: true },
                                        (eventErr, eventResult) => {
                                            if (eventErr) {
                                                console.log(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR, eventErr);
                                            }
                                            else {
                                                console.log({ responseCode: 200, responseMessage: "Data updated sucessfully", eventResult })
                                            }
                                        })
                                }
                                res.send({ responseCode: 200, responseMessage: "Data updated sucessfully" })
                            }
                        })
                    }
                })
            }
        })
    },
    addOnlineEvent: async (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } },
                async (error, adminData) => {
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!adminData) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                    }
                    else {
                        if (req.body.image) {
                            var image = await convertImage()

                            var imageArray1 = [];
                            image.forEach(a => imageArray1.push(a));

                        }
                        if (req.body.video) {
                            var video = await convertVideo()
                        }
                        if (req.body.picture) {
                            var pictures = await convertPicture()
                        }
                        var imageArray = [];
                        req.body.DefaultEventType.forEach(a => imageArray.push({ eventType: a }));
                        var obj = {
                            "images": imageArray1,
                            "video": video,
                            "picture": pictures,
                            "allowedInAntakshari": req.body.allowedInAntakshari,
                            "joinInOnlineEvent": req.body.joinInOnlineEvent,
                            "title": req.body.title,
                            "defaultDuration": req.body.defaultDuration,
                            "numberOfParticipants": req.body.numberOfParticipants,
                            "eventFeebackDuration": req.body.eventFeebackDuration,
                            "DefaultEventType": imageArray
                        }
                        new onlineEvent(obj).save((saveErr, save) => {
                            if (saveErr) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, save, SuccessMessage.DATA_SAVED)
                            }
                        })
                        //*********************Function for profile pic upload *************************************/
                        function convertImage() {
                            return new Promise((resolve, reject) => {
                                commonFunction.multipleImageUploadCloudinary(req.body.image, (imageError, upload) => {
                                    if (imageError) {
                                        console.log("Error uploading image")
                                    }
                                    else {
                                        resolve(upload)
                                    }
                                })
                            })
                        }
                        function convertVideo() {
                            return new Promise((resolve, reject) => {
                                commonFunction.videoUpload(req.body.video, (uploadErr, uploaded) => {
                                    if (uploadErr) {
                                        console.log("Error uploading image")
                                    }
                                    else {
                                        resolve(uploaded)
                                    }
                                })
                            })
                        }
                        function convertPicture() {
                            return new Promise((resolve, reject) => {
                                commonFunction.uploadImage(req.body.picture, (uploadErr, uploaded) => {
                                    if (uploadErr) {
                                        console.log("Error uploading image")
                                    }
                                    else {
                                        resolve(uploaded)
                                    }
                                })
                            })
                        }
                    }
                })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    editOnlineEvent: async (req, res) => {
        var set = {}
        if (req.body.allowedInAntakshari) {
            set["allowedInAntakshari"] = req.body.allowedInAntakshari
        }
        if (req.body.title) {
            set["title"] = req.body.title
        }
        if (req.body.joinInOnlineEvent) {
            set["joinInOnlineEvent"] = req.body.joinInOnlineEvent
        }
        if (req.body.image) {

            var image = await convertImage()

            var imageArray1 = [];
            image.forEach(a => imageArray1.push(a));
            req.body.image = imageArray1

            set["images"] = await convertImage()
        }
        if (req.body.video) {
            set["video"] = await onlineVideo()
        }

        if (req.body.picture) {
            set["picture"] = await onlinePicture()
        }

        if (req.body.defaultDuration) {
            set["defaultDuration"] = req.body.defaultDuration
        }
        if (req.body.numberOfParticipants) {
            set["numberOfParticipants"] = req.body.numberOfParticipants
        }
        if (req.body.eventFeebackDuration) {
            set["eventFeebackDuration"] = req.body.eventFeebackDuration
        }


        onlineEvent.findOneAndUpdate({ _id: req.body.eventId, status: "ACTIVE" }, { $set: set }, { new: true }, (error, result) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                res.send({ responseCode: 200, responseMessage: "Edited successfully.", result })
            }
        })
        function convertImage() {
            return new Promise((resolve, reject) => {
                commonFunction.multipleImageUploadCloudinary(req.body.image, (imageError, upload) => {
                    if (imageError) {
                        console.log("Error uploading image")
                    }
                    else {
                        resolve(upload)
                    }
                })
            })
        }
        //*************************function for video upload*****************************/
        function onlineVideo() {
            return new Promise((resolve, reject) => {
                commonFunction.videoUpload(req.body.video, (videoErr, uploadData) => {
                    console.log("i am in video")
                    if (videoErr) {
                        console.log("error while video Uploading")
                    }
                    else {
                        resolve(uploadData)
                    }
                })
            })
        }
        function onlinePicture() {
            return new Promise((resolve, reject) => {
                commonFunction.uploadImage(req.body.picture, (uploadErr, uploadData) => {
                    if (uploadErr) {
                        console.log("Error uploading image")
                    }
                    else {
                        resolve(uploadData)
                    }
                })
            })
        }
    },
    deleteOnlineCountry: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (userErr, userDetails) => {
            if (userErr) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                onlineCountry.findOneAndUpdate({ "_id": req.body.countryId, status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true }, (eventErr, eventResult) => {
                    if (eventErr) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else {
                        res.send({ responseCode: 200, responseMessage: "Data deleted sucessfully", eventResult })
                    }
                })
            }
        })

    },
    deleteOnlineCategory: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (adminErr, adminData) => {
            if (adminErr) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                req.body.categoryData.forEach(a => {

                    onlineCountry.findOneAndUpdate({ _id: req.body.countryId, "eventCategory._id": a.categoryId },
                        { $set: { "eventCategory.$.categoryStatus": a.categoryStatus } },
                        { new: true },
                        (eventErr, eventResult) => {
                            console.log("3647=======>", eventErr, eventResult)
                            if (eventErr) {
                                console.log(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR, eventErr);
                            }
                            else {
                                console.log({ response_code: 200, response_message: "Data updated sucessfully", eventResult })
                            }
                        })
                })
                res.send({ response_code: 200, response_message: "Data updated sucessfully" })

            }
        })
    },

    getOnlineEvent: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (userErr, userDetails) => {
            if (userErr) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                onlineEvent.findOne({ status: "ACTIVE" }, (eventErr, eventResult) => {
                    if (eventErr) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else {
                        onlineCountry.find({ status: "ACTIVE" }, (countryErr, countryData) => {
                            if (countryErr) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                res.send({ responseCode: 200, responseMessage: "Data found sucessfully", eventResult, countryData })

                            }
                        })
                    }
                })
            }
        })
    },
    viewOnlineCountry: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (userErr, userDetails) => {
            if (userErr) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                onlineCountry.findOne({ _id: req.body.countryId, status: "ACTIVE" }, (countryErr, countryData) => {
                    if (countryErr) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else {
                        res.send({ responseCode: 200, responseMessage: "Data found sucessfully", countryData })
                    }
                })
            }
        })
    },
    deleteEventType: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } }, (adminErr, adminData) => {
            if (adminErr) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                req.body.eventData.forEach(a => {

                    onlineEvent.findOneAndUpdate({ _id: req.body.eventId, "DefaultEventType._id": a.eventTypeId },
                        { $set: { "DefaultEventType.$.eventTypeStatus": a.eventTypeStatus } },
                        { new: true },
                        (eventErr, eventResult) => {
                            console.log("3647=======>", eventErr, eventResult)
                            if (eventErr) {
                                console.log(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR, eventErr);
                            }
                            else {
                                console.log({ responseCode: 200, responseMessage: "Data updated sucessfully", eventResult })
                            }
                        })
                })
                res.send({ responseCode: 200, responseMessage: "Data updated sucessfully" })

            }
        })
    },
    addRole: (req, res) => {
        try {
            if (!req.body.roleName) {
                response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
            }
            else {
                roleModel.findOne({ roleName: req.body.roleName, status: { $in: ["ACTIVE", "BLOCK"] } }, (findErr, findRes) => {
                    if (findErr) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (findRes) {
                        response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.ROLE_EXIST);
                    }
                    else {
                        req.body.permissions = [{
                            dashboard: req.body.dashboard,
                            newCustomer: req.body.newCustomer,
                            events: req.body.events,
                            reportFeed: req.body.reportFeed,
                            adminMaster: req.body.adminMaster,
                            genderMaster: req.body.genderMaster,
                            languageMaster: req.body.languageMaster,
                            interestMaster: req.body.interestMaster,
                            setting: req.body.setting,
                            customerManagement: req.body.customerManagement,
                            rewardReport: req.body.rewardReport,
                            staticContentManagement: req.body.staticContentManagement
                        }]
                        new roleModel(req.body).save((err, saveResult) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                res.send({ response_code: 200, response_message: "Role added sucessfully", saveResult })
                            }
                        })
                    }
                })
            }
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :viewRole
     * Description   : viewRole in role management
     *
     * @return response
    */

    viewRole: (req, res) => {
        try {
            roleModel.findOne({ _id: req.body.roleId, status: { $ne: "DELETE" } }, (err, findResult) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!findResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, findResult, SuccessMessage.DETAIL_GET);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :editRole
     * Description   : editRole in role management
     *
     * @return response
    */

    editRole: (req, res) => {
        if (!req.body.roleId) {
            response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
        }
        else {
            roleModel.findOne({ _id: req.body.roleId, status: { $ne: "DELETE" } }, (err, findRes) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!findRes) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    if (req.body.permissionId) {
                        req.body.permissions = [{
                            _id: req.body.permissionId,
                            dashboard: req.body.dashboard,
                            newCustomer: req.body.newCustomer,
                            events: req.body.events,
                            reportFeed: req.body.reportFeed,
                            adminMaster: req.body.adminMaster,
                            genderMaster: req.body.genderMaster,
                            languageMaster: req.body.languageMaster,
                            interestMaster: req.body.interestMaster,
                            setting: req.body.setting,
                            customerManagement: req.body.customerManagement,
                            rewardReport: req.body.rewardReport,
                            staticContentManagement: req.body.staticContentManagement
                        }]
                    }
                    let query = { _id: findRes.id, status: { $ne: "DELETE" } }
                    roleModel.findByIdAndUpdate(query, { $set: req.body }, { new: true }, (updateErr, updateRes) => {
                        if (updateErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, updateRes, SuccessMessage.UPDATE_SUCCESS);
                        }
                    })
                }
            })
        }
    },

    /**
     * Function Name :deleteRole
     * Description   : deleteRole in role management
     *
     * @return response
    */

    deleteRole: (req, res) => {
        try {
            if (!req.body.roleId) {
                response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
            }
            else {
                let query = { _id: req.body.roleId, status: { $ne: "DELETE" } }
                roleModel.findByIdAndUpdate(query, { $set: { status: "DELETE" } }, { new: true }, (err, findResult) => {
                    if (err) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!findResult) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, findResult, SuccessMessage.DELETE_SUCCESS);
                    }
                })
            }
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :roleList
     * Description   : roleList in role management
     *
     * @return response
    */

    roleList: (req, res) => {
        try {
            let query = { status: { $ne: "DELETE" } };

            var options = {
                page: req.body.page || 1,
                limit: req.body.limit || 5,
                sort: { createdAt: -1 }
            };
            roleModel.paginate(query, options, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result.docs.length == false) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                }
            });
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },


}

//------------upload image---------------------------------//
function upload(image) {
    return new Promise((resolve, reject) => {
        commonFunction.uploadImage(image, (error, result) => {
            if (error)
                resolve(false)
            else if (result) {
                resolve(result)
            }
        })
    })
}
function imgUpload(image) {
    return new Promise((resolve, reject) => {
        commonFunction.uploadImage(image, (error, result) => {
            if (error) {
                resolve(error)
            }
            else {
                resolve(result)
            }
        })
    })
}
function favicon(image) {
    return new Promise((resolve, reject) => {
        commonFunction.uploadImage(image, (error, result) => {
            if (error) {
                resolve(error)
            }
            else {
                resolve(result)
            }
        })
    })
}
function findFood(foodCatagroy) {
    return new Promise((resolve, reject) => {
        foodModel.findOne({ _id: foodCatagroy, status: "ACTIVE" }, (error, foodData) => {
            console.log("===============>", error, foodData)
            if (error) {
                resolve(error)
            }
            else {
                resolve(foodData.name)
            }
        })
    })
}

function convertVideo(req) {
    return new Promise((resolve, reject) => {
        commonFunction.multipleVideoUploadCloudinary(req, (videoErr, uploadData) => {
            console.log("i am in video")
            if (videoErr) {
                console.log("error while video Uploading")
            }
            else {
                resolve(uploadData)
            }
        })
    })
}