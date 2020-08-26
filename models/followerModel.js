const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const schema = mongoose.Schema;
const followerModel = new schema({
    followerToId:{
        type:schema.Types.ObjectId,
         ref:"user"
    },
    followerById:{
        type:schema.Types.ObjectId,
         ref:"user"
    },
    postTitle: String,
    description: String,
    Address: String,
    date: String,
    time: String,
    image: [String],
    likes:[{
        likedId:{type:String},
        userName:{type:String},

    }],
    video: String,
    status: {
        type: String,
        enum: ['ACTIVE', 'BLOCK', 'DELETE'],
        default: 'ACTIVE'
   },
})
followerModel.plugin(mongoosePaginate);
module.exports = mongoose.model("follower", followerModel)





