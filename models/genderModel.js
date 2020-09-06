const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

var genderModel = new schema(
     {
          genderName: {
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

genderModel.plugin(mongoosePaginate);
module.exports = mongoose.model("genderModel", genderModel);