const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var schema = mongoose.Schema;
var faqModel = new schema({

    
    question: {
        type: String
    },
    answer: {
        type: String
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    },
     
},
    {
        timestamps: true
    })

    faqModel.plugin(mongoosePaginate);
module.exports = mongoose.model("faqModel", faqModel)