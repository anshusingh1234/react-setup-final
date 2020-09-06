const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

var interestModel = new schema(
     {
          interestName: {
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

interestModel.plugin(mongoosePaginate);
module.exports = mongoose.model("interestModel", interestModel);