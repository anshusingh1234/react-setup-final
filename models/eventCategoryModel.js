const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate')
const schema = mongoose.Schema;
var eventCategory = new schema({
    eventCategoryName:{
        type:String
    },
    image: {
        type: String
    },
    status:{
        type:String,
        enum:["ACTIVE","DELETE","BLOCK"],
        default:"ACTIVE"
    }
}, { timestamps: true });
eventCategory.plugin(mongoosePaginate)
module.exports = mongoose.model("eventCategory", eventCategory); 