const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const schema = mongoose.Schema
const marketingModel = new schema({
    marketingName:String,
    link:String,
    useLinkCount:Number,
    status: {
        type: String,
        enum: ['ACTIVE', 'BLOCK', 'DELETE'],
        default: 'ACTIVE'
   },
},{timestamps:true})
marketingModel.plugin(mongoosePaginate)
module.exports=mongoose.model("marketing",marketingModel)