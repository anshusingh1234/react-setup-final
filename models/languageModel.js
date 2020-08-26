const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

var languageModel = new schema(
     {
          languageName: {
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

languageModel.plugin(mongoosePaginate);
module.exports = mongoose.model("languageModel", languageModel);