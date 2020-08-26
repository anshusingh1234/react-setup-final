const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema;
var postSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    // tagFriends: [
    //     Schema.Types.ObjectId
    // ],
    tagFriends: [
        {
            friendId: {
                type: Schema.Types.ObjectId,
                ref: "user"
            },
            name:{
                type:String
            },
            profilePic:{
                type:String
            }
        }
    ],
    name:{
        type:String
    },
    profilePic:{
        type:String
    },
    text: {
        type: String
    },
   image:[],
   video:[],
    viewers: [String],
    poll: [{
        type: String
    }],
    sticker: [
        String
    ],
    feeling: {
        type: String
    },
    // cordinate: [Number],
    // location: {
    //     type:String,
    //     default:"Point",
    //     coordinates:[Number]
    // },
    location: {
        type: String
    },
    latitude: {
        type: String
    },
    longitude: {
        type: String
    },
    status:{
     type:String
    },
    // privacy: {
    //     type: String,
    //    enum: ["FriendsOfFriends"-3, "Friends"-2,"Public"-1],
    //     default: "Public"
    // },
    privacy:{
        type:Number
    },
    timeLine: [String],
    postStatus: {
        type: String,
        enum: ["ACTIVE", "DELETE"],
        default: "ACTIVE"
    },
    likes: [{
        likedId: {
            type: Schema.Types.ObjectId
        },
        userName: {
            type: String
        },
        userPic: {
            type: String
        },
        likeSymbol:{
            type:String
        }
    }],
    comments: [{
        commentedUser: {
            type: Schema.Types.ObjectId,
            ref: "user"
        },
        userName: {
            type: String
        },
        userPic: {
            type: String
        },
        comment: {
            type: String
        },
        commentedTime: {
            type: String,
        },
        isLike:{
        type:Boolean,
        default:false
        },
        replyComments: [{
            commentedUser: {
                 type: Schema.Types.ObjectId,
                 ref: "user"
            },
            userName: {
                 type: String
            },
            commentId: {
                 type: String
            },
            userPic: {
                 type: String
            },
            comment: {
                 type: String
            },
            commentedTime: {
                 type: String
            }
       }],
       likeOnComment: [{
        likedId: {
            type: Schema.Types.ObjectId
        },
        commentId: {
            type: String
       },
        userName: {
            type: String
        },
        userPic: {
            type: String
        },
        likeSymbol:{
            type:String
        }
    }],
    }],
//     replyComments: [{
//         commentedUser: {
//              type: Schema.Types.ObjectId,
//              ref: "user"
//         },
//         userName: {
//              type: String
//         },
//         commentId: {
//              type: String
//         },
//         userPic: {
//              type: String
//         },
//         comment: {
//              type: String
//         },
//         commentedTime: {
//              type: String
//         }
//    }],
//    likeOnComment: [{
//     likedId: {
//         type: Schema.Types.ObjectId
//     },
//     commentId: {
//         type: String
//    },
//     userName: {
//         type: String
//     },
//     userPic: {
//         type: String
//     },
//     likeSymbol:{
//         type:String
//     }
// }],

},

    { timestamps: true }
)

postSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("post", postSchema);





