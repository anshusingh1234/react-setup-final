const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

var countryModel = new schema(
     {
          countryName: {
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

countryModel.plugin(mongoosePaginate);
module.exports = mongoose.model("countryModel", countryModel);