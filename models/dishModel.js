const mongoose = require('mongoose');
const schema = mongoose.Schema;
var bcrypt= require('bcrypt-nodejs')
var mongoosePaginate = require('mongoose-paginate');


var dishModel = new schema({
    foodCatagroy:{
       type:String
    },

    name:{
        type:String
    },
    description: {
        type:String,
         }, 
    youTubeLink:{
        type:String
    },
    image: {
        type: String
    },
    status:{
        type:String,
        enum:["ACTIVE","DELETE"],
        default:"ACTIVE"
    }

}, { timestamps: true });

dishModel.plugin(mongoosePaginate)
module.exports = mongoose.model("dish", dishModel); 