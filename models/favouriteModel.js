const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

var favouriteModel = new schema(
     {
          foodName: {
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

favouriteModel.plugin(mongoosePaginate);
module.exports = mongoose.model("favouriteModel", favouriteModel);