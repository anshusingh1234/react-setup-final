const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

var chefModel = new schema(
     {
          profilePic: {
               type: String,
          },
          countryId: {
               type: schema.Types.ObjectId,
               ref: "countryModel"
          },
          countryName: {
               type: String,
          },
          name: {
               type: String,
          },
          email: {
               type: String,
          },
          phone: {
               type: String,
          },
          gender: {
               type: String,
          },
        
          status: {
               type: String,
               enum: ["ACTIVE", "DELETE", "BLOCK"],
               default: "ACTIVE"
          }
     },
     {
          timestamps: true
     }
);

chefModel.plugin(mongoosePaginate);
module.exports = mongoose.model("chefModel", chefModel);