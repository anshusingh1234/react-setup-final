const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var schema = mongoose.Schema;
var onlineEvent = new schema({

    
    allowedInAntakshari: {
        type: String
    },
    joinInOnlineEvent: {
        type: String
    },
    title: {
        type: String
    },
    defaultDuration: {
        type: String
    },
    numberOfParticipants: {
        type: String
    },

    eventFeebackDuration: {
        type: String
    },
    images: [{
        type: String
    }],
  
    video: {
        type: String
    },
    picture:{
        type: String
    },
   
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    },
   
    DefaultEventType: [
        {
            eventType: {
                type:String
            },
            eventTypeStatus:{
                type: String,
                enum: ["true", "false"],
                default: "true"
            }
        },
    ],
   
},
    {
        timestamps: true
    })

    onlineEvent.plugin(mongoosePaginate);
module.exports = mongoose.model("onlineEvent", onlineEvent)