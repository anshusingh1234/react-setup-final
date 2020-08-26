const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const schema = mongoose.Schema;
const groupModel = new schema({
   
    userId: {
        type: schema.Types.ObjectId,
        ref: "user"
    },
    groupName:{
        type:String
    },
    title:{
        type:String
    },
    
    profilePic:{
        type:String
    },
    // participant: [String],
    members: [
        {
            memberId: {
                type: schema.Types.ObjectId,
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
    status: {
        type: String,
        enum: ['ACTIVE', 'BLOCK', 'DELETE', 'CANCEL'],
        default: 'ACTIVE'
    }
},
{timestamps: true })
groupModel.index({ location: "2dsphere" });
groupModel.plugin(mongoosePaginate);
groupModel.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("group", groupModel)





