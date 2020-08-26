var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Paginate = require('mongoose-paginate');
var customerSchema = new Schema({
     profilePic: {
          type: String
     },
     countryId: {
          type: Schema.Types.ObjectId,
          ref: "countryModel"
     },
     customerName: {
          type: String
     },

     status: {
          type: String,
          enum: ['ACTIVE', 'BLOCK', 'DELETE'],
          default: 'ACTIVE'
     },
     verifyStatus:{
          type: Boolean,
          default: false
     },
     email: {
          type: String
     },
     phone: {
          type: String
     },
     password: {
          type: String
     },
    
     gender: {
          type: String
     },
     countryName: {
          type: String
     }

}, { timestamps: true });
customerSchema.plugin(Paginate);

module.exports = mongoose.model('customerSchema', customerSchema);