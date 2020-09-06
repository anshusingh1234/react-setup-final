const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var schema = mongoose.Schema;
var offlineEvent = new schema({

    
    feedbackTime:{
        type: String
    },
    image:{
        type: String
    },

    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    }
  
},
    {
        timestamps: true
    })

offlineEvent.plugin(mongoosePaginate);
module.exports = mongoose.model("offlineEvent", offlineEvent)