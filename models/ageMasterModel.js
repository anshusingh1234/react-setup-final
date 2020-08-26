const mongoose = require('mongoose');
const schema = mongoose.Schema;
var bcrypt= require('bcrypt-nodejs')
var mongoosePaginate = require('mongoose-paginate');


var ageMasterModel = new schema({
    ageName:{
       type:String
    },
    status:{
        type:String,
        enum:["ACTIVE","DELETE"],
        default:"ACTIVE"
    }

}, { timestamps: true });

ageMasterModel.plugin(mongoosePaginate)
module.exports = mongoose.model("age", ageMasterModel); 