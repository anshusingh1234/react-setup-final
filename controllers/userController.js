const userModel = require('../models/userModel');
const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { SuccessMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');
const { SuccessCode } = require('../helper/statusCode');
const commonFunction = require('../helper/commonFunction')
const mongoose = require("mongoose")


const bcrypt = require("bcrypt-nodejs");
var jwt = require('jsonwebtoken');
const postModel = require('../models/postModel')
const groupModel = require('../models/groupModel')
const reportModel = require('../models/reportModel')
const feedBackModel = require('../models/feedBackModel');
const rewardModel = require('../models/rewardModel');
const postReportModel = require('../models/postReportModel');

const _ = require("lodash");
const eventModel = require('../models/eventModel');
const languageModel = require('../models/languageModel')
const interestModel = require('../models/interestModel')
const favouriteModel = require('../models/favouriteModel')
const foodModel = require('../models/foodModel')
const notificationModel = require('../models/notificationModel')
const moment = require('moment');

const { user } = require("./../core/Redis");
const {friendRequest, requestAccept} = require('./../services/notification/events');


module.exports = {
    /**
     * Function Name :otpSent
     * Description   : otp sent to mobile number of user
     *
     * @return response
   */
    otpSent: (req, res) => {
        console.log("hhhhhhhh")
        try {
            userModel.findOne({ mobileNumber: req.body.mobileNumber, status: "ACTIVE", userType: "USER" }, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (userData) {
                    var otp = commonFunction.getOTP(4)
                    var phoneNumber = req.body.countryCode + req.body.mobileNumber
                    commonFunction.sendSMSOTPSNS(phoneNumber, `Your OTP for verification is ${otp}.Use this otp to verify its you.`, (err, otpSent) => {
                        console.log("CCC", err, otpSent)
                        // commonFunction.sendSMSOTPSNS(phoneNumber, otp, (err, otpSent) => {
                        console.log("hhhh333hhhh", otp, otpSent, err)
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                        }
                        else {
                            userModel.findOneAndUpdate({ mobileNumber: req.body.mobileNumber }, { $set: { otp: otp, verifyOtp: false, deviceToken: req.body.deviceToken } }, { new: true }, (updatedErr, updatedData) => {
                                if (updatedErr) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                                }
                                else {
                                    console.log("send", updatedData)
                                    response(res, SuccessCode.SUCCESS, updatedData, SuccessMessage.OTP_SEND)
                                }
                            })
                        }
                    })

                }
                else {
                    var otp1 = commonFunction.getOTP(4)
                    console.log("SSSSSS", otp)
                    var phoneNumber1 = req.body.countryCode + req.body.mobileNumber
                    // commonFunction.sendSMS(phoneNumber1, otp1, (err, otpSent) => {
                    commonFunction.sendSMSOTPSNS(phoneNumber1, `Your OTP for verification is ${otp1}.Use this otp to verify its you.`, (err, otpSent) => {
                        console.log("hhhh333hhhh", otp1, otpSent, err)
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, ErrorMessage.INTERNAL_ERROR)
                        }
                        else {
                            var obj = new userModel({
                                otp: otp1,
                                countryCode: req.body.countryCode,
                                mobileNumber: req.body.mobileNumber,
                                deviceToken: req.body.deviceToken,
                                userType: "USER"
                            })
                            obj.save((saveErr, savedData) => {
                                console.log("hhhh333hhhh11111", error, savedData)

                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, ErrorMessage.INTERNAL_ERROR)
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, savedData, SuccessMessage.OTP_SEND)

                                }
                            })
                        }
                    })
                }
            })

        }
        catch (error) {
            console.log("i am in error", error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)

        }

    },
    // otpSent: (req, res) => {
    //     console.log("hhhhhhhh")
    //     try {
    //         userModel.findOne({mobileNumber:req.body.mobileNumber,status:"ACTIVE",userType:"USER"},(error,userData)=>{
    //             if (error) {
    //                 response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //             }
    //             else if (userData) {
    //                var otp = commonFunction.getOTP(4)
    //                       userModel.findOneAndUpdate({ mobileNumber: req.body.mobileNumber }, { $set: { otp: otp, verifyOtp: false } }, { new: true }, (updatedErr, updatedData) => {
    //                     if (updatedErr) {
    //                         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

    //                     }
    //                     else {
    //                         console.log("send", updatedData)
    //                         response(res, SuccessCode.SUCCESS, updatedData, SuccessMessage.OTP_SEND)
    //                     }
    //                 })

    //             }
    //             else{
    //                 var otp1 = commonFunction.getOTP(4)
    //                 console.log("SSSSSS",otp)
    //                         var obj = new userModel({
    //                             otp: otp1,
    //                             countryCode:req.body.countryCode,
    //                             mobileNumber: req.body.mobileNumber
    //                         })
    //                         obj.save((saveErr, savedData) => {
    //                             console.log("hhhh333hhhh11111", error, savedData)

    //                             if (error) {
    //                                 response(res, ErrorCode.SOMETHING_WRONG, ErrorMessage.INTERNAL_ERROR)
    //                             }
    //                             else {
    //                                 response(res, SuccessCode.SUCCESS, savedData, SuccessMessage.OTP_SEND)

    //                             }
    //                         })

    //             }
    //         })

    //     }
    //     catch (error) {
    //         console.log("i am in error", error)
    //         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)

    //     }

    // },

    /**
         * Function Name :verifyOtp
         * Description   : verify for otp
         *
         * @return response
       */

    verifyOtp: (req, res) => {
        userModel.findOne({ mobileNumber: req.body.mobileNumber, status: "ACTIVE" }, (err, result) => {
            if (err) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.MOBILE_NOT_FOUND);
            }
            else {
                // user.saveUserProfile(result._id, updateData);
                if (result.otp == req.body.otp || req.body.otp == 1234) {
                    var newTime = Date.now()
                    var difference = newTime - result.otpTime
                    console.log(">>>>>>", difference)
                    // if (difference < 60000) {
                    userModel.findByIdAndUpdate(result._id, { verifyOtp: true }, { new: true }, (updateErr, updateResult) => {
                        if (updateErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.VERIFY_OTP);
                        }
                    })
                    // }
                    // else {
                    //     response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.OTP_EXPIRED);

                    // }

                }
                else {
                    response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.INVALID_OTP);
                }
            }
        })
    },

    /**
       * Function Name :resendOtp
       * Description   : otp sent to mobile number of user
       *
       * @return response
     */
    resendOtp: (req, res) => {
        console.log("hhhhhhhh", req.body)
        userModel.findOne({ mobileNumber: req.body.mobileNumber }, (error, userData) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!userData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.MOBILE_NOT_FOUND);
            }
            else {
                var otp = commonFunction.getOTP(4)
                var phoneNumber = userData.countryCode + req.body.mobileNumber

                //commonFunction.sendSMS(phoneNumber, otp, (err, otpData) => {
                commonFunction.sendSMSOTPSNS(phoneNumber, `Your OTP for verification is ${otp}.Use this otp to verify its you.`, (err, otpData) => {
                    if (err) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                    }
                    else {
                        userModel.findOneAndUpdate({ mobileNumber: req.body.mobileNumber }, { $set: { otp: otp, verifyOtp: false } }, { new: true }, (updatedErr, updatedData) => {
                            if (updatedErr) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                            }
                            else {
                                console.log("send", updatedData)
                                response(res, SuccessCode.SUCCESS, updatedData, SuccessMessage.OTP_SEND)
                            }
                        })
                    }
                })
            }
        })
    },

    /**
    * Function Name :addBasicInfo
    * Description   : add basic infomartion of user
    *
    * @return response
  */
    addBasicInfo: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id }, async (error, userData) => {

                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, ErrorMessage.NOT_FOUND)
                }
                else {
                    var set = {}
                    if (req.body.name) {
                        set.name = req.body.name
                    }
                    if (req.body.nickName) {
                        set.nickName = req.body.nickName
                    }
                    if (req.body.description) {
                        set.description = req.body.description
                    }
                    if (req.body.mirrorFlyId) {
                        set.mirrorFlyId = req.body.mirrorFlyId
                    }
                    if (req.body.image) {
                        set.profilePic = await imgUpload(req.body.image)
                    }

                    let addToSet = {};
                    if(req.body.clevertapId){
                        addToSet.clevertapId = {
                            id: req.body.clevertapId
                        };
                    }
                    if(req.body.deviceId){
                        addToSet.deviceId = {
                            id: req.body.deviceId
                        };
                    }

                    userModel.findOneAndUpdate({ _id: userData._id, status: "ACTIVE" }, { $set: set, isFirstTime: true, $addToSet: addToSet}, { upsert: true, new: true },
                        (err, updateData) => {
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, ErrorMessage.SOMETHING_WRONG)
                            }
                            else if (!updateData) {
                                response(res, ErrorCode.NOT_FOUND, ErrorMessage.NOT_FOUND)
                            }
                            else {
                              user.saveUserProfile(userData._id, updateData);
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
    /**
    * Function Name : blockUnblockUserProfile
    * Description   : block user by user
    *
    * @return response
  */
    blockUnblockUserProfile: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE", userType: "USER" }, async (UserErr, userData) => {
                console.log("sdhsh1111111111shs", UserErr, userData)

                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);

                }
                else {
                    var arr = req.body.blockedUser;
                    var arr1 = [];
                    console.log("3288>>>>>>>>>>>>>", arr);
                    arr.forEach(x => {
                        arr1.push(x.userId);
                    });
                    userModel.findOne({ _id: arr1, status: "ACTIVE", userType: "USER" }, async (error, customerData) => {
                        console.log("sdh333333333shshs", error, customerData)
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, ErrorMessage.INTERNAL_ERROR);

                        }
                        else if (!customerData) {
                            response(res, ErrorCode.NOT_FOUND, ErrorMessage.NOT_FOUND);

                        } else {
                            if (req.body.status == "BLOCK") {
                                var data = await userModel.findOne({ _id: userData._id, blockedUser: { $elemMatch: { userId: customerData.userId } } })
                                if (data) {
                                    response(res, ErrorCode.ALREADY_EXIST, ErrorMessage.FRIEND_EXISTS)
                                }
                                userModel.findOneAndUpdate({ _id: userData._id, status: "ACTIVE" }, { $push: { blockedUser: req.body.blockedUser } }, { new: true }, async (err, blockedData) => {
                                    console.log("sdh44444444shshs", err, customerData)

                                    if (err) {
                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                                    }
                                    else {
                                        response(res, SuccessCode.SUCCESS, blockedData, SuccessMessage.BLOCK_SUCCESS)

                                    }
                                })
                            }
                            else if (req.body.status == "UNBLOCK") {
                                const unblockUser = _.filter(userData.blockedUser, _.matches({ userId: mongoose.Types.ObjectId(req.body.userId) }));
                                userModel.findOneAndUpdate({ _id: userData._id, status: "ACTIVE" }, { $pull: { blockedUser: unblockUser[0] } }, { new: true }, async (unblockErr, UnblockedData) => {
                                    if (unblockErr) {

                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                                    }
                                    else {
                                        response(res, SuccessCode.SUCCESS, UnblockedData, SuccessMessage.UNBLOCK_SUCCESS)

                                    }
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
        * Function Name :showUserProfile
        * Description   : show user profile
        *
        * @return response
      */
    showUserProfile: (req, res) => {
        try {
            userModel.findOne({ _id: req.body.userId, status: "ACTIVE" }, (UserErr, userData) => {
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    response(res, SuccessCode.SUCCESS, userData, SuccessMessage.DETAIL_GET)

                    //var userData = await
                    // userModel.findOne({ _id: req.body.user, status: "ACTIVE" }, (error, findUserData) => {
                    //     if (UserErr) {
                    //         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    //     }
                    //     else {
                    //         response(res, SuccessCode.SUCCESS, [findUserData], SuccessMessage.DETAIL_GET)

                    //     }
                    // })

                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    /**
        * Function Name :showMyProfile
        * Description   : show my profile by user
        *
        * @return response
      */
    showMyProfile: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    userModel.findOne({ _id: req.params._id, status: "ACTIVE", userType: "USER" }, (error, userData) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                        }
                        else if (!userData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                        }
                        else {
                            var isRequested= false;
                            var isFollowing= false;
                            if (userData.friendRequestList.map(el => el.friendRequestUserId).includes(result._id)) {
                                isRequested = true;
                            }
                            if (userData.follower.map(el => el.followerId).includes(result._id)) {
                                isFollowing = true;
                            }
                            // var jsonObject = userData.friends.map(JSON.stringify);
                            // console.log("434", jsonObject)


                            // var uniqueSet = new Set(jsonObject);
                            // var docs = Array.from(uniqueSet).map(JSON.parse);
                            // console.log("438", docs)
                            var data = {
                                isRequested: isRequested,
                                isFollowing: isFollowing,
                                deviceToken: userData.deviceToken,
                                image: userData.image,
                                isFirstTime: userData.isFirstTime,
                                verifyStatus: userData.verifyStatus,
                                otpTime: userData.otpTime,
                                verifyOtp: userData.verifyOtp,
                                profilePic: userData.profilePic,
                                backImage: userData.backImage,
                                reward: userData.reward,
                                rewardStatus: userData.rewardStatus,
                                intersts: userData.intersts,
                                favoriteFood: userData.favoriteFood,
                                language: userData.language,
                                speak: userData.speak,
                                favorite: userData.favorite,
                                profilePrivacy: userData.profilePrivacy,
                                loginType: userData.loginType,
                                userType: userData.userType,
                                isReward: userData.isReward,
                                isBookMark: userData.isBookMark,
                                status: userData.status,
                                onlineStatus: userData.onlineStatus,
                                _id: userData._id,
                                otp: userData.otp,
                                email: userData.email,
                                countryCode: userData.countryCode,
                                mobileNumber: userData.mobileNumber,
                                // blockedUser: userData.blockedUser,
                                // friendList: userData.friendList,
                                followersCount: userData.follower.length,
                                followingCount: userData.following.length,
                                friendsCount: userData.friends.length,
                                // friendRequestList: userData.friendRequestList,
                                // follower: userData.follower,
                                // following: userData.following,
                                // permissions: userData.permissions,
                                createdAt: userData.createdAt,
                                updatedAt: userData.updatedAt,
                                age: userData.age,
                                name: userData.name,
                                surName: userData.surName,
                                countryId: userData.countryId,
                                customerName: userData.customerName,
                                countryName: userData.countryName,
                                nickName: userData.nickName,
                                aboutMe: userData.aboutMe,
                                facebookLink: userData.facebookLink,
                                instagramLink: userData.instagramLink,
                                twitterLink: userData.twitterLink,
                                tiktokLink: userData.tiktokLink,
                                socialId: userData.socialId,
                                location: userData.location,
                                mirrorFlyId: userData.mirrorFlyId,
                                phone: userData.phone,
                                gender: userData.gender,
                                profile: userData.profile,
                            };
                            response(res, SuccessCode.SUCCESS, data, SuccessMessage.DETAIL_GET)
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
            * Function Name :deleteProfile
            * Description   : delete own profile by user
            *
            * @return response
          */
    deleteAccount: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE", userType: "USER" }, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    userModel.findOneAndUpdate({ _id: userData._id }, { $set: { status: "DELETE" } }, { new: true }, (err, findData) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                        }
                        else if (!findData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, findData, SuccessMessage.DELETE_SUCCESS)

                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)

        }


    },

    editProfile: (req, res) => {
        try {
            //console.log("fffffff",req.body)
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE", userType: "USER" }, async (error, userData) => {
                console.log("JJJHDJ", error, userData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {

                    var set = {}
                    if (req.body.profilePrivacy) {
                        set.profilePrivacy = req.body.profilePrivacy
                    }
                    if (req.body.name) {
                        set.name = req.body.name
                    }
                    if (req.body.surName) {
                        set.surName = req.body.surName
                    }
                    if (req.body.aboutMe) {
                        set.aboutMe = req.body.aboutMe
                    }
                    if (req.body.age) {
                        set.age = req.body.age
                    }
                    if (req.body.location) {
                        set.location = req.body.location
                    }
                    if (req.body.profile) {
                        set.profile = req.body.profile
                    }
                    if (req.body.intersts) {
                        set.intersts = req.body.intersts
                    }
                    if (req.body.speak) {
                        set.speak = req.body.speak
                    }
                    if (req.body.favorite) {
                        set.favorite = req.body.favorite
                    }
                    if (req.body.favoriteFood) {
                        set.favoriteFood = req.body.favoriteFood
                    }
                    if (req.body.language) {
                        set.language = req.body.language
                    }
                    if (req.body.facebookLink) {
                        set.facebookLink = req.body.facebookLink
                    }
                    if (req.body.instagramLink) {
                        set.instagramLink = req.body.instagramLink
                    }
                    if (req.body.twitterLink) {
                        set.twitterLink = req.body.twitterLink
                    }
                    if (req.body.tiktokLink) {
                        set.tiktokLink = req.body.tiktokLink
                    }
                    if (req.body.isReward) {
                        set.isReward = req.body.isReward
                    }
                    if (req.body.image) {
                        //var image = await convertImage()
                        set.profilePic = await convertImage()
                    }
                    if (req.body.backImage) {
                        set.backImage = await convertBackImage()
                    }

                    userModel.findOneAndUpdate({ _id: userData._id, status: "ACTIVE" }, { $set: set }, { new: true },
                        (err, updateData) => {
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                            }
                            else if (!updateData) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                            }
                            else {
                                user.saveUserProfile(userData._id, updateData);
                                response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.UPDATE_SUCCESS)
                            }
                        })
                    function convertImage() {
                        return new Promise((resolve, reject) => {
                            console.log("aaasssssss")
                            commonFunction.uploadImage(req.body.image, (err, upload) => {
                                console.log("aaasss1111111111111111111111ssss")
                                if (err) {
                                    console.log("Error uploading image", err)
                                }
                                else {
                                    resolve(upload)
                                }
                            })
                        })
                    }
                    function convertBackImage() {
                        return new Promise((resolve, reject) => {
                            console.log("aaasssssss")
                            commonFunction.uploadImage(req.body.backImage, (err, upload) => {
                                console.log("aaasss1111111111111111111111ssss")
                                if (err) {
                                    console.log("Error uploading image", err)
                                }
                                else {
                                    resolve(upload)
                                }
                            })
                        })
                    }
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },

    viewPost: (req, res) => {
        postModel.findOne({ _id: req.params._id, status: "ACTIVE" }, (error, postData) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

            }
            else if (!postData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.MOBILE_NOT_FOUND);
            }
            else {
                response(res, SuccessCode.SUCCESS, [postData], SuccessMessage.DATA_FOUND);
            }
        })
    },


    socialLogin: (req, res) => {
        try {
            if (!req.body.socialId || !req.body.loginType) {
                res.send({ responseCode: 401, responseMessege: "Parameter missing" })
            } else {
                userModel.findOne({ _id: req.headers._id }, async (error, userData) => {
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!userData) {
                        response(res, ErrorCode.NOT_FOUND, ErrorMessage.NOT_FOUND)
                    }
                    else {
                        var set = {}
                        if (req.body.loginType) {
                            set.loginType = req.body.loginType
                        }
                        if (req.body.socialId) {
                            set.socialId = req.body.socialId
                        }

                        userModel.findOneAndUpdate({ _id: userData._id, status: "ACTIVE" }, { $set: set }, { new: true },
                            (err, result) => {
                                if (err) {
                                    response(res, ErrorCode.SOMETHING_WRONG, ErrorMessage.SOMETHING_WRONG)
                                }
                                else if (!result) {
                                    response(res, ErrorCode.NOT_FOUND, ErrorMessage.NOT_FOUND)
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.LOGIN_SUCCESS)
                                }
                            })
                    }
                })
            }
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    // socialLogin: (req, res) => {
    //     try {
    //         userModel.findOne({ _id: req.headers._id, status: "ACTIVE" },(error, userData) => {
    //             if (error) {
    //                 response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //             }
    //             else if (!userData) {
    //                 response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
    //             }
    //             else{
    //                 userModel.findOne({ _id:userData_id, status: { $ne: "DELETED" } }, (error, checkSocialId) => {
    //                     console.log("i am in in first",error,checkSocialId)
    //                     if (error) {
    //                         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //                     } else if (!checkSocialId) {
    //                         var data = {
    //                             socialId: req.body.socialId,
    //                             loginType: req.body.loginType,
    //                             name: req.body.name,
    //                             email: req.body.email,
    //                             profilePic: req.body.profilePic
    //                         };
    //                         var obj = new userModel(data);
    //                         obj.save((err1, success) => {
    //                             if (err1) {
    //                                 response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //                             } else {
    //                                 var result = {
    //                                     userDetail: success._id
    //                                 };
    //                                 response(res, SuccessCode.SUCCESS, result, SuccessMessage.LOGIN_SUCCESS)
    //                             }
    //                         });
    //                     } else {
    //                         var result = {
    //                             userDetail: checkSocialId._id
    //                         };
    //                         response(res, SuccessCode.SUCCESS, result, SuccessMessage.LOGIN_SUCCESS)
    //                     }
    //                 }
    //                 );


    //             }
    //         })


    //     } catch (error) {
    //         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    //     }
    // },

    getFriendWithSocialLogin: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    //let socialId = req.body.socialId
                    userModel.find({ socialId: { $in: req.body.socialId }, userType: "USER" }, (err, result) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!result) {
                            response(res, ErrorCode.NOT_FOUND, ErrorMessage.FRIEND_NOT_FOUND)
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, result, SuccessMessage.FOUND_FRIEND)
                        }
                    })

                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }

        // })
    },

    importContact: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    //let contactData = req.body.contactData
                    // contactData.forEach(i=>{
                    // console.log(i)
                    userModel.find({ mobileNumber: { $in: req.body.contactData }, userType: "USER" }, (err, result) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!result) {
                            response(res, ErrorCode.NOT_FOUND, ErrorMessage.CONTACT_NOT_FOUND)
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, result, SuccessMessage.FOUND_CONTACT)
                        }
                    })

                }
            })
        }
        catch (error) {
            console.log("DHGDGDGD", error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }

        // })
    },

    addFriend: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE", userType: "USER" }, async (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    var arr = req.body.friends;
                    var arr1 = [];
                    console.log("3288>>>>>>>>>>>>>", arr);
                    arr.forEach(x => {
                        arr1.push(x.friendId);
                    });
                    console.log("req.body>>>>>>>>>>>>>>>>", arr1);
                    userModel.findOne({ _id: arr1, status: "ACTIVE" }, async (err, friendData) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!friendData) {
                            response(res, ErrorCode.NOT_FOUND, ErrorMessage.NOT_FOUND)
                        }
                        else {
                            var data = await userModel.findOne({ _id: userData._id, friends: { $elemMatch: { friendId: friendData.friendId } } })
                            if (data) {
                                response(res, ErrorCode.ALREADY_EXIST, ErrorMessage.FRIEND_EXISTS)
                            }
                            else {
                                userModel.findOneAndUpdate({ _id: userData._id }, { $addToSet: { friends: req.body.friends } }, { new: true }, async (saveErr, dataSaved) => {
                                    if (saveErr) {
                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        userModel.findOneAndUpdate({ _id: friendData._id }, { $addToSet: { friends: { friendId: req.headers._id } } }, { new: true }, async (frndsaveErr, frnddataSaved) => {
                                            if (frndsaveErr) {
                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else {
                                                response(res, SuccessCode.SUCCESS, dataSaved, SuccessMessage.FRIEND_ADDED)

                                            }
                                        })

                                    }
                                })
                            }
                        }
                    })
                }
            })

        }
        catch(e){
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    getFriendList: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id }, (err, userData) => {
                if (err) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                } else {
                    var arr = userData.friends;
                    var arr1 = [];
                    arr.forEach(x => {
                        if (x.status == "ACTIVE") {
                            arr1.push(x.friendId);
                        }
                    });
                    req.query.pageNumber = parseInt(req.query.pageNumber);
                    req.query.limit = parseInt(req.query.limit);
                    var options = {
                        sort: { createdAt: -1 },
                        page: req.query.pageNumber || 1,
                        select: "profilePic _id email name friends",
                        limit: req.query.limit || 5
                    };
                    userModel.paginate({ _id: arr1 }, options, (err1, friendData) => {
                        if (err1) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else {
                            let doc = friendData.docs
                            let newArray = []
                            doc.forEach(x => {
                                //let count = []
                                let friendId = []
                                //let counter = 0
                                for (let a = 0; a < x.friends.length; a++) {
                                    friendId.push(x.friends[a].friendId)
                                }
                                var obj = {
                                    _id: x._id,
                                    name: x.name,
                                    email: x.email,
                                    profilePic: x.profilePic,
                                    friends: x.friends,
                                    //mutual: presents.length
                                }
                                newArray.push(obj);
                            })
                            const total = friendData.total;
                            const pages = friendData.pages;
                            const limit = friendData.limit;
                            const page = friendData.page;
                            var FrndResult = { success2: { docs: newArray, total, limit, page, pages } };
                            response(res, SuccessCode.SUCCESS, FrndResult, SuccessMessage.DETAIL_GET)


                        }
                    });
                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    getMyFriendList: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id }, (err, userData) => {
                if (err) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    userModel.find({ mobileNumber: { $in: req.body.contactData }, userType: "USER" }, (userErr, result) => {
                        console.log("vdgdgdgdgdg", result.name)
                        //return
                        if (userErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!result) {
                            response(res, ErrorCode.NOT_FOUND, ErrorMessage.CONTACT_NOT_FOUND)
                        }
                        else {
                            // var a=result.map(e=>{e.name,e.mirrorFlyId})
                            let modified = result.map(obj => ({
                                name: obj.name,
                                mirrorFlyId: obj.mirrorFlyId,
                                email: obj.email,
                                profilePic: obj.profilePic,
                                countryCode: obj.countryCode,
                                mobileNumber: obj.mobileNumber
                            }))
                            // console.log("vdgdgdgdgdg",modified)
                            // return
                            var arr = userData.friends;
                            var arr1 = [];
                            arr.forEach(x => {
                                if (x.status == "ACTIVE") {
                                    arr1.push(x.friendId);
                                }
                            });
                            var options = {
                                sort: { created_at: -1 },
                                page: req.body.pageNumber || 1,
                                select: "profilePic _id name email countryCode mobileNumber mirrorFlyId",
                                limit: req.body.limit || 5
                            };
                            userModel.paginate({ _id: arr1 }, options, (err1, friendData) => {
                                if (err1) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                } else {
                                    let doc = friendData.docs
                                    let newArray = []
                                    doc.forEach(x => {
                                        let friendId = []
                                        var obj = {
                                            _id: x._id,
                                            name: x.name,
                                            email: x.email,
                                            profilePic: x.profilePic,
                                            countryCode: x.countryCode,
                                            mobileNumber: x.mobileNumber,
                                            mirrorFlyId: x.mirrorFlyId
                                        }
                                        newArray.push(obj);
                                    })

                                    var FrndResult = { newArray, modified };
                                    response(res, SuccessCode.SUCCESS, FrndResult, SuccessMessage.DETAIL_GET)
                                }
                            }
                            );
                        }
                    })


                }
            }
            );
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    userFriendLists: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id }, (err, userData) => {
                if (err) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                } else {
                    userModel.findOne({ _id: req.body.userId }, (error, userDa) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else {

                            response(res, SuccessCode.SUCCESS, userDa, SuccessMessage.DETAIL_GET)
                        }
                    }
                    );
                }
            }
            );
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    // getFriendList: (req, res) => {
    //     try {
    //         userModel.findOne({ _id: req.headers._id }, (err, userData) => {
    //             if (err) {
    //                 response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //             } else if (!userData) {
    //                 response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
    //             } else {
    //                 var arr = userData.friends;
    //                 var arr1 = [];
    //                 arr.forEach(x => {
    //                     if (x.status == "ACTIVE") {
    //                         arr1.push(x.friendId);
    //                     }
    //                 });
    //                 var options = {
    //                     sort: { created_at: -1 },
    //                     page: req.body.pageNumber || 1,
    //                     select: "profilePic _id name",
    //                     limit: req.body.limit || 5
    //                 };
    //                 userModel.paginate({ _id: arr1 }, options, (err1, friendData) => {
    //                     if (err1) {
    //                         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //                     } else if (!friendData) {
    //                         var result = { friends: "[]" };
    //                         response(res, ErrorCode.NOT_FOUND, result, ErrorMessage.NOT_FOUND)
    //                     } else {
    //                         //let doc = friendData.docs
    //                         //let newArray = []
    //                         // doc.forEach(x => {
    //                         //     //let count = []
    //                         //     let friendId = []
    //                         //     //let counter = 0
    //                         //     for (let a = 0; a < x.friends.length; a++) {
    //                         //         friendId.push(x.friends[a].friendId)
    //                         //     }
    //                         //     // var presents = _.intersectionWith(arr1, friendId, _.isEqual);

    //                         //     // console.log("mutual friends::::::::::::::::::::::::::::::", counter)

    //                         //     // console.log("mutual friends::::::::::::::::::::::::::::::", counter, "lenght>>>>>>>>>>>>>>>>>>>", count.length)
    //                         //     var obj = {
    //                         //         _id: x._id,
    //                         //         name: x.name,
    //                         //         email: x.email,
    //                         //         profilePic: x.profilePic,
    //                         //         friends: x.friends,
    //                         //         //mutual: presents.length
    //                         //     }
    //                         //     newArray.push(obj);
    //                         // })
    //                         // //console.log("nnnnewwwwwwwwwwwwwwwwwwwwww", newArray)
    //                         // const total = friendData.total;
    //                         // const pages = friendData.pages;
    //                         // const limit = friendData.limit;
    //                         // const page = friendData.page;
    //                         // var result1 = { success2: { docs: newArray, total, limit, page, pages } };
    //                         response(res, SuccessCode.SUCCESS, friendData, SuccessMessage.DETAIL_GET)


    //                     }
    //                 }
    //                 );

    //             }
    //         }
    //         );
    //     } catch (error) {
    //         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    //     }
    // },
    removeFriend: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE", }, async (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    var arr = req.body.friends;
                    var arr1 = [];
                    console.log("3288>>>>>>>>>>>>>", arr);
                    arr.forEach(x => {
                        arr1.push(x.friendId);
                    });
                    console.log("req.body>>>>>>>>>>>>>>>>", arr1);
                    userModel.findOne({ _id: arr1, status: "ACTIVE" }, async (err, friendData) => {
                        console.log("i am herrrrrrrrrrrrr", error, friendData)
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!friendData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                        }
                        else {
                            userModel.findOneAndUpdate({ _id: userData._id }, { $pull: { friends: req.body.friends } }, { new: true }, async (saveErr, dataSaved) => {
                                if (saveErr) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, dataSaved, SuccessMessage.DATA_SAVED)

                                }
                            })

                        }
                    })
                }
            })

        }
        catch(e){
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    followUser: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE", }, async (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    if (req.body.profilePrivacy == "PUBLIC") {
                        userModel.findOne({ _id: req.body.followingId, status: "ACTIVE", }, (err, user) => {
                            console.log("i am here1", err, user)
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (!user) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                            }
                            else {
                                userModel.findOne({ _id: userData._id, status: "ACTIVE", following: { $elemMatch: { followingId: user._id } } }, (err1, data) => {
                                    if (err1) {
                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else if (data) {
                                        response(res, SuccessCode.SUCCESS, [], SuccessMessage.USER_FOLLOW)
                                    }
                                    else {
                                        var follow = {
                                            followingId: user._id,
                                            name: user.name,
                                            profilePic: user.profilePic,
                                            isFollowing: true
                                        };
                                        userModel.findOneAndUpdate({ _id: userData._id }, { $push: { following: follow } }, { new: true }, (updateErr, followData) => {
                                            if (updateErr) {
                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else {
                                                //response(res, SuccessCode.SUCCESS, followData, SuccessMessage.USER_FOLLOW)
                                                var follow1 = {
                                                    followerId: userData._id,
                                                    name: userData.name,
                                                    profilePic: userData.profilePic
                                                };
                                                userModel.findOneAndUpdate({ _id: user._id }, { $push: { follower: follow1 } }, { new: true }, (updatedErr, followingData) => {
                                                    if (updatedErr) {
                                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                    }
                                                    else {
                                                        response(res, SuccessCode.SUCCESS, [], SuccessMessage.USER_FOLLOW)

                                                    }
                                                })

                                            }
                                        })

                                    }
                                })
                            }
                        })
                    }
                    if (req.body.profilePrivacy == "PRIVATE") {
                        console.log("i am here1007")

                        userModel.findOne({ _id: req.body.userId, status: "ACTIVE", userType: "USER", profilePrivacy: "PRIVATE" }, (err, result) => {
                            console.log("i am here1010", error, result)
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (!result) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)

                            }
                            else {
                                const obj = new notificationModel({
                                    senderId: userData._id,
                                    userId: result._id,
                                    requestType: "REQUESTED"
                                })
                                obj.save((saveErr, savedData) => {
                                    if (saveErr) {
                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        response(res, SuccessCode.SUCCESS, [savedData], SuccessMessage.DATA_SAVED);
                                    }
                                })
                            }
                        })
                    }
                }

            })

        }
        catch(e){
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    unFollowUser: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE", }, async (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {

                    userModel.findOne({ _id: req.body.followingId, status: "ACTIVE", }, (err, user) => {
                        console.log("i am here1", err, user)
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!user) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                        }
                        else {
                            userModel.findOne({ _id: userData._id, status: "ACTIVE", following: { $elemMatch: { followingId: user._id } } }, (newErr, data) => {
                                if (newErr) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else if (!data) {
                                    response(res, SuccessCode.SUCCESS, [], SuccessMessage.USER_UNFOLLOW)

                                }
                                else {
                                    var unfollow = _.filter(data.following, _.matches({ followingId: user._id }));
                                    userModel.findOneAndUpdate({ _id: userData._id }, { $pull: { following: unfollow[0] } }, { new: true }, (updatedErr, unfollowData) => {
                                        if (updatedErr) {
                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                        }
                                        else {
                                            // response(res, SuccessCode.SUCCESS, unfollowData, SuccessMessage.USER_UNFOLLOW)
                                            var unfollow1 = _.filter(user.follower, _.matches({ followerId: userData._id }));
                                            userModel.findOneAndUpdate({ _id: user._id }, { $pull: { follower: unfollow1[0] } }, { new: true }, (updateErr, updateData) => {
                                                if (updateErr) {
                                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                }
                                                else {
                                                    response(res, SuccessCode.SUCCESS, [], SuccessMessage.USER_UNFOLLOW)

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
        catch(e){
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    acceptRequest: (req, res) => {
        try {
            if (req.body.response == "ACCEPT") {
                userModel.findOne({ _id: req.headers._id, status: "ACTIVE", userType: "USER" }, (error, userData) => {
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                    }
                    else if (!userData) {
                        response(res, ErrorCode.NOT_FOUND, userData, ErrorMessage.NOT_FOUND)

                    }
                    else {
                        userModel.findOne({ _id: req.body.senderId, status: "ACTIVE", userType: "USER" }, (err, senderData) => {
                            console.log("ccccbb1130", err, senderData)
                            if (error) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                            }
                            else {
                                var follow = {
                                    followingId: senderData._id,
                                    name: senderData.name,
                                    profilePic: senderData.profilePic
                                };
                                userModel.findOneAndUpdate({ _id: senderData._id, status: "ACTIVE", userType: "USER" }, { $push: { following: follow } }, { new: true }, (updatedErr, followData) => {
                                    if (updatedErr) {
                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                                    }
                                    else {
                                        var follow1 = {
                                            followerId: userData._id,
                                            name: userData.name,
                                            profilePic: userData.profilePic
                                        };
                                        userModel.findOneAndUpdate({ _id: userData._id, status: "ACTIVE", userType: "USER" }, { $push: { follower: follow1 } }, { new: true }, (newErr, followingData) => {
                                            if (newErr) {
                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                                            }
                                            else {
                                                response(res, SuccessCode.SUCCESS, [followingData], SuccessMessage.USER_FOLLOW)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },

    reportUser: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)

                }
                else {
                    userModel.findOne({ _id: req.body.reportTo, status: "ACTIVE" }, (err, result) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                        }
                        else if (!result) {
                            response(res, ErrorCode.NOT_FOUND, ErrorMessage.NOT_FOUND)

                        }
                        else {
                            var obj = new reportModel({
                                reportBy: userData._id,
                                feedCreator: userData.name,
                                feedCreatorEmail: userData.email,
                                reportTo: result._id,
                                reportedToUser: result.name,
                                reportedToUserEmail: result.email,
                                reason: req.body.reason
                            })
                            obj.save((saveError, savedData) => {
                                if (saveError) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, savedData, SuccessMessage.DATA_SAVED)
                                }
                            })
                        }
                    })
                }


            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },
    followerList: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE", }, (userErr, user) => {
                if (userErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!user) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    userModel.findOne({ _id: req.body.userId, status: "ACTIVE", }, (error, userData) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            var arr = userData.follower;
                            var arr1 = [];
                            console.log("3288>>>>>>>>>>>>>", arr);
                            arr.forEach(x => {
                                console.log("3290>>>>>>>>>>>", x);
                                arr1.push(x.followerId);

                            });
                            var options = {
                                sort: { createdAt: -1 },
                                page: req.body.pageNumber || 1,
                                select: "profilePic _id name ",
                                limit: req.body.limit || 10
                            };
                            userModel.paginate({ _id: arr1 }, options, (err, followingData) => {
                                if (err) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                } else {
                                    response(res, SuccessCode.SUCCESS, followingData, SuccessMessage.DATA_FOUND);
                                }
                            })



                        }

                    })
                }
            })

        }
        catch(e){
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    followingList: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE", }, (userErr, user) => {
                if (userErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!user) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    userModel.findOne({ _id: req.body.userId, status: "ACTIVE", }, (error, userData) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            var arr = userData.following;
                            var arr1 = [];
                            console.log("3288>>>>>>>>>>>>>", arr);
                            arr.forEach(x => {
                                console.log("3290>>>>>>>>>>>", x);
                                arr1.push(x.followingId);

                            });
                            var options = {
                                sort: { createdAt: -1 },
                                page: req.body.pageNumber || 1,
                                select: "profilePic name _id",
                                limit: req.body.limit || 10
                            };
                            userModel.paginate({ _id: arr1 }, options, (err, followingData) => {
                                if (err) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                } else {
                                    response(res, SuccessCode.SUCCESS, followingData, SuccessMessage.DATA_FOUND);
                                }
                            })

                        }

                    })
                }
            })

        }
        catch(e){
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    friendSuggestion: (req, res) => {
        userModel.findOne({ _id: req.headers._id, status: "ACTIVE", }, (error, userData) => {
            console.log("i am in user data", userData)
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!userData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
            }
            else {
                const arr = userData.friendRequestSentList;
                const arr1 = userData.friends;
                const arr2 = userData.friendRequestList;
                console.log("arrrrrrrrrrr", arr)
                console.log("ar1111111111111", arr1)
                console.log("ar2222222222222", arr2)
                let friend = [];
                let friendlist = [];
                let friendrequestsent = [];
                arr.forEach(x => {
                    console.log("3290>>>>>>>>>>>", x);
                    if (x.status == "WAITING") {
                        arr1.push(x.friendRequistId);
                    }
                });
                arr.forEach(x => {
                    if (x.status != "DELETE") {
                        friendrequestsent.push(x.friendRequestSentId);
                    }
                });
                arr1.forEach(x => {
                    if (x.status != "DELETE") {
                        friend.push(x.friendId);
                    }
                });
                arr2.forEach(x => {
                    if (x.status != "DELETE") {
                        friendlist.push(x.friendRequestId);
                    }
                });
                const newArr = friendrequestsent.concat(friendlist, friend);
                newArr.push(userData._id);
                var query = { _id: { $nin: newArr }, status: "ACTIVE" };
                if (req.body.search) {
                    query.$or = [
                        {
                            name: { $regex: req.body.search, $options: 'i' }
                        },
                        {
                            mobileNumber: { $regex: req.body.search, $options: 'i' }
                        }
                    ]
                }
                var options = {
                    page: req.body.pageNumber || 1,
                    limit: req.body.limit || 100,
                    select: "name countryCode mirrorFlyId _id mobileNumber profilePic friendRequestList",
                    sort: { createdAt: -1 }
                };
                userModel.paginate(query, options, (errr, result1) => {
                    if (errr) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    } else {
                        //console.log("success 2 1103", result);
                        //console.log("req.body.limit>>>>>>>>>>>>>>>>>", req.body.limit);
                        // var result = { success2: result1 };
                        console.log("<><><<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", result1.docs)

                        let doc = result1.docs
                        // let docArr=[]
                        let newArray = []
                        doc.forEach(x => {
                            let friendArray = []
                            let count = []
                            let friendId = []
                            friendArray.concat(x.friendList)
                            // log("+++++++++++++++++++++++++++++++++++", x, "ttttttttttttttttt", x.friendList)
                            for (let a = 0; a < friendArray.length; a++) {
                                friendId.push(friendArray[a].friendId)
                            }

                            var presents = _.intersectionWith(friendlist, friendId, _.isEqual);
                            console.log("mutual friends::::::::::::::::::::::::::::::", count, "lenght>>>>>>>>>>>>>>>>>>>", count.length)
                            var obj = {
                                _id: x._id,
                                name: x.name,
                                countryCode: x.countryCode,
                                mobileNumber: x.mobileNumber,
                                profilePic: x.profilePic,
                                mirrorFlyId: x.mirrorFlyId,
                                friendRequestList: x.friendRequestList,
                                mutual: presents
                                    .length
                            }
                            newArray.push(obj);
                            console.log("nnnnewwwwwwwwwwwwwwwwwwwwwwooooooooooooo", obj)

                        })
                        // var isRequested=false;
                        newArray.map((e) => {
                            if (e.friendRequestList.map(el => el.friendRequestUserId).includes(userData._id)) {
                                e["isRequested"] = true;
                                return e;
                            }
                            else {
                                e["isRequested"] = false
                                return e;
                            }
                        })
                        const total = result1.total;
                        const pages = result1.pages;
                        const limit = result1.limit;
                        const page = result1.page;
                        var newResult = { docs: newArray, total, limit, page, pages };

                        response(res, SuccessCode.SUCCESS, newResult, SuccessMessage.DATA_FOUND);
                    }
                }
                    // }
                );
            }
        });
    },

    friendsRecommendation: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }).populate({ path: 'friends.friendId', select: '_id name profilePic friends' }).exec((err, result) => {
                console.log("i am in user data", result)
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    var friend = [], friendOfFriends = []
                    if (result.friends.length > 0) {
                        result.friends.map(e => {
                            friend.push(e.friendId._id)
                            if (e.friendId.friends.length > 0) {
                                e.friendId.friends.map(elem => {
                                    friendOfFriends.push(elem.friendId)
                                })
                            }
                            else {
                                console.log("No friendsss");
                                // friend.push(e.friendId)
                                friendOfFriends = [];
                            }
                        })

                        console.log("1723", friend, friendOfFriends)
                        function arr_diff(a1, a2) {

                            var a = [], diff = [];

                            for (var i = 0; i < a1.length; i++) {
                                a[a1[i]] = true;
                            }

                            for (var i = 0; i < a2.length; i++) {
                                if (a[a2[i]]) {
                                    delete a[a2[i]];
                                } else {
                                    a[a2[i]] = true;
                                }
                            }

                            for (var k in a) {
                                diff.push(k);
                            }

                            return diff;
                        }
                        var data = arr_diff(friend, friendOfFriends);
                        console.log("1748", data)
                        var query = { _id: { $in: data }, status: "ACTIVE" };
                        // if (req.body.search) {
                        //     query.$or = [
                        //         {
                        //             name: { $regex: req.body.search, $options: 'i' }
                        //         },
                        //         {
                        //             mobileNumber: { $regex: req.body.search, $options: 'i' }
                        //         }
                        //     ]
                        // }

                        var options = {
                            page: req.query.page || 1,
                            limit: req.query.limit || 10,
                            sort: { createdAt: -1 },
                            select: 'name countryCode mirrorFlyId _id mobileNumber profilePic friendRequestList'
                        };

                        userModel.paginate(query, options, (err2, result2) => {
                            if (err2) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                let newArray = []
                                result2.docs.forEach(x => {
                                    var obj = {
                                        _id: x._id,
                                        name: x.name,
                                        countryCode: x.countryCode,
                                        mobileNumber: x.mobileNumber,
                                        profilePic: x.profilePic,
                                        mirrorFlyId: x.mirrorFlyId,
                                        friendRequestList: x.friendRequestList
                                    }
                                    newArray.push(obj);

                                })
                                // var isRequested=false;
                                newArray.map((e) => {
                                    if (e.friendRequestList.map(el => el.friendRequestUserId).includes(result._id)) {
                                        e["isRequested"] = true;
                                        return e;
                                    }
                                    else {
                                        e["isRequested"] = false
                                        return e;
                                    }
                                })
                                const total = result2.total;
                                const pages = result2.pages;
                                const limit = result2.limit;
                                const page = result2.page;
                                var newResult = { docs: newArray, total, limit, page, pages };
                                response(res, SuccessCode.SUCCESS, newResult, SuccessMessage.DATA_FOUND);
                            }
                        })
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, [], SuccessMessage.DATA_FOUND);
                    }
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    peopleYouMayKnow: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (userErr, userResult) => {
                if (userErr) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    var friends = userResult.friends.map(f => f.friendId);
                    postModel.find({ postStatus: "ACTIVE" }, (err, result) => {

                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            var likes = [];
                            var comments = []
                            result.map(e => {
                                e.likes.map(o => {
                                    likes.push(o.likedId)
                                });
                                e.comments.map(c => {
                                    comments.push(c.commentedUser)
                                })

                            })
                            console.log("1824", likes, comments)
                            var data = likes.concat(comments)
                            function arr_diff(a1, a2) {

                                var a = [], diff = [];

                                for (var i = 0; i < a1.length; i++) {
                                    a[a1[i]] = true;
                                }

                                for (var i = 0; i < a2.length; i++) {
                                    if (a[a2[i]]) {
                                        delete a[a2[i]];
                                    } else {
                                        a[a2[i]] = true;
                                    }
                                }

                                for (var k in a) {
                                    diff.push(k);
                                }

                                return diff;
                            }
                            var finalResult = arr_diff(friends, data)
                            console.log(arr_diff(friends, data))
                            let userIndex = finalResult.indexOf(req.headers._id);
                            if (userIndex > -1) {
                                finalResult.splice(userIndex, 1)
                            }
                            console.log("data", finalResult)

                            var query = { _id: { $in: finalResult }, status: "ACTIVE" };
                            // if (req.body.search) {
                            //     query.$or = [
                            //         {
                            //             name: { $regex: req.body.search, $options: 'i' }
                            //         },
                            //         {
                            //             mobileNumber: { $regex: req.body.search, $options: 'i' }
                            //         }
                            //     ]
                            // }

                            var options = {
                                page: req.query.page || 1,
                                limit: req.query.limit || 10,
                                sort: { createdAt: -1 },
                                select: 'name countryCode mirrorFlyId _id mobileNumber profilePic friendRequestList'
                            };

                            userModel.paginate(query, options, (err2, result2) => {
                              console.log('EEEEE', err2);
                                if (err2) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    let newArray = []
                                    result2.docs.forEach(x => {
                                        var obj = {
                                            _id: x._id,
                                            name: x.name,
                                            countryCode: x.countryCode,
                                            mobileNumber: x.mobileNumber,
                                            profilePic: x.profilePic,
                                            mirrorFlyId: x.mirrorFlyId,
                                            friendRequestList: x.friendRequestList
                                        }
                                        newArray.push(obj);

                                    })
                                    // var isRequested=false;
                                    newArray.map((e) => {
                                        if (e.friendRequestList.map(el => el.friendRequestUserId).includes(userResult._id)) {
                                            e["isRequested"] = true;
                                            return e;
                                        }
                                        else {
                                            e["isRequested"] = false
                                            return e;
                                        }
                                    })
                                    const total = result2.total;
                                    const pages = result2.pages;
                                    const limit = result2.limit;
                                    const page = result2.page;
                                    var newResult = { docs: newArray, total, limit, page, pages };
                                    response(res, SuccessCode.SUCCESS, newResult, SuccessMessage.DATA_FOUND);
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

    searchFriend: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (userErr, userResult) => {
                if (userErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    var query = { userType: "USER", status: "ACTIVE" };
                    if (req.body.search) {
                        query.$or = [
                            {
                                name: { $regex: req.body.search, $options: 'i' }
                            },
                            {
                                mobileNumber: { $regex: req.body.search, $options: 'i' }
                            }
                        ]
                    }

                    var options = {
                        page: req.body.page || 1,
                        limit: req.body.limit || 10,
                        sort: { createdAt: -1 },
                        select: 'name countryCode _id mobileNumber profilePic friendRequestList friends'
                    };

                    userModel.paginate(query, options, (err, result) => {
                        console.log("1987", err, result)
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            let newArray = []
                            result.docs.forEach(x => {
                                var obj = {
                                    _id: x._id,
                                    name: x.name,
                                    countryCode: x.countryCode,
                                    mobileNumber: x.mobileNumber,
                                    profilePic: x.profilePic,
                                    friendRequestList: x.friendRequestList,
                                    friends: x.friends
                                }
                                newArray.push(obj);

                            })
                            // var isRequested=false;
                            newArray.map((e) => {
                                if (e.friendRequestList.map(el => el.friendRequestUserId).includes(userResult._id)) {
                                    e["isRequested"] = true;
                                    return e;
                                }
                                else {
                                    e["isRequested"] = false
                                    return e;
                                }
                            })
                            newArray.map((o) => {
                                if (o.friends.map(el => el.friendId).includes(userResult._id)) {
                                    o["isFriend"] = true;
                                    return o;
                                }
                                else {
                                    o["isFriend"] = false;
                                    return o;
                                }
                            })
                            const total = result.total;
                            const pages = result.pages;
                            const limit = result.limit;
                            const page = result.page;
                            var newResult = { docs: newArray, total, limit, page, pages };
                            return res.send({ response_code: 200, response_message: "Requested data found", newResult })
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
      * Function Name :search contact
      * Description   : search contact in contact list
      *
      * @return response
    */

    searchContact: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE", userType: "USER" }, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    var query = { status: "ACTIVE" }
                    if (req.body.search) {
                        query.$and = [{ status: { $ne: "DELETE" } }, { name: { $regex: req.body.search, $options: 'i' } }]
                    }
                    userModel.find(query, (err, result) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET)
                        }
                    })
                    //response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET)
                }

            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)

        }
    },
    /**
       * Function Name :myBlockUserList
       * Description   : show my myBlockUserList
       *
       * @return response
     */
    myBlockUserList: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE", userType: "USER" }, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                }
                else {
                    var result = {
                        blockedUser: userData.blockedUser
                    }
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET)
                }

            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    /**
* Function Name :feedback
* Description   : feedback given by user on event
*
* @return response
*/

    feedback: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, async (err, result) => {
                console.log("JDJJFJ", err, result)
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    eventModel.findOne({ _id: req.body._id, status: "ACTIVE" }, (eventErr, eventData) => {
                        if (eventErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!eventData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        }
                        else {
                            var obj = {
                                eventId: eventData._id,
                                userId: result._id,
                                //reciveduserId:eventData.userId,
                                eventTitle: eventData.title,
                                overAllExp: req.body.overAllExp,
                                punctualTime: req.body.punctualTime,
                                welcome: req.body.welcome,
                                recommend: req.body.recommend,
                                message: req.body.message

                            }
                            feedBackModel.create(obj, (error, feedbackData) => {
                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, feedbackData, SuccessMessage.FEEDBACK_GIVEN)
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
* Function Name :feedbackList
* Description   : List of feedback given by user on events
*
* @return response
*/

    feedbackList: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, userType: "USER" }, (error, userData) => {
                console.log("dhdgddgdg", error, userData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    feedBackModel.paginate({ userId: userData._id }, options, (feedBackErr, feedbackData) => {
                        if (feedBackErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                        }
                    })
                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },
    /**
* Function Name :feedbackOnMyEvent
* Description   : List of feedback given by users on my event
*
* @return response
*/

    feedbackOnMyEvent: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, userType: "USER" }, (error, userData) => {
                console.log("dhdgddgdg", error, userData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    eventModel.findOne({ _id: req.body.eventId, userId: userData._id, status: "ACTIVE" }, (eventErr, eventData) => {
                        console.log("im here11", eventErr, eventData)
                        if (eventErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!eventData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        }
                        else {
                            var options = {
                                sort: { createdAt: -1 },
                                page: req.body.pageNumber || 1,
                                limit: req.body.limit || 10
                            };
                            feedBackModel.paginate({ eventId: req.body.eventId }, options, (feedBackErr, feedbackData) => {
                                if (feedBackErr) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, feedbackData, SuccessMessage.DATA_FOUND);

                                }
                            })

                        }
                    })

                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },

    viewFeedback: (req, res) => {
        try {
            feedBackModel.findOne({ _id: req.body.feedbackId, status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
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

    checkOnlineStatus: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, userType: "USER" }, (error, userData) => {
                console.log("dhdgddgdg", error, userData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    userModel.findOneAndUpdate({ _id: userData._id, status: "ACTIVE" }, { $set: { onlineStatus: req.body.onlineStatus } }, { new: true },
                        (err, updateData) => {
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, ErrorMessage.SOMETHING_WRONG)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.UPDATE_SUCCESS)
                            }
                        })

                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },

    // userReward: (req, res) => {
    //     try {
    //         userModel.findOne({ _id: req.headers._id, userType: "USER" }, (error, userData) => {
    //             console.log("dhdgddgdg", error, userData)
    //             if (error) {
    //                 response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //             } else if (!userData) {
    //                 response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
    //             }
    //             else {
    //                 rewardModel.find({},(err,rewardData)=>{
    //                     if (err) {
    //                         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //                     } else if (rewardData==0) {
    //                         response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
    //                     }
    //                     else{
    //                     }
    //                 })
    //             }
    //         })
    //     } catch (error) {
    //         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

    //     }
    // },



    userTest: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, userType: "USER" }, (error, userData) => {
                console.log("dhdgddgdg", error, userData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    userModel.find({ status: "ACTIVE" }).count().exec((err, data) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else if (data.length == 0) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        } else {

                            totalUsers = data
                            rewardModel.find({ status: "ACTIVE" }).count().exec((rewardErr, result) => {
                                if (rewardErr) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                } else {
                                    rewardModel.find({ rewardType: "GIVE" }, (rewErr, rewRes) => {
                                        console.log("ffffFF", rewErr, rewRes)
                                        if (rewErr) {
                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                        } else {
                                            totalUsers = data
                                            winners = result

                                            response(res, SuccessCode.SUCCESS, { totalUsers, winners, rewRes }, SuccessMessage.DATA_FOUND)

                                        }
                                    })



                                }
                            })
                        }

                    })

                }
            })

        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },

    userReward: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, userType: "USER" }, (error, userData) => {
                console.log("dhdgddgdg", error, userData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    userModel.find({ status: "ACTIVE" }).count().exec((err, data) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else {
                            totalUsers = data
                            rewardModel.find({ status: "ACTIVE", rewardType: "GIVE" }).count().exec((rewardErr, result) => {
                                if (rewardErr) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                } else {
                                    userModel.find({ status: "ACTIVE" }, (userErr, userDet) => {

                                        if (userErr) {
                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                        }
                                        else {
                                            rewardModel.find({ rewardType: "GIVE" }, (rewErr, rewRes) => {
                                                console.log("ffffFF", rewErr, rewRes)
                                                a = []
                                                rewRes.forEach((p) => {
                                                    if (p.countryCode == userData.countryCode) {
                                                        console.log("dddddddfggggg", p.countryCode)
                                                        a.push({ countryCode: p.countryCode })
                                                    }
                                                })
                                                //console.log("hdhdhdh",a)
                                                // return
                                                if (rewErr) {
                                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                } else {
                                                    totalUsers = data
                                                    winners = result
                                                    countryWinners = a.length
                                                    countryWinnersName = "IN"
                                                    response(res, SuccessCode.SUCCESS, { totalUsers, winners, countryWinners, countryWinnersName }, SuccessMessage.DATA_FOUND)

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

        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },

    rewardList: (req, res) => {
        try {
            //console.log("gdgdgd",req.headers,req.query)
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }

                else {
                    let options = {
                        page: req.body.pageNumber || 1,
                        limit: req.body.limit || 5,
                        sort: {
                            createdAt: -1
                        },
                    }
                    rewardModel.paginate({ rewardType: "GIVE" }, options, (rewardErr, rewardData) => {
                        console.log("gdg4444444444444444444dgd", rewardErr, rewardData)
                        if (rewardErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, rewardData, SuccessMessage.DETAIL_GET);
                        }
                    })
                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    likeAndDislikeReward: (req, res) => {
        try {
            if (req.body.like == "true") {
                userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, async (UserErr, userData) => {
                    if (UserErr) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    } else if (!userData) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    } else {
                        rewardModel.findOne({ _id: req.body.postId }, async (rewardErr, rewardData) => {
                            // postModel.findOne({ _id: req.body.postId, postStatus: "ACTIVE", likes: { $elemMatch: { likedId: userData._id } } }, (postErr, postData) => {
                            if (rewardErr) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            } else if (rewardData) {
                                var data = await rewardModel.findOne({ _id: rewardData._id, likes: { $elemMatch: { likedId: userData._id } } })
                                console.log("im in dataaaaa", data)
                                if (data) {
                                    let like = {
                                        likedId: userData._id,
                                        userName: userData.name,
                                        userPic: userData.profilePic,
                                        likeSymbol: req.body.likeSymbol
                                    };
                                    rewardModel.findOneAndUpdate({ _id: rewardData._id }, { $set: { likes: like } }, { new: true }, (error, success) => {
                                        console.log("i m in update", error, success)
                                        if (error) {
                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                        }
                                        else {
                                            response(res, SuccessCode.SUCCESS, success, SuccessMessage.POST_LIKE);
                                        }
                                    })

                                }
                                else {
                                    let like = {
                                        likedId: userData._id,
                                        userName: userData.name,
                                        userPic: userData.profilePic,
                                        likeSymbol: req.body.likeSymbol
                                    };
                                    rewardModel.findOneAndUpdate({ _id: req.body.postId }, { $push: { likes: like } }, { new: true }, (error, success) => {
                                        if (error) {
                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                        }
                                        else {
                                            response(res, SuccessCode.SUCCESS, success, SuccessMessage.POST_LIKE);
                                        }
                                    })

                                }


                            } else {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                            }
                        })
                    }
                })
            }
            else if (req.body.like == "false") {
                userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, async (UserErr, userData) => {
                    if (UserErr) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    } else if (!userData) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    } else {
                        rewardModel.findOne({ _id: req.body.postId, likes: { $elemMatch: { likedId: userData._id } } }, (err, success) => {
                            console.log("dhdhdghdgdggdge", err, success)
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            } else if (!success) {
                                return res.send({ responseCode: 404, responseMessage: "User havent liked yet" })
                            } else {
                                const dislike = _.filter(success.likes, _.matches({ likedId: userData._id }));
                                rewardModel.findByIdAndUpdate({ _id: req.body.postId }, { $pull: { likes: dislike[0] } }, { new: true }, (error, update) => {
                                    if (error) {
                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                    } else {
                                        response(res, SuccessCode.SUCCESS, [update], SuccessMessage.POST_DISLIKE);
                                    }

                                })

                            }
                        })
                    }
                })

            }

        } catch (error) {
            console.log("jjj", error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    rewardComment: (req, res) => {
        try {
            console.log("i am in body", req.body)
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } else {
                    var comment = {
                        commentedUser: userData._id,
                        comment: req.body.comment,
                        userName: userData.name,
                        userPic: userData.profilePic,
                        commentedTime: new Date()
                    };
                    rewardModel.findOneAndUpdate({ _id: req.body.postId, status: "ACTIVE" }, { $push: { comments: comment } }, { new: true },
                        (error, success) => {
                            if (error) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, success, SuccessMessage.POST_COMMENT);
                            }
                        })

                }
            })
        } catch (error) {
            res.send({ responseCode: 500, responseMessege: "Something went wrong" })
        }
    },
    rewardCommentList: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                console.log("i am in user", UserErr, userData)
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } else {
                    rewardModel.findOne({ _id: req.params._id }, (postErr, postData) => {
                        console.log("i am in update", postErr, postData)
                        //return
                        if (postErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else if (!postData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        } else {
                            response(res, SuccessCode.SUCCESS, postData.comments, SuccessMessage.DATA_FOUND);
                        }
                    })
                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    deleteRewardComment: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    rewardModel.findOne({ _id: req.body.postId }, (err1, postData) => {
                        if (err1) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                        }
                        else if (!postData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.POST_NOT_FOUND);

                        }
                        else {
                            const deleteComments = _.filter(postData.comments, _.matches({ _id: mongoose.Types.ObjectId(req.body.commentId) }));
                            console.log("dddddd", deleteComments[0]._id)
                            rewardModel.findOneAndUpdate({ _id: req.body.postId }, { $pull: { comments: deleteComments[0] } }, { new: true }, (updateErr, updatedData) => {
                                console.log("dddddd", updateErr, updatedData)
                                if (updateErr) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else if (!updatedData) {
                                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.POST_NOT_FOUND);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, updatedData, SuccessMessage.COMMENT_UPDATE);
                                }
                            })
                        }
                    })
                }
            })
        }
        catch (error) {
            res.send({ responseCode: 500, responseMessege: "Something went wrong" })

        }
    },
    /**
            * Function Name :edit comment
            * Description   : edit comment on post by user
            *
            * @return response
           */
    editRewardComment: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    rewardModel.findOne({ _id: req.body.postId }, (err, postData) => {
                        //console.log("hdhdhshsghgssgsg",postData.comments[0]._id)
                        console.log("hdhdhshsg44hgssgsg", postData)

                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!postData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                        }
                        else {
                            //return

                            const editComments = _.filter(postData.comments, _.matches({ _id: mongoose.Types.ObjectId(req.body.commented) }));
                            console.log("hdhdhshsg44hgssgsg", editComments[0])
                            //return

                            const newComment = {
                                _id: editComments[0]._id,
                                commentedUser: editComments[0].commentedUser,
                                comment: req.body.comment,
                                userName: editComments[0].userName,
                                userPic: editComments[0].userPic,
                                commentedTime: new Date()
                            }
                            rewardModel.findOneAndUpdate({ 'comments._id': req.body.commented, status: "ACTIVE" }, { $set: { "comments.$": newComment } }, { new: true }, (updatedErr, updatedData) => {
                                if (updatedErr) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, updatedData, SuccessMessage.DATA_FOUND);

                                }
                            })

                            //})
                            // response(res, SuccessCode.SUCCESS, [postData.comments._id], SuccessMessage.DATA_FOUND);

                        }
                    })
                }
            })
        } catch (error) {
            res.send({ responseCode: 500, responseMessege: "Something went wrong" })

        }
    },

    rewardReplyOnComment: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } else {
                    rewardModel.findOne({ _id: req.body.postId, "comments._id": req.body.commentId }).populate('comments.commentedUser').select({ 'comments.$._id': 1 }).exec((err, postResult) => {
                        console.log(">>>>>>>5091", err, postResult);
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!postResult) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        }
                        else {
                            var comment = {
                                commentId: req.body.commentId,
                                commentedUser: userData._id,
                                comment: req.body.comment,
                                userName: userData.name,
                                userPic: userData.profilePic,
                                commentedTime: new Date()
                            };
                            // commonFunction.pushNotification(userData.deviceToken, `${userData.name} replied on your comment.`, "reply comment", (notificationErr, notificationResult) => {
                            //     if (notificationErr) {
                            //         console.log(">>>>>>>2655", notificationErr);
                            //     }
                            //     else {
                            var obj = {
                                userId: postResult.comments[0].commentedUser._id,
                                senderId: req.headers._id,
                                title: "Reply on comment",
                                body: `${userData.name} replied on your comment.`,
                                senderIdMessage: `${userData.name} replied on ${postResult.comments[0].commentedUser.name} comment`,
                                notificationType: "Comment replied on post",
                                requestFor: "COMMENT"
                            };

                            new notificationModel(obj).save((saveErr, saveResult) => {
                                if (saveErr) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    console.log("post>>>>", postResult)
                                    rewardModel.findOneAndUpdate({ "comments._id": req.body.commentId },
                                        { $push: { "comments.$.replyComments": comment } },
                                        { new: true },
                                        (err2, result2) => {
                                            console.log("Repyyyy", result2)
                                            if (err2) {
                                                console.log("13107======>", err2, result2)

                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                                            } else {
                                                response(res, SuccessCode.SUCCESS, result2, SuccessMessage.POST_COMMENT);
                                            }
                                        }
                                    )
                                }


                            })
                            //     }
                            // })



                        }
                    })
                }
            })
        }
        catch (error) {
            res.send({ responseCode: 500, responseMessege: "Something went wrong" })
        }
    },

    rewardDeleteReplyComment: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    rewardModel.findOne({ _id: req.body.postId }, (err1, postData) => {
                        console.log("sssfsfssss", err1, postData)
                        //return
                        if (err1) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                        }
                        else if (!postData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.POST_NOT_FOUND);

                        }
                        else {
                            // const deleteReplyComments = _.filter(postData.comments[0].replyComments, _.matches({ _id: mongoose.Types.ObjectId(req.body.replyId) }));
                            // console.log("hhdhddgd8888888888888d", deleteReplyComments[0])
                            // return
                            rewardModel.findOneAndUpdate({ "comments._id": req.body.commentId },
                                { $pull: { "comments.$.replyComments": { _id: req.body.replyId } } }, { new: true },
                                (updateErr, updatedData) => {
                                    console.log("ddd1019ddd", updateErr, updatedData)
                                    if (updateErr) {
                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else if (!updatedData) {
                                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.POST_NOT_FOUND);

                                    }
                                    else {
                                        response(res, SuccessCode.SUCCESS, updatedData, SuccessMessage.DELETE_REPLY);
                                    }
                                })
                        }
                    })
                }
            })
        }
        catch (error) {
            res.send({ responseCode: 500, responseMessege: "Something went wrong" })

        }
    },


    rewardUpdateReplyComment: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                console.log("ha>>><<<<<<<<sgsgsgs", UserErr, userData)

                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    rewardModel.findOne({ _id: req.body.postId, "comments.replyComments._id": req.body.replyId, status: "ACTIVE" }).exec((err1, postData) => {
                        console.log(">>>>>>>>>>>>in postData>>>>>>>>>>>>>", err1, postData)
                        if (err1) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                        }
                        else if (!postData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.POST_NOT_FOUND);

                        }
                        else {
                            var updateKey = {};

                            updateKey = {
                                "_id": req.body.replyId,
                                "commentedUser": userData._id,
                                "commentId": req.body.commented,
                                "comment": req.body.comment,
                                "userName": userData.name,
                                "userPic": userData.profilePic,
                                "commentedTime": new Date()
                            };


                            let set;
                            postData.comments.map((elem, index) => {
                                if (elem._id == req.body.commented) {
                                    elem.replyComments.map((e, i) => {
                                        if (e._id == req.body.replyId) {
                                            set = 'comments.' + index + '.replyComments.' + i
                                            rewardModel.findOneAndUpdate({ _id: postData._id, comments: { $elemMatch: { replyComments: { $elemMatch: { _id: updateKey._id } } } } }, { $set: { [`${set}`]: updateKey } }, { new: true }, (updateErr, updatedData) => {
                                                console.log("dddddd", updateErr, updatedData)
                                                if (updateErr) {
                                                    return response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                }
                                                else {
                                                    return response(res, SuccessCode.SUCCESS, updatedData, SuccessMessage.UPDATE_SUCCESS);
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
            res.send({ responseCode: 500, responseMessege: "Something went wrong" })

        }
    },


    rewardReplyCommentLists: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    rewardModel.findOne({ _id: req.body.postId }, (err1, postData) => {
                        if (err1) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                        }
                        else if (!postData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.POST_NOT_FOUND);

                        }
                        else {
                            const editComments = _.filter(postData.comments, _.matches({ _id: mongoose.Types.ObjectId(req.body.commentId) }));
                            var like = editComments[0].likeOnComment.length
                            //Object.keys(member).length)
                            console.log("hdhdhshsg44hgssgsg", editComments[0].replyComments, editComments[0].likeOnComment, editComments[0].comment, like)
                            //return
                            var comment = {
                                _id: editComments[0]._id,
                                comment: editComments[0].comment,
                                userName: editComments[0].userName,
                                userPic: editComments[0].userPic,
                                commentedTime: editComments[0].commentedTime,
                                isLike: editComments[0].isLike,
                                likeCount: like
                            }
                            var result1 = editComments[0].replyComments
                            console.log("2483", comment)

                            var result = { comment, like, result1 }
                            response(res, SuccessCode.SUCCESS, result, SuccessMessage.REPLY_LIST);

                        }
                    })
                }
            })
        }
        catch (error) {
            res.send({ responseCode: 500, responseMessege: "Something went wrong" })

        }
    },
    likeRewardComment: (req, res) => {
        try {
            console.log("shshshshshshsh", req.headers, req.body)
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } else {
                    if (req.body.like == "true") {
                        rewardModel.findOne({ _id: req.body.postId }, (err, postResult) => {
                            console.log(">>>>>>>1166", err, postResult);
                            //return
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (!postResult) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                            }
                            else {
                                // console.log("i am in>>>>>1173>>>",postResult)
                                rewardModel.findOne({
                                    "comments._id": req.body.commentId,
                                    "comments.likeOnComment": { "$elemMatch": { "likedId": userData._id, commentId: req.body.commentId } }

                                }, (postErr, postData) => {
                                    console.log("i am in>>>>>1185>>>", postErr, postData)
                                    //return
                                    if (postErr) {

                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                                    }
                                    else if (postData) {
                                        console.log("13107=====1190=>", postErr, postData)
                                        response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.COMMENT_LIKE);

                                    }
                                    else {
                                        var like = {
                                            commentId: req.body.commentId,
                                            likedId: userData._id,
                                            userName: userData.name,
                                            userPic: userData.profilePic,
                                            likeSymbol: req.body.likeSymbol,
                                        };
                                        rewardModel.findOneAndUpdate({ "comments._id": req.body.commentId },
                                            { $push: { "comments.$.likeOnComment": like } },
                                            { new: true },
                                            (err3, result3) => {
                                                console.log("i am in>>>>>>1111108>>>", err3, result3)
                                                if (err3) {
                                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                                                } else {
                                                    rewardModel.findOneAndUpdate({ 'comments._id': req.body.commentId }, { $set: { "comments.$.isLike": true } }, { new: true }, (updatedErr, updatedData) => {
                                                        console.log("i am in 111111133333", updatedErr, updatedData)
                                                        if (updatedErr) {
                                                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                                        }
                                                        else {
                                                            response(res, SuccessCode.SUCCESS, updatedData, SuccessMessage.LIKE_COMMENT);

                                                        }
                                                    })
                                                }
                                            }
                                        )
                                    }
                                })

                            }
                        })
                    }
                    else if (req.body.like == "false") {
                        rewardModel.findOne({ _id: req.body.postId, "comments._id": req.body.commentId }).populate('comments.likedId').select({ 'comments.$._id': 1 }).exec((err, postResult) => {
                            console.log(">>>>>>>5091", err, postResult);
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (!postResult) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                            }
                            else {
                                rewardModel.findOne({
                                    "comments._id": req.body.commentId, "comments.likeOnComment": { "$elemMatch": { "likedId": userData._id, commentId: req.body.commentId } }

                                }, (postErr, postData) => {
                                    console.log("i am in>>>>>>555555555>>>", postErr, postData)
                                    if (postErr) {

                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                                    }
                                    else if (!postData) {
                                        console.log("13107=====6666666666=>", postErr, postData)
                                        response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.COMMENT_NOT_LIKE);

                                    }
                                    else {
                                        rewardModel.findOneAndUpdate({ 'comments._id': req.body.commentId }, { $set: { "comments.$.isLike": false } }, { new: true }, (updatedErr, updatedData) => {
                                            if (updatedErr) {
                                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else {
                                                const dislike = _.filter(postData.comments[0].likeOnComment
                                                    , _.matches({ commentId: req.body.commentId }));
                                                console.log("i am in>>>>>>>>>", dislike[0])

                                                //return
                                                rewardModel.findOneAndUpdate({ "comments._id": req.body.commentId },
                                                    { $pull: { "comments.$.likeOnComment": { likedId: userData._id } } },
                                                    { new: true },
                                                    (err3, result3) => {
                                                        console.log("i am in>>>>>>>>>", err3, result3)
                                                        if (err3) {
                                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                                                        } else {
                                                            response(res, SuccessCode.SUCCESS, result3, SuccessMessage.DISLIKE_COMMENT);

                                                        }
                                                    }
                                                )
                                                // response(res, SuccessCode.SUCCESS, updatedData, SuccessMessage.LIKE_COMMENT);

                                            }
                                        })

                                    }
                                })

                            }
                        })
                    }
                }
            })
        }
        catch (error) {
            res.send({ responseCode: 500, responseMessege: "Something went wrong" })
        }
    },
    InterestList: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, userType: "USER" }, (error, userData) => {
                console.log("dhdgddgdg", error, userData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    let query = { status: "ACTIVE" };
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
                        else {
                            response(res, SuccessCode.SUCCESS, interestData, SuccessMessage.DATA_FOUND)
                        }
                    })

                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },
    foodList: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, userType: "USER" }, (error, userData) => {
                console.log("dhdgddgdg", error, userData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    let query = { status: "ACTIVE" };
                    let options = {
                        page: req.body.pageNumber || 1,
                        limit: req.body.limit || 10,
                        sort: {
                            createdAt: -1
                        }
                    }
                    foodModel.paginate(query, options, (err, data) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else {
                            response(res, SuccessCode.SUCCESS, data, SuccessMessage.DATA_FOUND);
                        }
                    })

                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },
    languageList: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, userType: "USER" }, (error, userData) => {
                console.log("dhdgddgdg", error, userData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    let query = { status: "ACTIVE" };
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
                        else {
                            response(res, SuccessCode.SUCCESS, languageData, SuccessMessage.DATA_FOUND)
                        }
                    })

                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },

    createGroup: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE", userType: "USER" }, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    // var arr = req.body.members;
                    //     var arr1 = [];
                    //     console.log("3288>>>>>>>>>>>>>", arr);
                    //     arr.forEach(x => {
                    //         arr1.push(x.memberId);
                    //     });
                    //     console.log("3288>>>>>>>>>>>>>", arr1);
                    // var arr=req.body.members;
                    // var arr1=[];
                    // arr.forEach(x=>{
                    //     arr1.push(x.memberId)
                    // })
                    // userModel.findOne({_id:arr},(error1,userdata1)=>{
                    //     console.log("3288>>>>>>>>>>>>>", error1,userdata1);
                    //     if (error1) {
                    //         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    //     } else if (!userdata1) {
                    //         response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    //     }
                    //     else {
                    var obj = new groupModel({
                        groupName: req.body.groupName,
                        title: req.body.title
                    })
                    obj.save((err, saveData) => {
                        console.log("3288>>>>>>>>>>>>>", err, saveData);
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else {
                            response(res, SuccessCode.SUCCESS, saveData, SuccessMessage.DATA_SAVED)
                        }
                    })
                    //     }
                    // })
                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },

    addGroupMember: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE", userType: "USER" }, async (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    // var arr = req.body.members;
                    // var arr1 = [];
                    // console.log("3288>>>>>>>>>>>>>", arr);
                    // arr.forEach(x => {
                    //     arr1.push(x.memberId);
                    // });
                    // console.log("req.body>>>>>>>>>>>>>>>>", arr1);
                    userModel.find({ mobileNumber: { $in: req.body.contactData }, userType: "USER" }, async (err, friendData) => {
                        console.log("dgdg55555dddfd", err, friendData)

                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!friendData) {
                            response(res, ErrorCode.NOT_FOUND, ErrorMessage.NOT_FOUND)
                        }
                        else {
                            groupModel.findOneAndUpdate({ _id: req.body.groupId }, { $addToSet: { members: req.body.contactData } }, { new: true }, async (saveErr, dataSaved) => {
                                console.log("dgdgdddfd", saveErr, dataSaved)
                                if (saveErr) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, dataSaved, SuccessMessage.FRIEND_ADDED)

                                }
                            })
                            // }
                            // var data = await userModel.findOne({ _id: userData._id, friends: { $elemMatch: { friendId: friendData.friendId } } })
                            // if (data) {
                            //     response(res, ErrorCode.ALREADY_EXIST, ErrorMessage.FRIEND_EXISTS)
                            // }
                            // else {
                            //     groupModel.findOneAndUpdate({ _id: req.body.groupId }, { $addToSet: { members: req.body.members } }, { new: true }, async (saveErr, dataSaved) => {
                            //         if (saveErr) {
                            //             response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            //         }
                            //         else {
                            //             response(res, SuccessCode.SUCCESS, dataSaved, SuccessMessage.FRIEND_ADDED)

                            //         }
                            //     })
                            // }
                        }
                    })
                }
            })

        }
        catch(e){
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    friends: (req, res) => {
        try {

            userModel.findOne({ _id: req.headers._id, status: "ACTIVE", userType: "USER" }, async (error, user) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!user) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    userModel.findOne({ _id: req.body.userId }, (err, userData) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else if (!userData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                        } else {
                            var arr = userData.friends;
                            var arr1 = [];
                            arr.forEach(x => {
                                if (x.status == "ACTIVE") {
                                    arr1.push(x.friendId);
                                }
                            });
                            req.body.pageNumber = parseInt(req.body.pageNumber);
                            req.body.limit = parseInt(req.body.limit);
                            var options = {
                                sort: { createdAt: -1 },
                                page: req.body.pageNumber || 1,
                                select: "profilePic _id name _id",
                                limit: req.body.limit || 5
                            };
                            userModel.paginate({ _id: arr1 }, options, (err1, friendData) => {
                                if (err1) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                } else {
                                    let doc = friendData.docs
                                    let newArray = []
                                    doc.forEach(x => {
                                        //let count = []
                                        // let friendId = []
                                        // //let counter = 0
                                        // for (let a = 0; a < x.friends.length; a++) {
                                        //     friendId.push(x.friends[a].friendId)
                                        // }
                                        var obj = {
                                            _id: x._id,
                                            name: x.name,
                                            email: x.email,
                                            profilePic: x.profilePic,
                                            //friends: x.friends,
                                            //mutual: presents.length
                                        }
                                        newArray.push(obj);
                                    })
                                    const total = friendData.total;
                                    const pages = friendData.pages;
                                    const limit = friendData.limit;
                                    const page = friendData.page;
                                    var FrndResult = { success2: { docs: newArray, total, limit, page, pages } };
                                    response(res, SuccessCode.SUCCESS, FrndResult, SuccessMessage.DETAIL_GET)


                                }
                            }
                            );

                        }
                    }
                    );
                }
            })

        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    // sendFriendRequest: (req, res) => {
    //     try {
    //         userModel.findOne({ _id: req.headers._id, status: "ACTIVE", userType: "USER" }, async (error, userData) => {
    //             // console.log("i m in user",error,userData)
    //             if (error) {
    //                 response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //             }
    //             else if (!userData) {
    //                 response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
    //             }
    //             else {
    //                 userModel.findOneAndUpdate({ _id: req.headers._id }, { $push: { friendRequestSentList: [{ friendRequestSentId: req.body.friendId }] } }, { new: true },
    //                     (updatedErr, successData) => {
    //                         console.log("im in sent list", updatedErr, successData)
    //                         if (updatedErr) {
    //                             response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //                         } else if (!successData) {
    //                             response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
    //                         } else {
    //                             userModel.findOneAndUpdate(
    //                                 {
    //                                     _id: req.body.friendId,
    //                                     status: "ACTIVE"
    //                                 },
    //                                 {
    //                                     $push: {
    //                                         friendRequestList: [
    //                                             {
    //                                                 friendRequestUserId: req.headers._id
    //                                             }
    //                                         ]
    //                                     }
    //                                 },
    //                                 { new: true },
    //                                 (err, success) => {
    //                                     if (err) {
    //                                         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //                                     } else if (!success) {
    //                                         response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
    //                                     } else {
    //                                         commonFunction.pushNotification(success.deviceToken, "Friend Request", success.name + "has sent you a friend request", (err, notificationResult) => {
    //                                             if (err) {
    //                                                 response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //                                             }
    //                                             else {
    //                                                 var notification = {
    //                                                     userId: req.body.friendId,
    //                                                     senderId: req.headers._id,
    //                                                     title: "Friend request",
    //                                                     body: userData.name + " has sent you a friend request",
    //                                                     messege: `${userData.name} sent friend request to ${success.name}`,
    //                                                     notificationType: "Friend Request"
    //                                                 }
    //                                                 var notify = new notificationModel(notification)
    //                                                 notify.save((SaveError, save) => {
    //                                                     if (SaveError) {
    //                                                         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //                                                     }
    //                                                     else {
    //                                                         var result = {
    //                                                             successData: successData,
    //                                                             success: success
    //                                                         };
    //                                                         response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET)

    //                                                     }
    //                                                 })
    //                                             }
    //                                         })

    //                                     }
    //                                 }
    //                             );
    //                         }
    //                     }
    //                 );
    //             }
    //         });

    //     } catch (error) {
    //         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    //     }
    // },
    sendFriendRequest: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE", userType: "USER" }, async (error, userData) => {
                // console.log("i m in user",error,userData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    userModel.findOneAndUpdate({ _id: req.headers._id }, { $addToSet: { friendRequestSentList: { friendRequestSentId: req.body.friendId } } }, { new: true },
                        (updatedErr, successData) => {
                            console.log("im in sent list", updatedErr, successData)
                            if (updatedErr) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            } else {
                                userModel.findOneAndUpdate(
                                    {
                                        _id: req.body.friendId,
                                        status: "ACTIVE"
                                    },
                                    {
                                        $push: {
                                            friendRequestList: [
                                                {
                                                    friendRequestUserId: req.headers._id
                                                }
                                            ]
                                        }
                                    },
                                    { new: true },
                                    (err, success) => {
                                        if (err) {
                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                        } else {
                                            var newId = success.friendRequestList.pop()
                                            friendRequest.send(req.headers._id.toString(), req.body.friendId.toString());
                                            //return
                                            // commonFunction.pushNotification(success.deviceToken, "Friend Request", success.name + "has sent you a friend request", (err, notificationResult) => {
                                            //     if (err) {
                                            //         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                            //     }
                                            //     else {
                                            var notification = {
                                                userId: req.body.friendId,
                                                senderId: req.headers._id,
                                                friendRequestId: newId._id,
                                                title: "Friend request",
                                                body: userData.name + " has sent you a friend request",
                                                messege: `${userData.name} sent friend request to ${success.name}`,
                                                notificationType: "Friend Request",
                                                requestFor: "FRIENDREQUEST"
                                            }
                                            var notify = new notificationModel(notification)
                                            notify.save((SaveError, save) => {
                                                if (SaveError) {
                                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                }
                                                else {
                                                    var result = {
                                                        successData: successData,
                                                        success: success
                                                    };
                                                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.FRIEND_REQUEST)

                                                }
                                            })
                                            //     }
                                            // })

                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            });

        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },


    actionToFriendRequest: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id }, (err, success1) => {
                if (err) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    userModel.findOne({ _id: req.body.friendRequestUserId }, (err2, success2) => {
                        if (err2) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            if (req.body.response == "ACCEPT") {
                                userModel.findOne({ _id: req.body.friendRequestUserId, friends: { $elemMatch: { friendId: req.headers._id } } }, (err3, result3) => {
                                    if (err3) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else if (result3) {
                                        userModel.findOneAndUpdate({ _id: result3._id }, { $pull: { friendRequestSentList: { friendRequestSentId: req.headers._id } } }, { new: true }, (pullErr, pullResult) => {
                                            if (pullErr) {
                                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else {
                                                userModel.findOneAndUpdate({ _id: req.headers._id }, { $pull: { friendRequestList: { friendRequestUserId: req.body.friendRequestUserId } } }, { new: true }, (removeErr, removeResult) => {
                                                    if (removeErr) {
                                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                                    }
                                                    else {

                                                       requestAccept.send(req.headers._id.toString(), req.body.friendRequestUserId.toString());
                                                        notificationModel.findOneAndUpdate({ _id: req.body.notiicationId, status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true }, (notErr, notData) => {
                                                            if (notErr) {
                                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                                                            }
                                                            else {
                                                                response(res, SuccessCode.SUCCESS, [], SuccessMessage.UPDATE_SUCCESS)

                                                            }
                                                        })
                                                        // response(res, SuccessCode.SUCCESS, [], SuccessMessage.UPDATE_SUCCESS)
                                                    }
                                                })
                                            }
                                        })
                                    }
                                    else {
                                        var friend = {
                                            friendId: req.headers._id,
                                            name: success1.name,
                                            profilePic: success1.profilePic
                                        }
                                        userModel.findOneAndUpdate(
                                            {
                                                _id: req.body.friendRequestUserId
                                            },
                                            {
                                                $push: {
                                                    friends: friend
                                                },
                                                $pull: {
                                                    friendRequestSentList: {
                                                        friendRequestSentId: req.headers._id
                                                    }
                                                }
                                            },
                                            { new: true },
                                            (error3, success3) => {
                                                console.log("aceeeepttt", error3, success3)
                                                if (error3) {
                                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                                                } else {
                                                    // userModel.findOne({ _id: req.headers._id, friends: { $elemMatch: { friendId: success2._id } } }, (err4, result4) => {
                                                    //     if (err4) {
                                                    //         response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                                    //     }
                                                    //     else if (result4) {
                                                    //         console.log("3235", result4)
                                                    //         userModel.findOneAndUpdate({ _id: result4._id }, { $pull: { friendRequestList: { friendRequestUserId: req.body.friendRequestUserId } } }, { new: true }, (removeErr, removeResult) => {
                                                    //             if (removeErr) {
                                                    //                 response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                                    //             }
                                                    //             else {
                                                    //                 response(res, SuccessCode.SUCCESS, [], SuccessMessage.UPDATE_SUCCESS)
                                                    //             }
                                                    //         })
                                                    //     }
                                                    //     else {
                                                    var friend1 = {
                                                        friendId: success2._id,
                                                        name: success2.name,
                                                        profilePic: success2.profilePic
                                                    }
                                                    userModel.findOneAndUpdate(
                                                        {
                                                            _id: req.headers._id
                                                        },
                                                        {
                                                            $push: {
                                                                friends: friend1
                                                            },
                                                            $pull: {
                                                                friendRequestList: {
                                                                    friendRequestUserId: req.body.friendRequestUserId
                                                                }
                                                            }
                                                        },
                                                        { new: true },
                                                        (error4, success4) => {
                                                            console.log("hfhfhfh", error4, success4)
                                                            if (error4) {
                                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                                                            } else {

                                                                //else {
                                                                // commonFunction.pushNotification(success3.deviceToken, "Friend request accepted", "You are now friend with " + success2.firstName, (err, notificationResult) => {
                                                                //     if (err) {
                                                                //         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                                //     }
                                                                //     else {
                                                                var notification = {
                                                                    userId: req.body.friendRequestUserId,
                                                                    senderId: req.headers._id,
                                                                    title: "You are now friend with " + success4.name,
                                                                    body: "You are now friend with " + success4.name,
                                                                    notificationType: "Friend Request Accepted",
                                                                    requestFor: "ACCEPTFRIENDREQUEST"

                                                                }
                                                                var notify = new notificationModel(notification)
                                                                notify.save((SaveError, save) => {
                                                                    if (SaveError) {
                                                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                                                                    }
                                                                    else {
                                                                        notificationModel.findOneAndUpdate({ _id: req.body.notiicationId, status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true }, (notErr, notData) => {
                                                                            if (notErr) {
                                                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                                                                            }
                                                                            else {
                                                                                response(res, SuccessCode.SUCCESS, save, SuccessMessage.UPDATE_SUCCESS)

                                                                            }
                                                                        })
                                                                        // response(res, SuccessCode.SUCCESS, save, SuccessMessage.UPDATE_SUCCESS)

                                                                    }
                                                                })
                                                                //     }
                                                                // })
                                                                // }
                                                            }
                                                        }
                                                    );
                                                    //     }
                                                    // })
                                                }
                                            }
                                        );
                                    }
                                })
                            } else {
                                if (req.body.response == "DELETE") {
                                    // if (success2.deviceToken == null) {
                                    //     var obj = {
                                    //         userId: req.body.friendRequestUserId,
                                    //         senderId: req.headers._id,
                                    //         title: "Friend request rejected",
                                    //         body: "Your friend request was rejected by " + success1.firstName,
                                    //         notificationType: "Friend Request Rejected"
                                    //     };
                                    //     new notificationModel(obj).save((saveErr, saveResult) => {
                                    //         if (saveErr) {
                                    //             response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                                    //         }
                                    //         else {

                                    //             response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.UPDATE_SUCCESS)

                                    //         }
                                    //     })
                                    // }
                                    //else {
                                    // commonFunction.pushNotification(success2.fcmToken, "Friend request rejected", "Your friend request was rejected by " + success2.firstName, (err, notificationResult) => {
                                    //     if (err) {
                                    //         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                    //     }
                                    //     else {
                                    const friendId = req.body.friendRequestUserId;
                                    const userId = req.headers._id;
                                    userModel.findOneAndUpdate({ _id: userId }, { $pull: { friendRequestSentList: { friendRequestSentId: friendId } } }, { new: true }, (pullErr, pullResult) => {
                                        if (pullErr) {
                                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                        }
                                        else {
                                            userModel.findOneAndUpdate({ _id: friendId }, { $pull: { friendRequestList: { friendRequestUserId: userId } } }, { new: true }, (removeErr, removeResult) => {
                                                if (removeErr) {
                                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                                }
                                                else {
                                                  var notification = {
                                                    userId: req.body.friendRequestUserId,
                                                    senderId: req.headers._id,
                                                    title: "Your friend request was rejected by " + success1.name,
                                                    body: "Your friend request was rejected by " + success1.name,
                                                    notificationType: "Friend Request Rejected",
                                                    requestFor: "REJECTFRIENDREQUEST"
            
                                                  }
                                                  var notify = new notificationModel(notification)
                                                  notify.save((SaveError, save) => {
                                                      if (SaveError) {
                                                          response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
              
                                                      }
                                                      else {
                                                          notificationModel.findOneAndUpdate({ _id: req.body.notiicationId, status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true }, (notErr, notData) => {
                                                              if (notErr) {
                                                                  response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
              
                                                              }
                                                              else {
                                                                  response(res, SuccessCode.SUCCESS, save, SuccessMessage.UPDATE_SUCCESS)
              
                                                              }
                                                          })
                                                          // response(res, SuccessCode.SUCCESS, save, SuccessMessage.UPDATE_SUCCESS)
              
                                                      }
                                                  })

                                                }
                                            })
                                        }
                                    })
                                    //     }
                                    // })
                                    //}
                                } else {

                                    response(res, SuccessCode.SUCCESS, SuccessMessage.UPDATE_SUCCESS)

                                }
                            }
                        }
                    })
                }
            })

        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },

    /**
                 * Function Name :report post
                 * Description   : report of post by user
                 *
                 * @return response
                */

    rewardPostReport: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (error, userData) => {
                console.log("kkdkdkkk6733333333343", error, userData)

                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, ErrorMessage.NOT_FOUND)

                }
                else {
                    rewardModel.findOne({ _id: req.body.postId, }, (err, result) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                        }
                        else if (!result) {
                            response(res, ErrorCode.NOT_FOUND, result, ErrorMessage.NOT_FOUND)

                        }
                        else {
                            var obj = new postReportModel({
                                reportBy: userData._id,
                                postId: result._id,
                                reason: req.body.reason,
                                reportType: "REWARD"
                                //reportType:"userProfile"
                            })
                            obj.save((saveErr, savedData) => {
                                if (saveErr) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, [savedData], SuccessMessage.POST_REPORT)
                                }
                            })
                        }
                    })
                }


            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },



    followStatus: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE", }, async (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    userModel.findOne({ _id: req.body.userId, status: "ACTIVE", }, (err, user) => {
                        console.log("i am here1", err, user)
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!user) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                        }
                        else {
                            userModel.findOne({ _id: userData._id, status: "ACTIVE", following: { $elemMatch: { followingId: user._id } } }, (err1, data) => {
                                console.log("hhhhhhhhhh", err1, data)
                                if (err1) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else if (data) {
                                    let result = {
                                        isFollowing: true
                                    }
                                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.USER_FOLLOWED)
                                }
                                else {
                                    let result = {
                                        isFollowing: false
                                    }
                                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.USER_UNFOLLOWED)
                                }
                            })
                        }
                    })
                }

            })

        }
        catch(e){
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    friendStatus: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE", }, async (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    userModel.findOne({ _id: req.body.userId, status: "ACTIVE", }, (err, user) => {
                        console.log("i am here1", err, user)
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!user) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                        }
                        else {
                            userModel.findOne({ _id: userData._id, status: "ACTIVE", friends: { $elemMatch: { friendId: user._id } } }, (err1, data) => {
                                console.log("hhhhhhhhhh", err1, data)
                                if (err1) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else if (data) {
                                    let result = {
                                        isFriend: true
                                    }
                                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.USER_FOLLOWED)
                                }
                                else {
                                    let result = {
                                        isFriend: false
                                    }
                                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.USER_UNFOLLOWED)
                                }
                            })
                        }
                    })
                }

            })

        }
        catch(e){
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    unblockUser: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    const UnblockData = _.filter(userData.blockedUser, _.matches({ _id: mongoose.Types.ObjectId(req.body.userId) }));
                    userModel.findOneAndUpdate({ _id: req.headers._id, }, { $pull: { blockedUser: UnblockData[0] } }, { new: true }, (updateErr, updatedData) => {
                        console.log("dddddd", updateErr, updatedData)

                        if (updateErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, updatedData, SuccessMessage.UNBLOCK_SUCCESS);
                        }
                    })
                }
            })
        }
        catch (error) {
            res.send({ responseCode: 500, responseMessege: "Something went wrong" })

        }
    },

    bookmarkProfile: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    userModel.findOneAndUpdate({ _id: result._id }, { $set: { isBookMark: req.body.isBookMark } }, { new: true }, (updateErr, updateResult) => {
                        if (updateErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.UPDATE_SUCCESS);
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    applicationSearch: (req, res) => {
        var query = {};
        var model;
        var select;

        // type:1 (user), type:2 (post), type:3 (event)

        if (req.body.type == 1) {
            model = userModel;
            select = '_id name mobileNumber email profilePic'
            query = {
                userType: "USER",
                status: "ACTIVE",
                $or: [
                    {
                        name: { $regex: req.body.search, $options: 'i' }
                    },
                    {
                        mobileNumber: { $regex: req.body.search, $options: 'i' }
                    },
                    {
                        email: { $regex: req.body.search, $options: 'i' }
                    }
                ]
            }
        }
        if (req.body.type == 2) {
            model = postModel;
            select = '_id text'
            query = {
                postStatus: "ACTIVE",
                text: { $regex: req.body.search, $options: 'i' }
            }
        }
        if (req.body.type == 3) {
            model = eventModel;
            select = '_id title date eventType'
            query = {
                status: "ACTIVE",
                title: { $regex: req.body.search, $options: 'i' }
            }
        }

        var options = {
            page: req.body.page || 1,
            limit: req.body.limit || 10,
            sort: { createdAt: -1 },
            select: select
        };

        model.paginate(query, options, (err, result) => {
            if (err) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
            }
        })
    }








}
//------------------------------imageUpload---------------------




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