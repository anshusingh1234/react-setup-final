const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

var reportModel = new schema(
     {
          reportBy: {
               type: schema.Types.ObjectId,
               ref: "user"
          },
          reportTo: {
               type: schema.Types.ObjectId,
               ref: "user"
          },
          feedCreator: {
               type: String
          },
          feedCreatorEmail: {
               type: String
          },
          reportedToUser: {
               type: String
          },
          reportedToUserEmail: {
               type: String
          },
          feed: {
               type: String
          },
          reason: {
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

reportModel.plugin(mongoosePaginate);
module.exports = mongoose.model("report", reportModel);