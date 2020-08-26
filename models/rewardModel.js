const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

var rewardModel = new schema(
    {
        userId: {
            type: schema.Types.ObjectId,
            ref: "user"
        },
        reward: {
            type: String

        },
        countryCode: {
            type: String
        },
        adminId: {
            type: schema.Types.ObjectId,
            ref: "user"
        },
        name: {
            type: String

        },
        image: {
            type: String
        },
        rewardType: {
            type: String
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
            likeSymbol: {
                type: String
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
            isLike: {
                type: Boolean,
                default: false
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
                profilePic: {
                    type: String
                },
                images: [

                ],
                userName: {
                    type: String
                },
                userPic: {
                    type: String
                },
                likeSymbol: {
                    type: String
                }
            }],
        }],
        rewardAmount: { type: Number },
        comment: {
            type: String,
        },
        photo: { type: String },
        status: {
            type: String,
            enum: ["ACTIVE", "DELETE", "BLOCK"],
            default: "ACTIVE"
        }
    },
    {
        timestamps: true
    }
);

rewardModel.plugin(mongoosePaginate);
module.exports = mongoose.model("rewardModel", rewardModel);