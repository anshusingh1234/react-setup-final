const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const schema = mongoose.Schema;
const feedBackModel = new schema({
    userId:{
        type:schema.Types.ObjectId,
         ref:"user"
    },
   // reciveduserId:{
        //type:schema.Types.ObjectId,
        // ref:"user"
   // },
    eventId:{
        type:schema.Types.ObjectId,
         ref:"event"
    },
   
    feedbackTime: {
        type: Date,
        default: Date.now()
    },
    overAllExp:{
        type:String
    },
    punctualTime: {
        type:String
    },
    welcome:{
        type:String
    },
    recommend:{
        type:String
    },
    message:{
        type:String
    },

       status: {
        type: String,
        enum: ['ACTIVE', 'BLOCK', 'DELETE'],
        default: 'ACTIVE'
   },
})
feedBackModel.plugin(mongoosePaginate);
module.exports = mongoose.model("feedback", feedBackModel)





