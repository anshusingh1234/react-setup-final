const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const schema = mongoose.Schema;
const roomModel = new schema({
    userId: {
        type: schema.Types.ObjectId,
        ref: "user"
    },
    title:{
        type:String
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Mixed']
    },
    ageRange: {
        type: String,
        enum: ['Teen', 'Twenties', 'Thirties','Forties']
    },
    joinStatus: {
        type: Boolean,
        default: false
    },

    status: {
        type: String,
        enum: ['ACTIVE', 'BLOCK', 'DELETE'],
        default: 'ACTIVE'
    },
})
roomModel.plugin(mongoosePaginate);
module.exports = mongoose.model("room", roomModel)





