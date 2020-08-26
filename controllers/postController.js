const userModel = require('../models/userModel');
const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { SuccessMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');
const { SuccessCode } = require('../helper/statusCode');
const commonFunction = require('../helper/commonFunction')
const mongoose = require("mongoose")
const postReportModel = require('../models/postReportModel')
var multiparty = require("multiparty");

const bcrypt = require("bcrypt-nodejs");
const _ = require("lodash")

var jwt = require('jsonwebtoken');
const postModel = require('../models/postModel');
const notificationModel = require('../models/notificationModel');



module.exports = {



    /**
   * Function Name :createPost
   * Description   : Create post by user
   *
   * @return response
  */

    createPost: async (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, async (err, result) => {
                //console.log("JDJJFJ", err, result)

                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {


                    var post = {
                        userId: result._id,
                        name: result.name,
                        profilePic: result.profilePic,
                        text: req.body.text,
                        tagFriends: req.body.tagFriends,
                        feeling: req.body.feeling,
                        activity: req.body.activity,
                        location: req.body.location
                    }
                    if (req.body.privacy == 2) {
                        console.log("i am in", result.friends)
                        post.privacy = 2
                        post.timeLine = []
                        result.friends.forEach(x => {
                            post.timeLine.push(x.friendId)
                        })
                    }
                    if (req.body.privacy == 1) {
                        post.privacy = 1
                    }
                    if (req.body.privacy == 3) {
                        var rest = await friendsData()
                        function friendsData() {
                            return new Promise((resolve, reject) => {
                                post.privacy = 3
                                post.timeLine = []
                                var data = []
                                // console.log("i am in dataaaa", data)

                                userModel.
                                    findOne({ _id: req.headers._id, status: "ACTIVE" }).
                                    populate({
                                        path: 'friends.friendId',
                                        // Get friends of friends - populate the 'friends' array for every friend
                                        populate: { path: 'friends.friendId' }
                                    }).exec(function (err, result) {
                                        //console.log("hhhhhhhhhhhh", result)
                                        var friend = [], friendOfFriends = []
                                        if (result.friends.length > 0) {
                                            result.friends.map(e => {
                                                if (e.friendId.friends.length > 0) {
                                                    e.friendId.friends.map(elem => {
                                                        friend.push(elem.friendId._id)
                                                        if (elem.friendId.friends.length > 0) {
                                                            elem.friendId.friends.map(el => {
                                                                friendOfFriends.push(el.friendId._id)
                                                            })
                                                        }
                                                        else {
                                                            console.log("No friends of friendsss")
                                                            friendOfFriends = [];
                                                            resolve(post.timeLine)
                                                        }

                                                    })
                                                }
                                                else {
                                                    console.log("No friendsss");
                                                    friend.push(e.friendId)
                                                    resolve(post.timeLine)
                                                }
                                            })
                                            friend = friend.filter(Boolean)
                                            //console.log("lasttttttttt",friend)
                                            friendOfFriends = friendOfFriends.filter(Boolean)
                                            //console.log("lasttttttttt",friendOfFriends)
                                            data = friend.concat(friendOfFriends)
                                            post.timeLine.push(...data)
                                            console.log("hjjjjj/stjh", post.timeLine)
                                            resolve(post.timeLine)
                                        }
                                        else {
                                            console.log("No friends");
                                            friend = [];
                                            friendOfFriends = []
                                            post.timeLine = [];
                                            resolve(post.timeLine)
                                        }


                                        // friend = friend.filter(Boolean)
                                        // //console.log("lasttttttttt",friend)
                                        // friendOfFriends = friendOfFriends.filter(Boolean)
                                        // //console.log("lasttttttttt",friendOfFriends)
                                        // data = friend.concat(friendOfFriends)
                                        // post.timeLine.push(...data)
                                        // console.log("hjjjjj/stjh", post.timeLine)
                                        // resolve(post.timeLine)

                                    })
                            })
                        }




                        post.timeLine = rest

                    }

                    // console.log("im in post",post)
                    postModel.create(post, async (error, postData) => {
                        console.log("shshshsh", error, postData);

                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, postData, SuccessMessage.POST_CREATED)
                        }
                    })

                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    uploadImageAndVideo: async (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, async (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    var form = new multiparty.Form();
                    form.parse(req, async (error, field, files) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                        }
                        else {
                            console.log("the uploading information....", files);
                            var set = {}
                            if (files.image) {
                                var imgArray = files.image.map((item) => (item.path))
                                function convertImage() {
                                    return new Promise((resolve, reject) => {
                                        commonFunction.multipleImageUploadCloudinary(imgArray, (imageError, upload) => {
                                            if (imageError) {
                                                console.log("Error uploading image")
                                            }
                                            else {
                                                resolve(upload)
                                            }
                                        })
                                    })
                                }
                            }
                            if (files.video) {
                                var videoArray = files.video.map((item) => (item.path))
                                function convertVideo() {
                                    return new Promise((resolve, reject) => {
                                        commonFunction.multipleVideoUploadCloudinary(videoArray, (videoErr, uploadData) => {
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

                            if (files.image) {
                                set["image"] = await convertImage()
                            }
                            if (files.video) {
                                set["video"] = await convertVideo()
                            }
                            postModel.findOneAndUpdate({ _id: req.headers.media_id }, { $set: set }, { new: true }, async (updateErr, updateData) => {
                                console.log("here in update", updateErr, updateData)
                                if (updateErr) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.EVENT_UPDATE);
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
    // createPost: (req, res) => {
    //     try {
    //         userModel.findOne({ _id: req.headers._id, status:"ACTIVE" }, async(err, result) => {
    //             console.log("JDJJFJ",err,result)

    //             if (err) {
    //                 response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
    //             }
    //             else if (!result) {
    //                 response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
    //             }
    //             else {
    //                 if (req.body.image) {
    //                     var imageUrl = await convertImage()
    //                 }
    //                 if (req.body.video) {
    //                     var videoUrl = await convertVideo()
    //                 }
    //                 var post = {
    //                     userId: result._id,
    //                     name:result.name,
    //                     profilePic:result.profilePic,
    //                     image: imageUrl,
    //                     video: videoUrl,
    //                     text: req.body.text,
    //                     tagFriends: req.body.tagFriends,
    //                     feeling:req.body.feeling,
    //                     activity:req.body.activity,
    //                     location:req.body.location
    //                 }
    //                 if (req.body.privacy == "Friends") {
    //                     console.log("i am in", result.friends)
    //                     post.privacy = "Friends"
    //                     post.timeLine = []
    //                     result.friends.forEach(x => {
    //                         post.timeLine.push(x.friendId)
    //                     })
    //                 }
    //                 if (req.body.privacy == "Friends of Friends") {
    //                     post.privacy = "Friends of Friends"
    //                     post.timeLine = req.body.friendId;
    //                 }
    //                 if (req.body.privacy == "Only Seleted friends") {
    //                     post.privacy = "Only Seleted friends"
    //                     post.timeLine = req.body.friendId

    //                 }
    //                 if (req.body.privacy == "ONLYME") {
    //                     post.privacy = "ONLYME"
    //                 }


    //                 postModel.create(post, async(error, postData) => {
    //                     if (error) {
    //                         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //                     }
    //                     else {
    //                         response(res, SuccessCode.SUCCESS,postData, SuccessMessage.POST_CREATED)                    }
    //                 })
    //                 //*********************Function for  pic upload *************************************/
    //                 function convertImage() {
    //                     return new Promise((resolve, reject) => {
    //                         commonFunction.multipleImageUploadCloudinary(req.body.image, (error, upload) => {
    //                             if (error) {
    //                                 console.log("Error uploading image")
    //                             }
    //                             else {
    //                                 resolve(upload)
    //                             }
    //                         })
    //                     })
    //                 }
    //                 //*************************function for video upload*****************************/
    //                 function convertVideo() {
    //                     return new Promise((resolve, reject) => {
    //                         commonFunction.multipleVideoUploadCloudinary(req.body.videoLink, (videoErr, uploadData) => {
    //                             console.log("i am in video")
    //                             if (videoErr) {
    //                                 console.log("error while video Uploading")
    //                             }
    //                             else {
    //                                 resolve(uploadData)
    //                             }
    //                         })
    //                     })
    //                 }
    //             }
    //         })
    //     }
    //     catch (error) {
    //         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    //     }
    // },

    /**
   * Function Name :editPost
   * Description   : edit post by user
   *
   * @return response
  */

    editPost: (req, res) => {
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

                    postModel.findOne({ _id: req.body.postId, userId: result._id, postStatus: "ACTIVE" }, async (error, postData) => {
                        console.log("i am in post", error, postData)
                        if (error) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!postData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                        }
                        else {
                            var set = {}
                            if (req.body.text) {
                                set["text"] = req.body.text
                            }
                            if (req.body.feeling) {
                                set["feeling"] = req.body.feeling
                            }
                            if (req.body.location) {
                                set["location"] = req.body.location
                            }
                            if (req.body.activity) {
                                set["activity"] = req.body.activity
                            }
                            if (req.body.tagFriends) {
                                set["tagfriends"] = req.body.tagFriends
                            }
                            if (req.body.privacy) {
                                set["privacy"] = req.body.privacy
                            }
                            postModel.findOneAndUpdate({ _id: req.body.postId, postStatus: { $ne: "DELETE" } }, { $set: set }, { new: true }, async (postErr, postUpdate) => {
                                if (postErr) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, postUpdate, SuccessMessage.EDIT_SUCC);
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
    viewPost: (req, res) => {
        userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (error, userData) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

            }
            else if (!userData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.MOBILE_NOT_FOUND);
            }
            else {
                postModel.findOne({ _id: req.params._id, postStatus: "ACTIVE" }, (PostError, postData) => {
                    console.log("jdfjfjf", PostError, postData)
                    if (PostError) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                    }
                    else if (!postData) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.MOBILE_NOT_FOUND);
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, postData, SuccessMessage.DATA_FOUND);
                    }
                })
            }
        })

    },



    /**
         * Function Name :postComment
         * Description   : like and comment on post by user
         *
         * @return response
        */

    postComment: (req, res) => {
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
                    postModel.findOneAndUpdate({ _id: req.body.postId, postStatus: "ACTIVE" }, { $push: { comments: comment } }, { new: true },
                        (error, success) => {
                            if (error) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                if (userData.deviceToken == null) {
                                    var obj = {
                                        userId: success._id,
                                        senderId: req.headers._id,
                                        title: "post on comment",
                                        body: `${userData.name} replied on your comment.`,
                                        // senderIdMessage: `${userData.name} replied on ${postResult.comments[0].commentedUser.name} comment`,
                                        notificationType: "Comment on post",
                                        requestFor: "COMMENT"
                                    };

                                    new notificationModel(obj).save((saveErr, saveResult) => {
                                        if (saveErr) {
                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                        }
                                        else {
                                            //console.log("post>>>>", postResult)
                                            response(res, SuccessCode.SUCCESS, success, SuccessMessage.POST_COMMENT);
                                        }
                                    }
                                    )

                                } else {
                                    commonFunction.pushNotification(userData.deviceToken, `${userData.name} post on your comment.`, "comment", (notificationErr, notificationResult) => {
                                        if (notificationErr) {
                                            console.log(">>>>>>>2655", notificationErr);
                                        }
                                        else {
                                            var obj = {
                                                userId: success._id,
                                                senderId: req.headers._id,
                                                title: "post on comment",
                                                body: `${userData.name} replied on your comment.`,
                                                // senderIdMessage: `${userData.name} replied on ${postResult.comments[0].commentedUser.name} comment`,
                                                notificationType: "Comment on post",
                                                requestFor: "COMMENT"
                                            };

                                            new notificationModel(obj).save((saveErr, saveResult) => {
                                                if (saveErr) {
                                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                }
                                                else {
                                                    //console.log("post>>>>", postResult)
                                                    response(res, SuccessCode.SUCCESS, success, SuccessMessage.POST_COMMENT);
                                                }
                                            }
                                            )
                                        }
                                    })
                                }

                                //response(res, SuccessCode.SUCCESS, success, SuccessMessage.POST_COMMENT);
                            }
                        }
                    )



                }
            })
        } catch (error) {
            res.send({ responseCode: 500, responseMessege: "Something went wrong" })
        }
    },
    /**
             * Function Name :hide post
             * Description   : hide post by user
             *
             * @return response
            */
    hidePost: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                console.log("i am in user", UserErr, userData)
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } else {
                    postModel.findOneAndUpdate({ _id: req.body.postId, postStatus: "ACTIVE" }, { $set: { postStatus: "HIDE" } }, { new: true }, (postErr, postData) => {
                        if (postErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else if (!postData) {

                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        } else {
                            response(res, SuccessCode.SUCCESS, [postData], SuccessMessage.HIDE_SUCCESS);
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

    postReport: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (error, userData) => {
                console.log("kkdkdkkk6733333333343", error, userData)

                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, result, ErrorMessage.NOT_FOUND)

                }
                else {
                    postModel.findOne({ _id: req.body.postId, postStatus: "ACTIVE" }, (err, result) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                        }
                        else if (!userData) {
                            response(res, ErrorCode.NOT_FOUND, result, ErrorMessage.NOT_FOUND)

                        }
                        else {
                            var obj = new postReportModel({
                                reportBy: userData._id,
                                postId: result._id,
                                reason: req.body.reason,
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

    /**
         * Function Name :edit comment
         * Description   : edit comment on post by user
         *
         * @return response
        */
    editComment: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    postModel.findOne({ _id: req.body.postId, postStatus: "ACTIVE" }, (err, postData) => {
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
                            console.log("hdhdhshsg44hgssgsg", editComments[0]._id)
                            //return

                            const newComment = {
                                _id: editComments[0]._id,
                                commentedUser: editComments[0].commentedUser,
                                comment: req.body.comment,
                                userName: editComments[0].userName,
                                userPic: editComments[0].userPic,
                                commentedTime: new Date()
                            }
                            postModel.findOneAndUpdate({ 'comments._id': req.body.commented, postStatus: "ACTIVE" }, { $set: { "comments.$": newComment } }, { new: true }, (updatedErr, updatedData) => {
                                if (updatedErr) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else if (!updatedData) {
                                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
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

    /**
         * Function Name :my post list
         * Description   : post list get by user
         *
         * @return response
        */
    myPostList: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } else {
                    let options = {
                        page: req.body.pageNumber || 1,
                        limit: req.body.limit || 5,
                        sort: {
                            createdAt: -1
                        },
                    }
                    postModel.paginate({ userId: userData._id }, options, (postErr, postData) => {
                        if (postErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else if (postData.length == 0) {

                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        } else {
                            response(res, SuccessCode.SUCCESS, [postData], SuccessMessage.DETAIL_GET);
                        }
                    })
                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
         * Function Name :delete post
         * Description   : own post delete by user
         *
         * @return response
        */
    deletePost: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                console.log("i am in user", UserErr, userData)
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } else {
                    postModel.findOneAndUpdate({ _id: req.body.postId, userId: userData._id, postStatus: "ACTIVE" }, { $set: { postStatus: "DELETE" } }, { new: true }, (postErr, postData) => {
                        console.log("i am in update", postErr, postData)
                        if (postErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else if (!postData) {

                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        } else {
                            response(res, SuccessCode.SUCCESS, [postData], SuccessMessage.POST_DELETE);
                        }
                    })
                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    /**
     * Function Name :like post
     * Description   : post like
     *
     * @return response
    */
    likeAndDislikePost: (req, res) => {
        try {
            if (req.body.like == "true") {
                userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, async (UserErr, userData) => {
                    if (UserErr) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    } else if (!userData) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    } else {
                        postModel.findOne({ _id: req.body.postId, postStatus: "ACTIVE" }, async (postErr, postData) => {
                            // postModel.findOne({ _id: req.body.postId, postStatus: "ACTIVE", likes: { $elemMatch: { likedId: userData._id } } }, (postErr, postData) => {
                            if (postErr) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            } else if (postData) {
                                var data = await postModel.findOne({ _id: postData._id, likes: { $elemMatch: { likedId: userData._id } } })
                                console.log("im in dataaaaa", data)
                                if (data) {
                                    let like = {
                                        likedId: userData._id,
                                        userName: userData.name,
                                        userPic: userData.profilePic,
                                        likeSymbol: req.body.likeSymbol
                                    };
                                    postModel.findOneAndUpdate({ _id: postData._id, postStatus: "ACTIVE" }, { $set: { likes: like } }, { new: true }, (error, success) => {
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
                                    postModel.findOneAndUpdate({ _id: req.body.postId, postStatus: "ACTIVE" }, { $push: { likes: like } }, { new: true }, (error, success) => {
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
                postModel.findOne({ _id: req.body.postId, postStatus: "ACTIVE", likes: { $elemMatch: { likedId: userData._id } } }, (err, success) => {
                    if (err) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    } else if (!success) {
                        return res.send({ responseCode: 404, responseMessage: "User havent liked yet" })
                    } else {
                        const dislike = _.filter(success.likes, _.matches({ likedId: userData._id }));
                        postModel.findByIdAndUpdate({ _id: req.body.postId }, { $pull: { likes: dislike[0] } }, { new: true }, (error, update) => {
                            if (error) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            } else if (!update) {
                                return res.send({ responseCode: 404, responseMessage: "Unable to update" })
                            } else {
                                response(res, SuccessCode.SUCCESS, [update], SuccessMessage.POST_DISLIKE);
                            }

                        })

                    }
                })
            }

        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    editPostComment: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    postModel.findOne({ _id: req.body.postId, postStatus: { $ne: "DELETE" } }, (err1, postData) => {
                        if (err1) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                        }
                        else if (!postData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.POST_NOT_FOUND);

                        }
                        else {
                            const editComments = _.filter(postData.comments, _.matches({ _id: mongoose.Types.ObjectId(req.body.commented) }));
                            console.log("fgfgf", editComments)
                            //return
                            const newComment = {
                                _id: editComments[0]._id,
                                commentedUser: editComments[0].commentedUser,
                                comment: req.body.comment,
                                userName: editComments[0].userName,
                                userPic: editComments[0].userPic,
                                commentedTime: new Date()
                            }
                            postModel.findOneAndUpdate({ 'comments._id': req.body.commented, postStatus: "ACTIVE" }, { $set: { "comments.$": newComment } }, { new: true }, (updateErr, updatedData) => {
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

    commentList: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                console.log("i am in user", UserErr, userData)
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } else {
                    postModel.findOne({ _id: req.params._id, postStatus: "ACTIVE" }, (postErr, postData) => {
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

    deleteComment: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    postModel.findOne({ _id: req.body.postId, postStatus: { $ne: "DELETE" } }, (err1, postData) => {
                        if (err1) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                        }
                        else if (!postData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.POST_NOT_FOUND);

                        }
                        else {
                            const deleteComments = _.filter(postData.comments, _.matches({ _id: mongoose.Types.ObjectId(req.body.commentId) }));
                            console.log("dddddd", deleteComments[0])
                            postModel.findOneAndUpdate({ _id: req.body.postId, postStatus: "ACTIVE" }, { $pull: { comments: deleteComments[0] } }, { new: true }, (updateErr, updatedData) => {
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
     * Function Name : post list
     * Description   : get post list by user
     *
     * @return response
    */
    postList: (req, res) => {
        try {
            //console.log("gdgdgd",req.headers,req.query)
            var data = []
            var output = []
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, async (UserErr, userData) => {
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }

                else {
                    var myPost = await postModel.find({ userId: userData._id, postStatus: "ACTIVE" });
                    postModel.find({ privacy: 1, postStatus: "ACTIVE" }, async (postErr, postData) => {
                        console.log("gdg4444444444444444444dgd", postErr, postData)
                        if (postErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else {
                            //response(res, SuccessCode.SUCCESS, postData, SuccessMessage.DETAIL_GET);
                            postModel.find({ timeLine: { $in: req.headers._id }, privacy: { $in: [2, 3] }, postStatus: "ACTIVE" }, async (err2, result2) => {
                                console.log(">>>>>>>>>>>>>>>11", err2, result2)
                                if (err2) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else if (result2.length == 0) {
                                    data.push(...postData, ...myPost)
                                    output = data.sort(function (a, b) { return b.createdAt - a.createdAt });
                                    var limit = req.body.limit || 5,
                                        length = output.length,
                                        page = req.body.pageNumber || 1;
                                    var doc = commonFunction.Paging(output, limit, page);
                                    var jsonObject = doc.map(JSON.stringify);


                                    var uniqueSet = new Set(jsonObject);
                                    var docs = Array.from(uniqueSet).map(JSON.parse);

                                    console.log("991", docs)
                                    length != 0 && page <= Math.ceil(length / limit) ? res.send({
                                        response_code: 200,
                                        response_message: "Post list found successfully", result: { docs }, page: page, limit: limit, TotalPage: Math.ceil(length / limit)
                                    })
                                        : res.send({ response_code: 404, response_message: "No post available" });
                                    // response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                                }
                                else {
                                    data = postData.concat(result2, myPost)
                                    output = data.sort(function (a, b) { return b.createdAt - a.createdAt });
                                    var limit = req.body.limit || 5,
                                        length = output.length,
                                        page = req.body.pageNumber || 1;
                                    var doc = commonFunction.Paging(output, limit, page);
                                    var jsonObject = doc.map(JSON.stringify);


                                    var uniqueSet = new Set(jsonObject);
                                    var docs = Array.from(uniqueSet).map(JSON.parse);

                                    console.log("1012", docs)
                                    length != 0 && page <= Math.ceil(length / limit) ? res.send({
                                        response_code: 200,
                                        response_message: "Post list found successfully", result: { docs }, page: page, limit: limit, TotalPage: Math.ceil(length / limit)
                                    })
                                        : res.send({ response_code: 404, response_message: "No post available" });

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
    // postList: (req, res) => {
    //     try {
    //         //console.log("gdgdgd",req.headers,req.query)
    //         userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
    //             if (UserErr) {
    //                 response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //             } else if (!userData) {
    //                 response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
    //             }

    //             else {
    //                 let options = {
    //                     page: req.body.pageNumber || 1,
    //                     limit: req.body.limit || 5,
    //                     sort: {
    //                         createdAt: -1
    //                     },
    //                 }
    //                 postModel.paginate({ postStatus: "ACTIVE" }, options, (postErr, postData) => {
    //                     console.log("gdg4444444444444444444dgd", postErr, postData)
    //                     if (postErr) {
    //                         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //                     } else if (postData.docs.length == 0) {
    //                         response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
    //                     } else {
    //                         response(res, SuccessCode.SUCCESS, postData, SuccessMessage.DETAIL_GET);
    //                     }
    //                 })
    //             }
    //         })
    //     } catch (error) {
    //         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    //     }
    // },

    /**
     * Function Name :user post list
     * Description   : get post list of user by user
     *
     * @return response
    */
    userPostList: (req, res) => {
        try {
            //console.log("gdgdgd",req.headers,req.query)
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                console.log("NFNCCCC", UserErr, userData)
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    userModel.findOne({ _id: req.body.userId, status: "ACTIVE" }, (error, result) => {
                        console.log("gdg8888888dgd", error, result)
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else if (!result) {
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
                            postModel.paginate({ userId: (result._id), postStatus: "ACTIVE" }, options, (postErr, postData) => {
                                console.log("gdg4444444444444444444dgd", postErr, postData)
                                if (postErr) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                } else {
                                    response(res, SuccessCode.SUCCESS, postData, SuccessMessage.DETAIL_GET);
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
    replyOnComment: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } else {
                    postModel.findOne({ _id: req.body.postId, "comments._id": req.body.commentId, postStatus: "ACTIVE" }).populate('comments.commentedUser').select({ 'comments.$._id': 1 }).exec((err, postResult) => {
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

                            //else{
                            // commonFunction.pushNotification(userData.deviceToken, `${userData.name} replied on your comment.`, "reply comment", (notificationErr, notificationResult) => {
                            //     if (notificationErr) {
                            //         console.log(">>>>>>>2655", notificationErr);
                            //     }
                            //     else {
                            var obj = {
                                userId: postResult.comments[0].commentedUser._id,
                                senderId: req.headers._id,
                                title: "Reply on comment",
                                body: `${userData.name} replied on ${postResult.comments[0].commentedUser.name} comment`,
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
                                    postModel.findOneAndUpdate({ "comments._id": req.body.commentId, postStatus: "ACTIVE" },
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
                            //}




                        }
                    })
                }
            })
        }
        catch (error) {
            res.send({ responseCode: 500, responseMessege: "Something went wrong" })
        }
    },

    deleteReplyComment: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    postModel.findOne({ _id: req.body.postId, postStatus: "ACTIVE" }, (err1, postData) => {
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
                            postModel.findOneAndUpdate({ "comments._id": req.body.commentId },
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


    updateReplyComment: (req, res) => {
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
                    postModel.findOne({ _id: req.body.postId, "comments.replyComments._id": req.body.replyId, postStatus: "ACTIVE" }).exec((err1, postData) => {
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
                                            postModel.findOneAndUpdate({ _id: postData._id, comments: { $elemMatch: { replyComments: { $elemMatch: { _id: updateKey._id } } } } }, { $set: { [`${set}`]: updateKey } }, { new: true }, (updateErr, updatedData) => {
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


    replyCommentLists: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                }
                // else if (!userData) {
                //     response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                // }
                else {
                    postModel.findOne({ _id: req.body.postId, postStatus: { $ne: "DELETE" } }, (err1, postData) => {
                        if (err1) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                        }
                        // else if (!postData) {
                        //     response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.POST_NOT_FOUND);
                        // }
                        else {
                            const editComments = _.filter(postData.comments, _.matches({ _id: mongoose.Types.ObjectId(req.body.commentId) }));
                            var like = editComments[0].likeOnComment.length
                            //Object.keys(member).length)
                            console.log("hdhdhshsg44hgssgsg", editComments[0].replyComments, editComments[0].comment, like)
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

    LikesOnComment: (req, res) => {
        try {
            console.log("shshshshshshsh", req.headers, req.body)
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } else {
                    if (req.body.like == "true") {
                        postModel.findOne({ _id: req.body.postId, postStatus: "ACTIVE" }, (err, postResult) => {
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
                                postModel.findOne({
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
                                        postModel.findOneAndUpdate({ "comments._id": req.body.commentId, postStatus: "ACTIVE" },
                                            { $push: { "comments.$.likeOnComment": like } },
                                            { new: true },
                                            (err3, result3) => {
                                                console.log("i am in>>>>>>1111108>>>", err3, result3)
                                                if (err3) {
                                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR)
                                                } else {
                                                    postModel.findOneAndUpdate({ 'comments._id': req.body.commentId, postStatus: "ACTIVE" }, { $set: { "comments.$.isLike": true } }, { new: true }, (updatedErr, updatedData) => {
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
                        postModel.findOne({ _id: req.body.postId, "comments._id": req.body.commentId, postStatus: "ACTIVE" }).populate('comments.likedId').select({ 'comments.$._id': 1 }).exec((err, postResult) => {
                            console.log(">>>>>>>5091", err, postResult);
                            if (err) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (!postResult) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                            }
                            else {
                                postModel.findOne({
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
                                        postModel.findOneAndUpdate({ 'comments._id': req.body.commentId, postStatus: "ACTIVE" }, { $set: { "comments.$.isLike": false } }, { new: true }, (updatedErr, updatedData) => {
                                            if (updatedErr) {
                                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else {
                                                const dislike = _.filter(postData.comments[0].likeOnComment
                                                    , _.matches({ likedId: userData._id }));
                                                console.log("i am in>>>>>>>>>", dislike[0])
                                                //return
                                                postModel.findOneAndUpdate({ "comments._id": req.body.commentId, postStatus: "ACTIVE" },
                                                    { $pull: { "likedId": userData._id } },
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

    testing: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }).populate({ path: 'friends.friendId', select: 'friends', populate: { path: 'friends.friendId', select: 'friends' } }).exec((err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    // postList: (req, res) => {
    //     postModel.find({ privacy: "public", postStatus: "ACTIVE" }, (err, result) => {
    //         console.log("immmmmmmmmm in post",err,result)
    //         if (err) {
    //             response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //         } else if (!result) {
    //             response(res, ErrorCode.NOT_FOUND, ErrorMessage.NOT_FOUND);
    //         } else {
    //             userModel.findOne({ _id: req.headers._id,status:"ACTIVE"}, (userErr, userResult) => {
    //                 console.log("immmm in user",userErr,userResult)
    //                 if (userErr) {
    //                     response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //                 } else if (!userResult) {
    //                     response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
    //                 }
    //                 else {
    //                     var arr = [];
    //                     var count = 0;
    //                     userResult.friends.forEach((elem, index) => {
    //                         userModel.findOne({ _id: elem.friendId, status: "ACTIVE" }, (userErr2, userResult2) => {
    //                             if (userErr2) {
    //                                 console.log("err2", err2)
    //                             }
    //                             else {
    //                                 postModel.find({ userId: elem.friendId, privacy: "Friends", postStatus: "ACTIVE" }, (err2, result2) => {
    //                                     if (err2) {
    //                                         console.log("err2", err2)
    //                                     }
    //                                     else {
    //                                         userResult2.friends.forEach((e, i) => {
    //                                             postModel.find({ userId: e.friendId, privacy: "Friends of Friends", postStatus: "ACTIVE" }, (err3, result3) => {
    //                                                 if (err3) {
    //                                                     console.log("err3", err3)
    //                                                 }
    //                                                 else {
    //                                                     arr = result.concat(result2, result3);
    //                                                     console.log("2094", arr)
    //                                                     count = count + 1;
    //                                                     if (count == userResult.friends.length) {
    //                                                         arr = result.concat(result2, result3);
    //                                                         console.log("2098", arr)
    //                                                         response(res, SuccessCode.SUCCESS, arr, SuccessMessage.DATA_FOUND);
    //                                                     }
    //                                                 }
    //                                             })
    //                                         })

    //                                     }
    //                                 })
    //                             }
    //                         })
    //                     })
    //                 }
    //             })
    //         }
    //     })
    // }

}
