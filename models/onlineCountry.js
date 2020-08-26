const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var schema = mongoose.Schema;
var onlineCountry = new schema({

    countryName: {
        type: String
    },
    
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    },
    eventCategory: [
        {
            category: {
                type:String
            },
            categoryStatus:{
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

    onlineCountry.plugin(mongoosePaginate);
module.exports = mongoose.model("onlineCountry", onlineCountry)