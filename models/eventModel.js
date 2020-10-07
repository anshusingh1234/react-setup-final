const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const schema = mongoose.Schema;
const eventModel = new schema({
    eventTitle: {
        type: String

    },
    userId: {
        type: schema.Types.ObjectId,
        ref: "user"
    },
    name: {
        type: String
    },
    profilePic: {
        type: String
    },
    eventCategoryName: {
        type: String
    },
    categoryImage: {
        type: String
    },
    // participant: [String],
    participant: [
        {
            participantId: {
                type: schema.Types.ObjectId,
                ref: "user"
            },
            name: {
                type: String
            },
            profilePic: {
                type: String
            }
        }
    ],
    eventCategoryId: {
        type: String

    },
    privacy: {
        type: Number
    },
    // privacy: {
    //     type: String,
    //     enum: ["OnlySelectedFriends"-4, "FriendsOfFriends"-3, "Friends"-2,"Public"-1],
    //     default: "Public"
    // },
    timeLine: [String],
    eventType: {
        type: String,
        enum: ["OUTDOOR", "ORDER FOOD", "OFFLINE", "ONLINE_GENERAL", "ONLINE_ANTAKSHRI"],
        //default: ""
    },
    onlineEventType: {
        type: String,
        enum: ["VIDEO_MEET", "LIVE_STREAM"],
        //default: ""
    },
    description: String,
    Address: String,
    date: {
        type: String
    },
    defaultImage: {
      type: String
    },
    time: {
        type: String
    },
    expiryDate: {
        type: String
    },
    refree: {
        type: String
    },
    refreePic: {
        type: String
    },
    suggestedThinkingTime: {
        type: String
    },
    votingSystem: {
        type: String
    },
    // createdDate:{
    //     type:String,
    //     default:new Date().toLocaleDateString()
    //     //new Date().getDate()  + "-" + (new Date().getMonth()+1) + "-" + new Date().getFullYear()
    // },

    location: {
        type: {
            default: "point",
            type: String,
        },

        coordinates: [Number]
    },
    joinRequest: [{
        type: schema.Types.ObjectId,
        ref: "user"
    }],
    invite: {
        type: String,
        //enum: ["Anyone", "Boy's Meetup", "Girly catch up", "Couples"],
        //default: ''
    },
    title: {
        type: String
    },
    MaxPersonCapacity: String,
    pricePerPerson: String,
    seeEvent: [String],
    image: [],
    video: [],
    temp_key: {
        type: String
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'BLOCK', 'DELETE', 'CANCEL'],
        default: 'ACTIVE'
    }
},
    { timestamps: true })
eventModel.index({ location: "2dsphere" });
eventModel.plugin(mongoosePaginate);
eventModel.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("event", eventModel)





