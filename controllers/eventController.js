const userModel = require('../models/userModel');
const eventModel = require('../models/eventModel');
const joinRequestModel = require('../models/joinRequestModel');
const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { SuccessMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');
const { SuccessCode } = require('../helper/statusCode');
const commonFunction = require('../helper/commonFunction')
const mongoose = require("mongoose")
const notificationModel = require('../models/notificationModel')
const roomModel = require('../models/roomModel')
var multiparty = require("multiparty");
const eventCategoryModel = require('../models/eventCategoryModel')
const bcrypt = require("bcrypt-nodejs");
const _ = require("lodash")

var jwt = require('jsonwebtoken');


module.exports = {



    /**
   * Function Name :createEvent
   * Description   : Create post by user
   *
   * @return response
  */

    createEvent: (req, res) => {
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
                    var hour = req.body.time.match(/(\d+)/);
                    var hours = parseInt(hour[0])
                    var newDate = new Date(req.body.date)
                    newDate.setHours(newDate.getHours() + hours)
                    console.log(newDate)
                    var completeDate = newDate;
                    req.body.expiryDate = completeDate.toISOString()

                    if (req.body.eventType == "OFFLINE") {
                        var event = {
                            userId: result._id,
                            profilePic: result.profilePic,
                            name: result.name,
                            eventType: req.body.eventType,
                            eventCategoryId: req.body.eventCategoryId,
                            title: req.body.title,
                            participant: req.body.participant,
                            date: req.body.date,
                            time: req.body.time,
                            expiryDate: req.body.expiryDate,
                            description: req.body.description,
                            eventCategoryName: req.body.eventCategoryName,
                            categoryImage: req.body.categoryImage,
                            invite: req.body.invite,
                            pricePerPerson: req.body.pricePerPerson,
                            location: {
                                type: "Point",
                                coordinates: [parseFloat(req.body.lat), parseFloat(req.body.long)]
                            }
                        }
                        if (req.body.privacy == 2) {
                            console.log("i am in", result.friends)
                            event.privacy = 2
                            event.timeLine = []
                            result.friends.forEach(x => {
                                event.timeLine.push(x.friendId)
                            })
                        }
                        if (req.body.privacy == 4) {
                            event.privacy = 4
                            event.timeLine = []
                            req.body.participant.forEach(x => {
                                event.timeLine.push(x.participantId)
                            })
                        }
                        if (req.body.privacy == 3) {
                            var rest = await friendsData()
                            function friendsData() {
                                return new Promise((resolve, reject) => {
                                    event.privacy = 3
                                    event.timeLine = []
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
                                                                resolve(event.timeLine)
                                                            }

                                                        })
                                                    }
                                                    else {
                                                        console.log("No friendsss");
                                                        friend.push(e.friendId)
                                                        resolve(event.timeLine)
                                                    }
                                                })
                                                friend = friend.filter(Boolean)
                                                //console.log("lasttttttttt",friend)
                                                friendOfFriends = friendOfFriends.filter(Boolean)
                                                //console.log("lasttttttttt",friendOfFriends)
                                                data = friend.concat(friendOfFriends)
                                                event.timeLine.push(...data)
                                                console.log("hjjjjj/stjh", event.timeLine)
                                                resolve(event.timeLine)
                                            }
                                            else {
                                                console.log("No friends");
                                                friend = [];
                                                friendOfFriends = []
                                                event.timeLine = [];
                                                resolve(event.timeLine)
                                            }


                                        })
                                })
                            }


                            event.timeLine = rest

                        }
                        // if (req.body.privacy == 3) {
                        //     var rest = await friendsData()
                        //     function friendsData() {
                        //         return new Promise((resolve, reject) => {
                        //             event.privacy = 3
                        //             event.timeLine = []
                        //             var data = []
                        //             console.log("i am in dataaaa", data)

                        //             userModel.
                        //                 findOne({ _id: req.headers._id, status: "ACTIVE" }).
                        //                 populate({
                        //                     path: 'friends.friendId',
                        //                     // Get friends of friends - populate the 'friends' array for every friend
                        //                     populate: { path: 'friends.friendId' }
                        //                 }).exec(function (err, result) {
                        //                     //console.log("hhhhhhhhhhhh", result)
                        //                     var friend = [], friendOfFrieds = []
                        //                     result.friends.map(e => {

                        //                         e.friendId.friends.map(elem => {
                        //                             friend.push(elem.friendId._id)

                        //                             elem.friendId.friends.map(el => {
                        //                                 friendOfFrieds.push(el.friendId._id)
                        //                             })

                        //                         })
                        //                     })
                        //                     friend = friend.filter(Boolean)
                        //                     console.log("lasttttttttt", friend)
                        //                     friendOfFrieds = friendOfFrieds.filter(Boolean)
                        //                     data = friend.concat(friendOfFrieds)
                        //                     event.timeLine.push(...data)
                        //                     console.log("hjjjjj/stjh", event.timeLine)
                        //                     resolve(event.timeLine)
                        //                 })
                        //         })
                        //     }
                        //     event.timeLine = rest
                        // }
                        eventModel.create(event, async (error, eventData) => {
                            console.log("gagagagg", error, eventData)
                            if (error) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, eventData, SuccessMessage.EVENT_CREATED)
                            }
                        })
                    }
                    else if (req.body.eventType == "ONLINE_GENERAL") {
                        var event1 = {
                            userId: result._id,
                            name: result.name,
                            profilePic: result.profilePic,
                            eventType: "ONLINE_GENERAL",
                            onlineEventType: req.body.onlineEventType,
                            title: req.body.title,
                            participant: req.body.participant,
                            description: req.body.description,
                            date: req.body.date,
                            time: req.body.time,
                            expiryDate: req.body.expiryDate,
                            location: {
                                type: "Point",
                                coordinates: [parseFloat(req.body.lat = 00000), parseFloat(req.body.long = 0000)]
                            }

                        }

                        if (req.body.privacy == 2) {
                            console.log("i am in", result.friends)
                            event1.privacy = 2
                            event1.timeLine = []
                            result.friends.forEach(x => {
                                event1.timeLine.push(x.friendId)
                            })
                        }
                        if (req.body.privacy == 4) {
                            event1.privacy = 4
                            event1.timeLine = []
                            req.body.participant.forEach(x => {
                                event1.timeLine.push(x.participantId)
                            })
                        }
                        if (req.body.privacy == 1) {
                            event1.privacy = 1

                        }
                        if (req.body.privacy == 3) {
                            var rest = await friendsData()
                            function friendsData() {
                                return new Promise((resolve, reject) => {
                                    event1.privacy = 3
                                    event1.timeLine = []
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
                                                                resolve(event1.timeLine)
                                                            }

                                                        })
                                                    }
                                                    else {
                                                        console.log("No friendsss");
                                                        friend.push(e.friendId)
                                                        resolve(event1.timeLine)
                                                    }
                                                })
                                                friend = friend.filter(Boolean)
                                                //console.log("lasttttttttt",friend)
                                                friendOfFriends = friendOfFriends.filter(Boolean)
                                                //console.log("lasttttttttt",friendOfFriends)
                                                data = friend.concat(friendOfFriends)
                                                event1.timeLine.push(...data)
                                                console.log("hjjjjj/stjh", event1.timeLine)
                                                resolve(event1.timeLine)
                                            }
                                            else {
                                                console.log("No friends");
                                                friend = [];
                                                friendOfFriends = []
                                                event1.timeLine = [];
                                                resolve(event1.timeLine)
                                            }

                                        })
                                })
                            }

                            event1.timeLine = rest

                        }
                        eventModel.create(event1, async (error, eventData) => {
                            //console.log("gagagagg", error, eventData)
                            if (error) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, eventData, SuccessMessage.EVENT_CREATED)
                            }
                        })

                    }
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    /**
   * Function Name :editEvent
   * Description   : edit event by host
   *
   * @return response
  */

    editEvent: (req, res) => {
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

                    eventModel.findOne({ _id: req.body.eventId, userId: result._id, status: "ACTIVE" }, async (error, eventData) => {
                        console.log("i am in post", error, eventData)
                        if (error) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!eventData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                        }
                        else {
                            var set = {}
                            if (req.body.description) {
                                set["description"] = req.body.description
                            }
                            if (req.body.eventCategoryId) {
                                set["eventCategoryId"] = req.body.eventCategoryId
                            }
                            if (req.body.location) {
                                set["location"] = req.body.location
                            }
                            if (req.body.pricePerPerson) {
                                set["pricePerPerson"] = req.body.pricePerPerson
                            }
                            if (req.body.participant) {
                                set["participant"] = req.body.participant
                            }
                            if (req.body.privacy) {
                                set["privacy"] = req.body.privacy
                            }
                            eventModel.findOneAndUpdate({ _id: req.body.eventId, status: { $ne: "DELETE" } }, { $set: set }, { new: true }, async (updateErr, updateData) => {
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
    /**
* Function Name :editEvent
* Description   : edit event by host
*
* @return response
*/

    editOnlineEvent: (req, res) => {
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

                    eventModel.findOne({ _id: req.body.eventId, userId: result._id, status: "ACTIVE" }, async (error, eventData) => {
                        console.log("i am in post", error, eventData)
                        if (error) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!eventData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                        }
                        else {
                            var set = {}
                            if (req.body.title) {
                                set["title"] = req.body.title
                            }
                            if (req.body.eventCategoryId) {
                                set["eventCategoryId"] = req.body.eventCategoryId
                            }
                            if (req.body.location) {
                                set["location"] = req.body.location
                            }
                            if (req.body.pricePerPerson) {
                                set["pricePerPerson"] = req.body.pricePerPerson
                            }
                            if (req.body.participant) {
                                set["participant"] = req.body.participant
                            }
                            if (req.body.privacy) {
                                set["privacy"] = req.body.privacy
                            }
                            if (req.body.date) {
                                set["date"] = req.body.date
                            }
                            if (req.body.time) {
                                set["time"] = req.body.time
                                var hour = req.body.time.match(/(\d+)/);
                                var hours = parseInt(hour[0])
                                var newDate = new Date(req.body.date)
                                newDate.setHours(newDate.getHours() + hours)
                                console.log(newDate)
                                var completeDate = newDate;
                                set["expiryDate"] = completeDate.toISOString()
                            }


                            eventModel.findOneAndUpdate({ _id: req.body.eventId, status: { $ne: "DELETE" } }, { $set: set }, { new: true }, async (updateErr, updateData) => {
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
    /**
         * Function Name :deleteEvent
         * Description   : own event delete by user
         *
         * @return response
        */
    deleteEvent: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                console.log("i am in user", UserErr, userData)
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } else {
                    eventModel.findOneAndUpdate({ _id: req.body.eventId, userId: userData._id, status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true }, (eventErr, eventData) => {
                        if (eventErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else {
                            response(res, SuccessCode.SUCCESS, [eventData], SuccessMessage.EVENT_DELETE);
                        }
                    })
                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    addEventCategory: (req, res) => {
        userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
            console.log("i am in user", UserErr, userData)
            if (UserErr) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            } else if (!userData) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            } else {
                eventCategoryModel.findOne({ eventCategoryName: req.body.eventCategoryName, status: { $ne: "DELETE" } }, async (error, eventCategory) => {
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
                        obj.save((saveError, save) => {
                            if (saveError) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, save, SuccessMessage.DATA_SAVED)
                            }
                        })
                        //*********************Function for profile pic upload *************************************/
                        function convertImage() {
                            return new Promise((resolve, reject) => {
                                commonFunction.uploadImage(req.body.image, (imageError, upload) => {
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
                })
            }
        })
    },

    /**
         * Function Name :eventCategoryList
         * Description   : event Category List of seen by user
         *
         * @return response
        */
    eventCategoryList: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE", userType: "USER" }, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    var query = {};
                    var options = {
                        page: req.body.pageNumber || 1,
                        sort: { createdAt: -1 },
                        limit: req.body.limit || 5
                    };
                    eventCategoryModel.paginate(query, options, (err, paginateData) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, paginateData, SuccessMessage.DETAIL_GET)

                        }
                    })
                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },
    /**
             * Function Name :cancelEvent
             * Description   : own event cancle by host
             *
             * @return response
            */
    cancelEvent: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                console.log("i am in user", UserErr, userData)
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } else {
                    eventModel.findOneAndUpdate({ _id: req.body.eventId, userId: userData._id, status: "ACTIVE" }, { $set: { status: "CANCEL" } }, { new: true }, (eventErr, eventData) => {
                        if (eventErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else {
                            response(res, SuccessCode.SUCCESS, [eventData], SuccessMessage.EVENT_DELETE);
                        }
                    })
                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },


    joinEventRequest: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                console.log("i am in user", UserErr, userData)
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } else {
                    eventModel.findOne({ _id: req.body.eventId, status: "ACTIVE" }, (eventErr, eventData) => {
                        if (eventErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else if (!eventData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        } else {
                            // var event = {
                            //     requestedId: userData._id,
                            //     eventId: eventData._id,
                            //     status: "PENDING"
                            // }
                            eventModel.findOneAndUpdate({ _id: req.body.eventId, status: "ACTIVE" }, { $addToSet: { joinRequest: userData._id } }, { new: true }, (updateErr, updateData) => {
                                // var lastItem = updateData.joinRequest.pop();
                                //console.log("kskkskskkksksksk",updateErr,lastItem._id)
                                //return
                                if (updateErr) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                } else {
                                    joinRequestModel.findOne({ userId: userData._id, eventId: eventData._id, eventHostedBy: eventData.userId, status: "ACTIVE" }, (joinErr, joinResult) => {
                                        if (joinErr) {
                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                        }
                                        else if (joinResult) {
                                            joinRequestModel.findOneAndUpdate({ _id: joinResult._id }, { $set: { requestStatus: "PENDING" } }, { new: true }, (updateError, updateResult) => {
                                                if (updateError) {
                                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                }
                                                else {
                                                    if (userData.deviceToken == "null") {
                                                        var notification = new notificationModel({
                                                            userId: eventData.userId,
                                                            joinId: userData._id,
                                                            eventId: eventData._id,
                                                            eventTitle: eventData.title,
                                                            eventImage: eventData.image[0],
                                                            eventType: eventData.eventType,
                                                            date: eventData.date,
                                                            messege: `${userData.name} sent join request.`,
                                                            joinRequest: "PENDING",
                                                            requestFor: "EVENT"
                                                        })
                                                        notification.save((saveErr, savedData) => {
                                                            if (saveErr) {
                                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                                                            }
                                                            else {
                                                                response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.EVENT_JOIN_REQUEST);

                                                            }
                                                        })
                                                    }
                                                    else {
                                                        // commonFunction.pushNotification(userData.deviceToken, `${userData.name} sent join request.`, "join", (notificationErr, notificationResult) => {
                                                        //     if (notificationErr) {
                                                        //         console.log(">>>>>>>2655", notificationErr);
                                                        //     }
                                                        //     else {
                                                        var notification1 = new notificationModel({
                                                            userId: eventData.userId,
                                                            joinId: userData._id,
                                                            eventId: eventData._id,
                                                            eventTitle: eventData.title,
                                                            eventImage: eventData.image[0],
                                                            eventType: eventData.eventType,
                                                            date: eventData.date,
                                                            messege: `${userData.name} sent join request.`,
                                                            joinRequest: "PENDING",
                                                            requestFor: "EVENT"
                                                        })
                                                        notification1.save((saveErr, savedData) => {
                                                            if (saveErr) {
                                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                                                            }
                                                            else {
                                                                response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.EVENT_JOIN_REQUEST);

                                                            }
                                                        })
                                                        //     }
                                                        // }) 
                                                    }
                                                }
                                            })
                                        }
                                        else {
                                            var obj2 = {
                                                userId: userData._id,
                                                eventId: eventData._id,
                                                eventHostedBy: eventData.userId,
                                                eventTitle: eventData.title,
                                                eventImage: eventData.image[0],
                                                eventType: eventData.eventType,
                                                date: eventData.date
                                            };
                                            new joinRequestModel(obj2).save((saveErr, saveResult) => {
                                                if (saveErr) {
                                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                                }
                                                else {
                                                    if (userData.deviceToken == "null") {
                                                        var notification = new notificationModel({
                                                            userId: eventData.userId,
                                                            joinId: userData._id,
                                                            eventId: eventData._id,
                                                            eventTitle: eventData.title,
                                                            eventImage: eventData.image[0],
                                                            eventType: eventData.eventType,
                                                            date: eventData.date,
                                                            messege: `${userData.name} sent join request.`,
                                                            joinRequest: "PENDING",
                                                            requestFor: "EVENT"
                                                        })
                                                        notification.save((saveErr, savedData) => {
                                                            if (saveErr) {
                                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                                                            }
                                                            else {
                                                                response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.EVENT_JOIN_REQUEST);

                                                            }
                                                        })
                                                    }
                                                    else {
                                                        // commonFunction.pushNotification(userData.deviceToken, `${userData.name} sent join request.`, "join", (notificationErr, notificationResult) => {
                                                        //     if (notificationErr) {
                                                        //         console.log(">>>>>>>2655", notificationErr);
                                                        //     }
                                                        //     else {
                                                        var notification1 = new notificationModel({
                                                            userId: eventData.userId,
                                                            joinId: userData._id,
                                                            eventId: eventData._id,
                                                            eventTitle: eventData.title,
                                                            eventImage: eventData.image[0],
                                                            eventType: eventData.eventType,
                                                            date: eventData.date,
                                                            messege: `${userData.name} sent join request.`,
                                                            joinRequest: "PENDING",
                                                            requestFor: "EVENT"
                                                        })
                                                        notification1.save((saveErr, savedData) => {
                                                            if (saveErr) {
                                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                                                            }
                                                            else {
                                                                response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.EVENT_JOIN_REQUEST);

                                                            }
                                                        })
                                                        //     }
                                                        // }) 
                                                    }
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

    cancelEventRequest: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    eventModel.findOne({ _id: req.body.eventId, status: "ACTIVE" }, (eventErr, eventResult) => {
                        if (eventErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!eventResult) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorCode.NOT_FOUND);
                        }
                        else {
                            eventModel.findOneAndUpdate({ _id: eventResult._id }, { $pull: { joinRequest: result._id } }, { new: true }, (updateErr, updateResult) => {
                                console.log("731", updateErr, updateResult)
                                if (updateErr) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    joinRequestModel.remove({ userId: result._id, eventId: eventResult._id, eventHostedBy: eventResult.userId, status: "ACTIVE" }, (err2, result2) => {
                                        if (err2) {
                                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                        }
                                        else {
                                            response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.EVENT_CANCEL_REQUEST);
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

    //--------------------------------------VVVVv----------
    latestV2: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                console.log("i am in user", UserErr, userData)
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } else {
                    eventModel.findOne({ _id: req.body.eventId, status: "ACTIVE" }, (eventErr, eventData) => {
                        if (eventErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else if (!eventData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        } else {
                            var event = {
                                requestedId: userData._id,
                                eventId: eventData._id,
                                status: "PENDING"
                            }
                            eventModel.findOneAndUpdate({ _id: req.body.eventId, status: "ACTIVE" }, { $push: { joinRequest: event } }, { new: true }, (updateErr, updateData) => {
                                var lastItem = updateData.joinRequest.pop();
                                //console.log("kskkskskkksksksk",updateErr,lastItem._id)
                                //return
                                if (updateErr) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                } else if (!updateData) {
                                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                                } else {
                                    // commonFunction.pushNotification(userData.deviceToken, `${userData.name} sent join request.`, "join", (notificationErr, notificationResult) => {
                                    //     if (notificationErr) {
                                    //         console.log(">>>>>>>2655", notificationErr);
                                    //     }
                                    //     else {
                                    var notification = new notificationModel({
                                        userId: userData._id,
                                        joinId: lastItem._id,
                                        eventId: eventData._id,
                                        eventTitle: eventData.title,
                                        eventImage: eventData.image[0],
                                        eventType: eventData.eventType,
                                        date: eventData.date,
                                        messege: `${userData.name} sent join request.`,
                                        joinRequest: "PENDING",
                                        requestFor: "EVENT"
                                    })
                                    notification.save((saveErr, savedData) => {
                                        if (saveErr) {
                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);

                                        }
                                        else {
                                            response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.EVENT_JOIN_REQUEST);

                                        }
                                    })
                                    //     }
                                    // })

                                    // response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.EVENT_JOIN_REQUEST);
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
* Function Name :createAntakshriEvent
* Description   : Create post by user
*
* @return response
*/
    createAntakshriEvent: (req, res) => {
        //console.log("immmmmmmmmmm11",req.body)
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, async (err, result) => {
                // console.log("JDJJFJ", err, result)

                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {

                    var event = {
                        userId: result._id,
                        name: result.name,
                        refreePic: result.profilePic,
                        profilePic: result.profilePic,
                        temp_key: "101",// this for uniqueness  while getting list of all events
                        eventType: "ONLINE_ANTAKSHRI",
                        title: req.body.title,
                        participant: req.body.participant,
                        date: req.body.date,
                        time: req.body.time,
                        refree: req.body.refree,
                        suggestedThinkingTime: req.body.suggestedThinkingTime,
                        votingSystem: req.body.votingSystem,
                        location: {
                            type: "Point",
                            coordinates: [parseFloat(req.body.lat = 00000), parseFloat(req.body.long = 0000)]
                        }

                    }

                    if (req.body.privacy == 2) {
                        console.log("i am in", result.friends)
                        event.privacy = 2
                        event.timeLine = []
                        result.friends.forEach(x => {
                            event.timeLine.push(x.friendId)
                        })
                    }
                    if (req.body.privacy == 4) {
                        event.privacy = 4
                        event.timeLine = []
                        req.body.participant.forEach(x => {
                            event.timeLine.push(x.participantId)
                        })
                    }
                    if (req.body.privacy == 3) {
                        var rest = await friendsData()
                        function friendsData() {
                            return new Promise((resolve, reject) => {
                                event.privacy = 3
                                event.timeLine = []
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
                                                            resolve(event.timeLine)
                                                        }

                                                    })
                                                }
                                                else {
                                                    console.log("No friendsss");
                                                    friend.push(e.friendId)
                                                    resolve(event.timeLine)
                                                }
                                            })
                                            friend = friend.filter(Boolean)
                                            //console.log("lasttttttttt",friend)
                                            friendOfFriends = friendOfFriends.filter(Boolean)
                                            //console.log("lasttttttttt",friendOfFriends)
                                            data = friend.concat(friendOfFriends)
                                            event.timeLine.push(...data)
                                            console.log("hjjjjj/stjh", event.timeLine)
                                            resolve(event.timeLine)
                                        }
                                        else {
                                            console.log("No friends");
                                            friend = [];
                                            friendOfFriends = []
                                            event.timeLine = [];
                                            resolve(event.timeLine)
                                        }

                                    })
                            })
                        }
                        event.timeLine = rest
                    }
                    eventModel.create(event, async (error, eventData) => {
                        console.log("gagagagg", error, eventData)
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, eventData, SuccessMessage.EVENT_CREATED)
                        }
                    })

                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },


    // createAntakshriEvent: (req, res) => {
    //     //console.log("immmmmmmmmmm11",req.body)
    //     try {
    //         userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, async (err, result) => {
    //            // console.log("JDJJFJ", err, result)

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

    //                 var event = {
    //                     userId: result._id,
    //                     name:result.name,
    //                     refreePic:result.profilePic,
    //                     profilePic:result.profilePic,
    //                     temp_key: "101",// this for uniqueness  while getting list of all events
    //                     eventType: "ONLINE_ANTAKSHRI",
    //                     image: imageUrl,
    //                     video: videoUrl,
    //                     title: req.body.title,
    //                     participant: req.body.participant,
    //                     date: req.body.date,
    //                     time: req.body.time,
    //                     refree: req.body.refree,
    //                     suggestedThinkingTime: req.body.suggestedThinkingTime,
    //                     votingSystem: req.body.votingSystem

    //                 }

    //                 if (req.body.privacy == "Friends") {
    //                     console.log("i am in", result.friends)
    //                     event.privacy = "Friends"
    //                     event.timeLine = []
    //                     result.friends.forEach(x => {
    //                         event.timeLine.push(x.friendId)
    //                     })
    //                 }
    //                 if (req.body.privacy == "Friends of Friends") {
    //                     event.privacy = "Friends of Friends"
    //                     event.timeLine = req.body.friendId;
    //                 }
    //                 if (req.body.privacy == "Only Seleted friends") {
    //                     event.privacy = "Only Seleted friends"
    //                     event.timeLine = req.body.friendId

    //                 }
    //                 if (req.body.privacy == "ONLYME") {
    //                     event.privacy = "ONLYME"
    //                 }

    //                 eventModel.create(event, async (error, eventData) => {   
    //                     console.log("gagagagg", error, eventData)
    //                     if (error) {
    //                         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //                     }
    //                     else {
    //                         response(res, SuccessCode.SUCCESS, eventData, SuccessMessage.EVENT_CREATED)
    //                     }
    //                 })


    //                 //*************************function for image upload*****************************/

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
    //                         commonFunction.multipleVideoUploadCloudinary(req.body.video, (videoErr, uploadData) => {
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

    acceptRejectJoinRequest: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE", userType: "USER" }, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    userModel.findOne({ _id: req.body.joinId, status: "ACTIVE" }, (joinErr, joinResult) => {
                        if (joinErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!joinResult) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                        }
                        else {
                            eventModel.findOne({ _id: req.body.eventId, userId: userData._id, status: "ACTIVE" }, (eventError, eventData) => {
                                if (eventError) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                } else if (!eventData) {
                                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                }
                                else {
                                    if (req.body.response == "ACCEPT") {
                                        console.log("KDJDHD333333H", eventData.participant.length)
                                        if (eventData.participant.length <= 10) {
                                            var obj = {
                                                participantId: req.body.joinId,
                                                name: joinResult.name,
                                                profilePic: joinResult.profilePic
                                            };
                                            eventModel.findOneAndUpdate({ _id: req.body.eventId }, { $pull: { joinRequest: req.body.joinId }, $push: { participant: obj } }, { new: true }, (updateError, updateData) => {
                                                console.log("1126", updateError, updateData)
                                                if (updateError) {
                                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                }
                                                else {
                                                    var notification = new notificationModel({
                                                        userId: joinResult._id,
                                                        senderId: userData._id,
                                                        eventId: eventData._id,
                                                        eventTitle: eventData.title,
                                                        eventImage: eventData.image[0],
                                                        eventType: eventData.eventType,
                                                        date: eventData.date,
                                                        messege: `${userData.name} accepted your request.`,
                                                        joinRequest: "ACCEPT",
                                                        requestFor: "STATUSEVENTREQUEST"
                                                    })
                                                    notification.save((saveErr, savedData) => {
                                                        console.log("1143", saveErr, savedData)
                                                        if (saveErr) {
                                                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                        }
                                                        else {
                                                            notificationModel.findOneAndUpdate({ _id: req.body.notificationId, status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true }, (deleteErr, deleteResult) => {
                                                                if (deleteErr) {
                                                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                                }
                                                                else {
                                                                    joinRequestModel.update({ userId: joinResult._id, eventId: eventData._id, eventHostedBy: eventData.userId, status: "ACTIVE" }, { $set: { requestStatus: "ACCEPT" } }, { new: true }, (err2, result2) => {
                                                                        console.log("1153", err2, result2)
                                                                        if (err2) {
                                                                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                                                        }
                                                                        else {
                                                                            response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.EVENT_JOIN_ACCEPT);
                                                                        }
                                                                    })
                                                                }
                                                            })

                                                        }
                                                    })

                                                }
                                            })

                                        }
                                        else {
                                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.EVENT_LIMIT);
                                        }
                                    }

                                    else {
                                        eventModel.findOneAndUpdate({ _id: req.body.eventId }, { $pull: { joinRequest: req.body.joinId } }, { new: true }, (updateError, updateData) => {
                                            if (updateError) {
                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else {
                                                var notification = new notificationModel({
                                                    userId: joinResult._id,
                                                    senderId: userData._id,
                                                    eventId: eventData._id,
                                                    eventTitle: eventData.title,
                                                    eventImage: eventData.image[0],
                                                    eventType: eventData.eventType,
                                                    date: eventData.date,
                                                    messege: `${userData.name} rejected your request.`,
                                                    joinRequest: "REJECT",
                                                    requestFor: "STATUSEVENTREQUEST"
                                                })
                                                notification.save((saveErr, savedData) => {
                                                    if (saveErr) {
                                                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                    }
                                                    else {
                                                        notificationModel.findOneAndUpdate({ _id: req.body.notificationId, status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true }, (deleteErr, deleteResult) => {
                                                            if (deleteErr) {
                                                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                                            }
                                                            else {
                                                                joinRequestModel.update({ userId: joinResult._id, eventId: eventData._id, eventHostedBy: eventData.userId, status: "ACTIVE" }, { $set: { requestStatus: "REJECT" } }, { new: true }, (err2, result2) => {
                                                                    if (err2) {
                                                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                                                    }
                                                                    else {
                                                                        response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.EVENT_JOIN_REJECT);
                                                                    }
                                                                })
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
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },


    notificationList: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, userType: "USER" }, (error, userData) => {
                console.log("dhdgddgdg", error, userData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    var query = { userId: userData._id, status: "ACTIVE" };

                    req.query.page = parseInt(req.query.page);
                    req.query.limit = parseInt(req.query.limit);
                    var options = {
                        page: req.query.page || 1,
                        limit: req.query.limit || 10,
                        sort: { createdAt: -1 }
                    };

                    notificationModel.paginate(query, options, (notificationErr, notificationData) => {
                        console.log("dhdgdd7777777gdg", notificationErr, notificationData)
                        if (notificationErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            var result = notificationData.docs;
                            var total = notificationData.total;
                            var limit = notificationData.limit;
                            var page = notificationData.page;
                            var pages = notificationData.pages;

                            return res.send({ response_code: 200, response_message: "Requested data found", result, total, limit, page, pages })
                            // response(res, SuccessCode.SUCCESS, data, SuccessMessage.DATA_FOUND);

                        }
                    })
                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },

    offlineEventList: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, userType: "USER" }, (error, userData) => {
                console.log("dhdgddgdg", error, userData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    var options = {
                        page: req.body.pageNumber || 1,
                        limit: req.body.limit || 10,
                        sort: { createdAt: -1 }
                    };
                    eventModel.paginate({ eventType: "OFFLINE" }, options, (eventErr, eventData) => {
                        if (eventErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, eventData, SuccessMessage.DATA_FOUND);

                        }
                    })
                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },
    myEventList: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, userType: "USER" }, (error, userData) => {
                console.log("dhdgddgdg", error, userData)
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    var options = {
                        page: req.body.pageNumber || 1,
                        limit: req.body.limit || 10,
                        sort: { createdAt: -1 }
                    };
                    eventModel.paginate({ userId: userData._id }, options, (eventErr, eventData) => {
                        if (eventErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, eventData, SuccessMessage.DATA_FOUND);

                        }
                    })
                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },
    /**
* Function Name :viewEvent
* Description   : viewEvent by user
*
* @return response
*/

    viewEvent: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, userType: "USER" }, (error, userData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    var isRequested = false;
                    var isParticipant = false;
                    var joinRequest = []
                    eventModel.findOne({ _id: req.params._id, status: "ACTIVE" }).populate('joinRequest', 'name profilePic _id').exec((eventErr, eventData) => {
                        console.log("1249", eventData, eventErr)
                        if (eventErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            // console.log("1442", eventData.userId = userData._id)
                            if (eventData.joinRequest.map(el => el._id).includes(userData._id)) {
                                isRequested = true;
                            }
                            if (eventData.participant.map(el => el.participantId).includes(userData._id)) {
                                isParticipant = true;
                            }
                            if (eventData.userId == req.headers._id) {
                                console.log("1450")
                                joinRequest = eventData.joinRequest
                            }
                            var data2 = {
                                isRequested: isRequested,
                                isParticipant: isParticipant,
                                location: eventData.location,
                                timeLine: eventData.timeLine,
                                seeEvent: eventData.seeEvent,
                                image: eventData.image,
                                video: eventData.video,
                                status: eventData.status,
                                _id: eventData._id,
                                userId: eventData.userId,
                                name: eventData.name,
                                profilePic: eventData.profilePic,
                                eventType: eventData.eventType,
                                title: eventData.title,
                                participant: eventData.participant,
                                description: eventData.description,
                                date: eventData.date,
                                time: eventData.time,
                                expiryDate: eventData.expiryDate,
                                joinRequest: joinRequest,
                                createdAt: eventData.createdAt,
                                updatedAt: eventData.updatedAt,
                                MaxPersonCapacity: eventData.MaxPersonCapacity,
                                pricePerPerson: eventData.pricePerPerson,
                                invite: eventData.invite,
                                privacy: eventData.privacy,
                                eventCategoryName: eventData.eventCategoryName,
                                categoryImage: eventData.categoryImage,
                                eventCategoryId: eventData.eventCategoryId,
                                onlineEventType: eventData.onlineEventType,
                                refree: eventData.refree,
                                refreePic: eventData.refreePic,
                                suggestedThinkingTime: eventData.suggestedThinkingTime,
                                votingSystem: eventData.votingSystem

                            };
                            response(res, SuccessCode.SUCCESS, data2, SuccessMessage.DATA_FOUND);

                        }
                    })
                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },
    /**
* Function Name :createRoom
* Description   : Create Room by user
*
* @return response
*/

    createRoom: (req, res) => {
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

                    var room = {
                        title: req.body.title,
                        gender: req.body.gender,
                        ageRange: req.body.ageRange,
                        joinStatus: true

                    }
                    roomModel.create(room, (error, roomData) => {
                        console.log("iam", error, roomData)
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, roomData, SuccessMessage.VIDEO_CALL)
                        }
                    })
                }
            })
        }
        catch (error) {
            console.log("i am in catch", error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    /**
   * Function Name :editAntakshri
   * Description   : edit event by host
   *
   * @return response
  */

    editAntakshri: (req, res) => {
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
                    eventModel.findOne({ _id: req.body.eventId, eventType: "ONLINE_ANTAKSHRI", userId: result._id, status: "ACTIVE" }, async (error, eventData) => {
                        console.log("i am in post", error, eventData)
                        if (error) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!eventData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                        }
                        else {
                            var set = {}
                            if (req.body.title) {
                                set["title"] = req.body.title
                            }
                            if (req.body.date) {
                                set["date"] = req.body.date
                            }
                            if (req.body.time) {
                                set["time"] = req.body.time
                            }
                            if (req.body.suggestedThinkingTime) {
                                set["suggestedThinkingTime"] = req.body.suggestedThinkingTime
                            }
                            if (req.body.votingSystem) {
                                set["votingSystem"] = req.body.votingSystem
                            }
                            if (req.body.refree) {
                                set["refree"] = req.body.refree
                            }
                            if (req.body.participant) {
                                set["participant"] = req.body.participant
                            }
                            if (req.body.privacy) {
                                set["privacy"] = req.body.privacy
                            }
                            eventModel.findOneAndUpdate({ _id: req.body.eventId, status: { $ne: "DELETE" } }, { $set: set }, { new: true }, async (updateErr, updateData) => {
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





    // networkEventList: (req, res) => {
    //     userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, async (err, result) => {
    //         console.log("JDJJFJ", err, result)
    //         if (err) {
    //             response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
    //         }
    //         else if (!result) {
    //             response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
    //         }
    //         else {
    //             let options = {
    //                 page: req.body.pageNumber || 1,
    //                 limit: req.body.limit || 10,
    //                 sort: {
    //                     createdAt: -1
    //                 },
    //             }
    //             eventModel.find({ timeLine: { $in: req.headers._id }, eventType:{$in:["ONLINE_ANTAKSHRI","ONLINE_GENERAL"]},privacy: { $in: [2,3,4] },options, status: "ACTIVE" }, (err2, result2) => {
    //                         if(err2){
    //                             response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
    //                         }
    //                         else if(result2.docs.length==0){
    //                             response(res, SuccessCode.SUCCESS, SuccessMessage.NOT_FOUND)
    //                         }
    //                         else{
    //                            response(res, SuccessCode.SUCCESS, result2, SuccessMessage.DATA_FOUND)


    //                         }

    //                     })

    //         }
    //     })
    // },
    networkEventList: (req, res) => {
        try {
            //console.log("gdgdgd",req.headers,req.query)
            var data = []
            var output = []
            var todayDate = new Date().toISOString();
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, async (UserErr, userData) => {
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }

                else {
                    var myEvent = await eventModel.find({ userId: userData._id, status: "ACTIVE", date: { $gte: todayDate }, eventType: { $in: ["ONLINE_ANTAKSHRI", "ONLINE_GENERAL"] } });

                    eventModel.find({ privacy: 1, status: "ACTIVE", date: { $gte: todayDate }, eventType: { $in: ["ONLINE_ANTAKSHRI", "ONLINE_GENERAL"] } }, async (eventErr, eventData) => {
                        console.log(">>>>>>>>>>>12", eventData)
                        if (eventErr) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else {
                            //response(res, SuccessCode.SUCCESS, postData, SuccessMessage.DETAIL_GET);
                            eventModel.find({ timeLine: { $in: req.headers._id }, eventType: { $in: ["ONLINE_ANTAKSHRI", "ONLINE_GENERAL"] }, date: { $gte: todayDate }, privacy: { $in: [2, 3, 4] }, status: "ACTIVE" }, async (err2, result2) => {
                                console.log(">>>>>>>>>>>>>>>11", err2, result2)
                                if (err2) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else if (!result2) {
                                    console.log("immmmmmm in first>>>>>>>>", eventData)
                                    data.push(...eventData, ...myEvent)
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
                                        response_message: "Event list are...", eventData: { docs }, page: page, limit: limit, TotalPage: Math.ceil(length / limit)
                                    })
                                        : res.send({ response_code: 404, response_message: "No event available" });
                                    return response(res, SuccessCode.SUCCESS, SuccessMessage.DETAIL_GET);
                                }
                                else if (result2) {
                                    data = eventData.concat(result2, myEvent)
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
                                        response_message: "Event list are...", result: { docs }, page: page, limit: limit, TotalPage: Math.ceil(length / limit)
                                    })
                                        : res.send({ response_code: 404, response_message: "No event available" });

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
    uploadImageAndVideo: async (req, res) => {
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
                    var form = new multiparty.Form();
                    //console.log("reqqqqqqqqqqq",req)
                    form.parse(req, async (error, field, files) => {
                        //console.log("the uploading information....", files);
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                        }
                        else {
                            console.log("the uploading information....", files);
                            var set = {}
                            if (files.image) {
                                var imgArray = files.image.map((item) => (item.path))
                                // console.log(">>>>>>>>>>>>>>>>>>>>>>>11",imgArray)
                                function convertImage() {
                                    return new Promise((resolve, reject) => {
                                        // console.log("in promise",imgArray)
                                        commonFunction.multipleImageUploadCloudinary(imgArray, (imageError, upload) => {
                                            // console.log("i m in cloudinary",imageError,upload)
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
                                            // console.log("i am in video",videoErr,uploadData)
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
                                // console.log(">>>>>>>44",files.image)
                                set["image"] = await convertImage()
                                // console.log(">>>>>>>>>>>>>55",set.image)
                            }
                            if (files.video) {
                                set["video"] = await convertVideo()
                            }
                            // console.log("im set",set)

                            eventModel.findOneAndUpdate({ _id: req.headers.media_id }, { $set: set }, { new: true }, async (updateErr, updateData) => {
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
            console.log("i m in catch", error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

        }
    },
    // test:(req, res) => {
    //     userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, async(err, result) => {
    //         console.log("JDJJFJ", err, result)
    //         if (err) {
    //             response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
    //         }
    //         else if (!result) {
    //             response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
    //         }
    //         else {
    //             var form = new multiparty.Form();
    //             form.parse(req, (error, field, files) => {
    //                 console.log("the uploading information....",files);
    //                 if (error) {
    //                     response( res, ErrorCode.SOMETHING_WRONG,[], ErrorMessage.SOMETHING_WRONG);
    //                 }
    //                 else{
    //                     let imgArray =files.image.map((item)=>(item.path))
    //                     console.log("i mmmm",imgArray)
    //                     commonFunction.multipleImageUploadCloudinary( imgArray,(imgErr,imgData)=>{
    //                         console.log("i am here",imgErr,imgData)
    //                         if(imgErr){
    //                             response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //                         }
    //                         else{
    //                             var event1 = {
    //                                 userId: result._id,
    //                                 eventType: "ONLINE_GENERAL",
    //                                 image: imgData
    //                             }
    //                             eventModel.create(event1, async (error1, eventData) => {
    //                                 console.log("gagagagg", error, eventData)
    //                                 if (error1) {
    //                                     response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
    //                                 }
    //                                 else {
    //                                     response(res, SuccessCode.SUCCESS, eventData, SuccessMessage.EVENT_CREATED)
    //                                 }
    //                             })

    //                         }
    //                     })




    //                 //*************************function for image upload*****************************/

    //                 }
    //         })
    //     }
    //     })
    // },

    joinEventRequestList: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (err, result) => {
                console.log("JDJJFJ", err, result)

                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    eventModel.findOne({ _id: req.body.eventId, userId: result._id, status: "ACTIVE" }, (eventErr, eventData) => {
                        if (eventErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!eventData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        }
                        else {
                            var arr = eventData.joinRequest
                            var arr1 = [];
                            var arr2 = [];
                            arr.forEach(x => {
                                console.log("3290>>>>>>>>>>>", x);
                                if (x.status == "PENDING") {
                                    arr1.push(x.requestedId);
                                    arr2.push(x._id);
                                }
                            });
                            let options = {
                                page: req.body.pageNumber || 1,
                                limit: req.body.limit || 5,
                                sort: {
                                    createdAt: -1
                                }
                            }
                            userModel.paginate({ _id: arr1 }, options, (err1, success11) => {
                                if (err1) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                } else {
                                    var result1 = {
                                        joinRequestedUserId: arr1,
                                        requestedId: arr2,
                                        joinRequest: arr

                                    };
                                    response(res, SuccessCode.SUCCESS, result1, SuccessMessage.DATA_FOUND000);
                                }
                            }
                            );
                        }
                    })


                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
    titleSearch: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (err, result) => {
                console.log("JDJJFJ", err, result)

                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    if (req.query.title) {
                        var query = { title: new RegExp('^' + req.query.title, "i"), status: "ACTIVE" }
                    }
                    var options = {
                        page: req.body.pageNumber || 1,
                        limit: req.body.limit || 10,
                        select: "title"
                    }
                    eventModel.paginate(query, options, (error, titleData) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        } else {
                            response(res, SuccessCode.SUCCESS, titleData, SuccessMessage.DATA_FOUND);
                        }
                    })
                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    getEventList: (req, res) => {
        try {
            // var aggregate;
            //   if (req.body.search) {
            //     aggregate = eventModel.aggregate([{
            //       $geoNear: {
            //         near: { type: "Point", coordinates: [parseFloat(req.body.lat), parseFloat(req.body.long)] },
            //         distanceField: "dist.calculated",
            //         maxDistance: 1000 * 5,//(1000*kms)
            //         spherical: true
            //       },
            //     },
            //     { $match: { title: new RegExp('^' + req.body.search, "i") } }
            //     ])
            //   }
            //else {
            var aggregate = eventModel.aggregate([{
                "$geoNear": {
                    "near": {
                        type: "Point",
                        // coordinates: [parseFloat(req.body.lat), parseFloat(req.body.long)]
                    },
                    // "maxDistance": 100*10,
                    "distanceField": "dist.calculated",
                    // "includeLocs": "dist.location",
                    // "spherical": true
                }
            }])
            //}
            var options = {
                page: 1,
                limit: 2,
                sort: { createdAt: -1 }
            }
            eventModel.aggregatePaginate(aggregate, options, (err, result, pageCount, count) => {
                console.log("SDDZXXXXC", err, result, pageCount, count)
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    res.send({ responseCode: 200, responseMessage: "Event found successfully", result, pageCount, count });
                }
            })
        }
        catch (error) {
            // console.log("DDDDD",error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    eventHosted: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (err, userData) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    eventModel.find({ userId: userData._id }, (error, eventData) => {
                        if (error) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (eventData.length == 0) {
                            res.send({response_code:404,response_message:"You have not hosted any event yet."})
                        }
                        else {
                            var upcoming = []
                            var previous = []
                            var date1 = new Date().toISOString();
                            console.log(">>>>date", date1)
                            eventData.forEach((p) => {
                                if (date1 <= p.date) {
                                    if (p.status == "ACTIVE") {
                                        upcoming.push({ _id: p._id, title: p.title, date: p.date, image: p.image[0], status: "PLANNED" })
                                    }
                                    if (p.status == "CANCEL") {
                                        upcoming.push({ _id: p._id, title: p.title, date: p.date, image: p.image[0], status: "CANCELLED" })
                                    }

                                }
                                else if (date1 >= p.date && date1 <= p.expiryDate) {
                                    if (p.status == "ACTIVE") {
                                        upcoming.push({ _id: p._id, title: p.title, date: p.date, image: p.image[0], status: "LIVE" })
                                    }
                                }
                                else {
                                    if (p.status == "ACTIVE") {
                                        previous.push({ _id: p._id, title: p.title, date: p.date, image: p.image[0], status: "COMPLETED" })

                                        // previous.push(p.title, p.image[0], p.status = "COMPLETED")
                                    }
                                    if (p.status == "CANCEL") {
                                        previous.push({ _id: p._id, title: p.title, date: p.date, image: p.image[0], status: "CANCELLED" })

                                    }
                                    //previous.push(p.title,p.status)
                                }
                            })
                            var result = { upcoming, previous }
                            response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                        }
                    })
                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }

    },

    requestBooking: (req, res) => {
        try {
            var upcoming = [];
            var previous = [];
            var currentDate = new Date().toISOString();

            joinRequestModel.find({ eventHostedBy: req.headers._id, status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    result.forEach((e) => {
                        if (currentDate <= e.date) {
                            if (e.requestStatus == "PENDING") {
                                upcoming.push({ _id: e._id, eventId: e.eventId, title: e.eventTitle, eventType: e.eventType, date: e.date, image: e.eventImage, status: "WAITING" })
                            }
                            if (e.requestStatus == "ACCEPT") {
                                upcoming.push({ _id: e._id, eventId: e.eventId, title: e.eventTitle, eventType: e.eventType, date: e.date, image: e.eventImage, status: "ACCEPTED" })
                            }
                            if (e.requestStatus == "REJECT") {
                                upcoming.push({ _id: e._id, eventId: e.eventId, title: e.eventTitle, eventType: e.eventType, date: e.date, image: e.eventImage, status: "DENIED" })
                            }
                            if (e.requestStatus == "CANCEL") {
                                upcoming.push({ _id: e._id, eventId: e.eventId, title: e.eventTitle, eventType: e.eventType, date: e.date, image: e.eventImage, status: "CANCELLED" })
                            }
                            if (e.requestStatus == "WITHDRAW") {
                                upcoming.push({ _id: e._id, eventId: e.eventId, title: e.eventTitle, eventType: e.eventType, date: e.date, image: e.eventImage, status: "WITHDRAWN" })
                            }
                        }
                        else {
                            if (e.requestStatus == "PENDING") {
                                previous.push({ _id: e._id, eventId: e.eventId, title: e.eventTitle, eventType: e.eventType, date: e.date, image: e.eventImage, status: "WAITING" })
                            }
                            if (e.requestStatus == "ACCEPT") {
                                previous.push({ _id: e._id, eventId: e.eventId, title: e.eventTitle, eventType: e.eventType, date: e.date, image: e.eventImage, status: "COMPLETED" })
                            }
                            if (e.requestStatus == "REJECT") {
                                previous.push({ _id: e._id, eventId: e.eventId, title: e.eventTitle, eventType: e.eventType, date: e.date, image: e.eventImage, status: "DENIED" })
                            }
                            if (e.requestStatus == "CANCEL") {
                                previous.push({ _id: e._id, eventId: e.eventId, title: e.eventTitle, eventType: e.eventType, date: e.date, image: e.eventImage, status: "CANCELLED" })
                            }
                            if (e.requestStatus == "WITHDRAW") {
                                previous.push({ _id: e._id, eventId: e.eventId, title: e.eventTitle, eventType: e.eventType, date: e.date, image: e.eventImage, status: "WITHDRAWN" })
                            }
                        }
                    })
                    var data = { upcoming, previous }
                    response(res, SuccessCode.SUCCESS, data, SuccessMessage.DATA_FOUND);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    withdrawRequest: (req, res) => {
        try {
            joinRequestModel.findOne({ _id: req.body._id, eventId: req.body.eventId, eventHostedBy: req.headers._id, requestStatus: "ACCEPT", status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    joinRequestModel.update({ _id: result._id }, { $set: { requestStatus: "WITHDRAW" } }, { new: true }, (requestErr, requestResult) => {
                        if (requestErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            eventModel.findOneAndUpdate({ _id: result.eventId }, { $pull: { participant: { participantId: result.userId } } }, { new: true }, (updateErr, updateResult) => {
                                if (updateErr) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, [], SuccessMessage.EVENT_WITHDRAW);
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

    cancelRequest: (req, res) => {
        try {
            joinRequestModel.findOne({ _id: req.body._id, eventId: req.body.eventId, eventHostedBy: req.headers._id, requestStatus: "PENDING", status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    joinRequestModel.update({ _id: result._id }, { $set: { requestStatus: "CANCEL" } }, { new: true }, (requestErr, requestResult) => {
                        if (requestErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            eventModel.findOneAndUpdate({ _id: result.eventId }, { $pull: { joinRequest: result.userId } }, { new: true }, (updateErr, updateResult) => {
                                if (updateErr) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, [], SuccessMessage.EVENT_REQUEST_CANCEL);
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

    nearByEvents: (req, res) => {
        try {
            console.log("i am in req", req)
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (err, result) => {
                console.log("JDJJFJ", err, result)

                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    var aggregate = eventModel.aggregate([{

                        "$geoNear": {
                            "near": {
                                type: "Point",
                                coordinates: [parseFloat(req.body.lat), parseFloat(req.body.long)]
                            },
                            "maxDistance": 30000,
                            "distanceField": "dist.calculated",
                            "includeLocs": "dist.location",
                            "spherical": true
                        }
                    },
                    { $match: { status: "ACTIVE" } },
                    {
                        $project: {
                            _id: 1,
                            location: 1,
                            title: 1,
                            image: 1
                        }
                    },
                    ])
                    var options = {
                        page: 1,
                        limit: 10
                    }
                    eventModel.aggregatePaginate(aggregate, options, (eventErr, eventData, pageCount, count) => {
                        console.log("i am in result", eventErr, eventData)
                        if (eventErr) {

                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            res.send({ response_code: 200, response_message: "Data found successfully", eventData, pageCount, count })
                        }
                    })
                }
            })

        }
        catch (error) {
            console.log("i am in catch", error)
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },
    eventAttended: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (err, userData) => {
                //console.log("i am in userData",err,userData)
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    // friends: { $elemMatch: { friendId: friendData.friendId } }
                    eventModel.find({ participant: { $elemMatch: { participantId: userData._id } } }, (error, eventData) => {
                        console.log("i am hereeee", eventData)
                        if (error) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            var previous = []
                            var today = new Date();
                            var dd = today.getDate();
                            if (dd < 10) {
                                dd = '0' + dd;
                            }
                            var time = new Date();
                            var tt = time.getHours()
                            if (tt < 10) {
                                tt = '0' + tt;
                            }
                            eventData.forEach((p) => {
                                if (p.date.slice(0, 2) > dd) {
                                    if (p.status == "ACTIVE") {
                                        upcoming.push({ _id: p._id, title: p.title, date: p.date, image: p.image[0], status: "PLANNED" })
                                    }

                                }
                                else {
                                    if (p.status == "ACTIVE") {
                                        previous.push({ _id: p._id, title: p.title, date: p.date, image: p.image[0], status: "COMPLETED" })

                                    }
                                    if (p.status == "CANCLE") {
                                        previous.push({ _id: p._id, title: p.title, date: p.date, image: p.image[0], status: "CANCLED" })

                                    }
                                }
                            })

                            //console.log("SSHSHSGSGSGSGS", upcoming)
                            var result = previous
                            response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                        }
                    })
                }
            })
        } catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }

    },
    myEvents: (req, res) => {
        try {
            userModel.findOne({ _id: req.headers._id, status: "ACTIVE" }, (UserErr, userData) => {
                if (UserErr) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                } else if (!userData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                } else {
                    var date = new Date().toISOString();
                    var query = { userId: userData._id, status: "ACTIVE", expiryDate: { $lte: date } };
                    var options = {
                        page: req.body.pageNumber || 1,
                        limit: req.body.limit || 10,
                        sort: { createdAt: -1 }
                    };

                    eventModel.paginate(query, options, (err, result) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                        }
                    })
                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    test: (req, res) => {
        userModel.findOne({ _id: req.body.userId, status: "ACTIVE" }, (err, userResult) => {
            //console.log("JDJJFJ", err, result)
            if (err) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            } else if (result.length == 0) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
            } else {
                userModel.findOne({ _id: req.headers_id, status: { $ne: "DELETE" } }, (userErr, userResult) => {
                    if (userErr) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    } else if (!userResult) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {

                        eventModel.paginate(query, options, (err, result) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (result.docs.length == 0) {
                                response(res, ErrorCode.NOT_FOUND, ErrorMessage.NOT_FOUND);
                            }
                            else {
                                console.log(">>>>>>>2670", saveResult);
                            }
                        })
                    }
                })

            }
        })

    },

    eventList: (req, res) => {
        eventModel.find({ privacy: "public", eventType: { $in: ["ONLINE_ANTAKSHRI", "ONLINE_GENERAL"] }, status: "ACTIVE" }, (err, result) => {
            if (err) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            } else if (result.length == 0) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
            } else {
                userModel.findOne({ _id: req.body.userId, status: { $ne: "DELETE" } }, (userErr, userResult) => {
                    if (userErr) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                    } else if (!userResult) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {
                        var arr = [];
                        var count = 0;
                        // var events = [];
                        userResult.friends.forEach((elem, index) => {
                            userModel.findOne({ _id: elem.friendId, status: { $ne: "DELETE" } }, (userErr2, userResult2) => {
                                if (userErr2) {
                                    console.log("err2", err2)
                                }
                                else {
                                    // var friendsOfFriends = userResult2.friends.map(o > o.friendId);
                                    // console.log("2072", friendsOfFriends);
                                    // eventModel.find({ userId: { $in: friendsOfFriends }, privacy: "Friends of Friends" }, (err2, result2) => {
                                    //     if (err2) {
                                    //         console.log("err2", err2)
                                    //     }
                                    //     else {
                                    //         events = result2.map(t => t._id)
                                    //         console.log("2078", events);
                                    //     }
                                    // })
                                    eventModel.find({ userId: elem.friendId, eventType: { $in: ["ONLINE_ANTAKSHRI", "ONLINE_GENERAL"] }, privacy: "Friends", status: "ACTIVE" }, (err2, result2) => {
                                        if (err2) {
                                            console.log("err2", err2)
                                        }
                                        else {
                                            userResult2.friends.forEach((e, i) => {
                                                eventModel.find({ userId: e.friendId, privacy: "Friends of Friends", eventType: { $in: ["ONLINE_ANTAKSHRI", "ONLINE_GENERAL"] }, status: "ACTIVE" }, (err3, result3) => {
                                                    if (err2) {
                                                        console.log("err3", err3)
                                                    }
                                                    else {
                                                        arr = result.concat(result2, result3);
                                                        console.log("2094", arr)
                                                        count = count + 1;
                                                        if (count == userResult.friends.length) {
                                                            arr = result.concat(result2, result3);
                                                            console.log("2098", arr)
                                                            response(res, SuccessCode.SUCCESS, arr, SuccessMessage.DATA_FOUND);
                                                        }
                                                    }
                                                })
                                            })

                                        }
                                    })
                                }
                            })
                        })
                    }
                })
            }
        })
    },

    completedEventsList: (req, res) => {
        try {
            var date = new Date().toISOString();
            eventModel.find({ status: "ACTIVE", expiryDate: { $lte: date } }, (err, result) => {
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


}


