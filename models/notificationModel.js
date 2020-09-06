const mongoose = require('mongoose');
const schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs')
var mongoosePaginate = require('mongoose-paginate');

var notificationModel = new schema({
    senderId: {
        type: schema.Types.ObjectId,
        ref: "USER"
    },
    userId: {
        type: schema.Types.ObjectId,
        ref: "USER"
    },
    requestedId: {
        type: schema.Types.ObjectId,
        ref: "USER"
    },
    friendRequestId: {
        type: schema.Types.ObjectId
    },
    eventId: {
        type: schema.Types.ObjectId,
        ref: "event"
    },
    eventTitle: {
        type: String
    },
    eventImage: {
        type: String
    },
    eventType: {
        type: String
    },
    date: {
        type: String
    },
    messege: {
        type: String
    },
    body: {
        type: String
    },
    joinId: {
        type: schema.Types.ObjectId,
        ref: "event"
    },
    joinRequest: {
        type: String,
        enum: ["PENDING", "ACCEPT", "REJECT"],
        //default:"ACTIVE"
    },
    requestFor: {
        type: String,
        enum: ["EVENT", "LIKE", "COMMENT", "POST", "FRIENDREQUEST", "ACCEPTFRIENDREQUEST", "REJECTFRIENDREQUEST", "STATUSEVENTREQUEST"]
    },
    requestType: {
        type: String,
        enum: ["REQUESTED", "ACCEPT"],
        //default:"ACTIVE"
    },
    notifications: {
        type: String
    },
    notificationType: {
        type: String
    },

    notificationStatus: {
        type: String,
        enum: ["ACCEPT", "PENDING", "REJECT"],
        default: "PENDING"
    },
    status: {
        type: String,
        enum: ["ACTIVE", "DELETE"],
        default: "ACTIVE"
    }

}, { timestamps: true });
notificationModel.plugin(mongoosePaginate);
module.exports = mongoose.model("notification", notificationModel); 