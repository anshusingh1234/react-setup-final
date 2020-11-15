const mongoose = require('mongoose');
const schema = mongoose.Schema;
const paginate = require("mongoose-paginate");
const aggregatePaginate = require('mongoose-aggregate-paginate');
var bcrypt = require('bcrypt-nodejs')

var userModel = new schema({
    deviceToken: {
        type: String,
        default: null
    },
    name: {
        type: String
    },
    surName: {
        type: String
    },
    countryId: {
        type: schema.Types.ObjectId,
        ref: "countryModel"
    },
    roleId: {
        type: schema.Types.ObjectId,
        ref: "role"
    },
    customerName: {
        type: String
    },
    image: [],
    userStatus: { type: String },
    phone: { type: String },
    countryName: { type: String },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    nickName: {
        type: String
    },
    isFirstTime: {
        type: Boolean,
        default: false
    },
    verifyStatus: {
        type: String,
        default: 'false'
    },
    email: {
        type: String,
        lowercase: true
    },
    gender: {
        type: String
    },
    otp: {
        type: String
    },
    otpTime: {
        type: Number,
        default: Date.now()
    },
    verifyOtp: {
        type: Boolean,
        default: false
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    address: {
        type: String
    },
    countryCode: {
        type: String
    },
    mobileNumber: {
        type: String
    },
    password: {
        type: String
    },
    profilePic: {
        type: String,
        default: null
    },
    backImage: {
        type: String,
        default: null
    },
    description: {

        type: String
    },
    aboutMe: {

        type: String
    },
    location: {

        type: String
    },
    profile: {
        type: String
    },
    age: {
        type: String
    },
    reward: {
        type: String,
        default: null
    },
    rewardStatus: {
        type: Boolean,
        default: false
    },
    isBookMark: {
        type: Boolean,
        default: false
    },
    intersts: [
        String
    ],
    favoriteFood: [
        String
    ],
    language: [
        String
    ],
    speak: [
        String
    ],
    favorite: [
        String
    ],
    blockedUser: [
        {
            userId: {
                type: schema.Types.ObjectId,
                ref: "user"
            },
            blockTime: {
                type: Date,
                default: Date.now()
            },
            name: {
                type: String
            },
            profilePic: {
                type: String
            },
            status: {
                type: String,
                enum: ["ACTIVE", "BLOCK", "DELETE"],
                default: "ACTIVE"
            }
        }
    ],
    profilePrivacy: {
        type: String,
        enum: ["PUBLIC", "FRIENDS", "FRIENDSEXCEPT", "SPECIFICFRIENDS", "ONLYME"],
        default: "PUBLIC"
    },
    friendList: [
        {
            friendId: {
                type: String
            }
        }
    ],
    friends: [
        {
            friendId: {
                type: schema.Types.ObjectId,
                ref: "user"
            },
            name: {
                type: String
            },
            profilePic: {
                type: String
            },
            addTime: {
                type: Date,
                default: Date.now()
            },
            status: {
                type: String,
                enum: ["ACTIVE", "BLOCK", "DELETE"],
                default: "ACTIVE"
            }
        }
    ],
    socialId: {
        type: String
    },
    mirrorFlyId: {
        type: String
    },
    loginType: {
        type: String,
        enum: ["FACEBOOK", "GOOGLE", "NORMAL", "INSTAGRAM", "WECHAT", "LINE"],
        default: "NORMAL"
    },
    friendRequestList: [{
        friendRequestUserId: {
            type: schema.Types.ObjectId,
            ref: "user"
        },
        status: {
            type: String,
            enum: ["CONFIRM", "DELETE", "WAITING"],
            default: "WAITING"
        }
    }],
    friendRequestSentList: [
        {
            friendRequestSentId: {
                type: schema.Types.ObjectId,
                ref: "user"
            },
            addTime: {
                type: Date,
                default: Date.now()
            },
            status: {
                type: String,
                enum: ["SENT", "REMOVE", "DELETE", "BLOCK", "ACCEPT"],
                default: "SENT"
            }
        }
    ],
    follower: [
        {
            followerId: {
                type: schema.Types.ObjectId,
                ref: "user"
            },
            name: {
                type: String
            },
            profilePic: {
                type: String
            },
            status: {
                type: String,
                enum: ["CONFIRM", "DELETE", "WAITING"],
                default: "WAITING"
            }
        }
    ],
    following: [
        {
            followingId: {
                type: schema.Types.ObjectId,
                ref: "user"
            },
            name: {
                type: String
            },
            profilePic: {
                type: String
            },
            isFollowing: {
                type: Boolean

            },
            status: {
                type: String,
                enum: ["ACTIVE", "BLOCK", "DELETE"],
                default: "ACTIVE"
            }
        }
    ],
    userType: {
        type: String,
        enum: ["ADMIN", "SUBADMIN", "USER"],
        default: "USER",
        uppercase: true
    },
    facebookLink: {
        type: String
    },
    instagramLink: {
        type: String
    },
    twitterLink: {
        type: String
    },
    tiktokLink: {
        type: String
    },
    isReward: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    },
    onlineStatus: {
        type: Boolean,
        default: false
    },
    permissions: [{
        dashboard: {
            type: Boolean,
            default: false
        }

    }],
    clevertapId: [{
        id: {
            type: String,
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        },
        _id: false
    }],
    deviceId: [{
        id: {
            type: String,
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        },
        _id: false
    }]

}, { timestamps: true });
userModel.plugin(paginate);
userModel.plugin(aggregatePaginate);
module.exports = mongoose.model("user", userModel);

mongoose.model("user", userModel).find({ userType: "ADMIN" }, (err, result) => {
    if (err) {
        console.log("DEFAULT ADMIN ERROR", err);
    } else if (result.length != 0) {
        console.log("Default Admin.");
    } else {
        let obj = {
            userType: "ADMIN",
            name: "Umair khan",
            country: "INDIA",
            profilePic: "https://res.cloudinary.com/dkoznoze6/image/upload/v1563943105/n7zdoyvpxxqhexqybvkx.jpg",
            verifyOtp: true,
            countryCode: "+91",
            mobileNumber: "9560440056",
            email: "no-umairkhan@mobiloitte.com",
            password: bcrypt.hashSync("Mobiloitte1"),
            permissions: [{
                dashboard: true
            }]
        };
        mongoose.model("user", userModel).create(obj, (err1, result1) => {
            if (err1) {
                console.log("DEFAULT ADMIN  creation ERROR", err1);
            } else {
                console.log("DEFAULT ADMIN Created", result1);
            }
        });
    }
});