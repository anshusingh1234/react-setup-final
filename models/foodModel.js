const mongoose = require('mongoose');
const schema = mongoose.Schema;
var bcrypt= require('bcrypt-nodejs')
var mongoosePaginate = require('mongoose-paginate');

var foodModel = new schema({
    name:{
        type:String
    },
    minimumPrice: {
        type: Number,
         }, 
    maximumPrice:{
        type:Number
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
foodModel.plugin(mongoosePaginate);
module.exports = mongoose.model("food", foodModel); 