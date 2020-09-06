const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

var postReportModel = new schema(
     {
          reportBy: {
               type:schema.Types.ObjectId,
               ref:"user"
          },
          postId: {
            type:schema.Types.ObjectId,
            ref:"post"
       },
       reportType:{
            type:String
       },
       reason:{
            type:String,           
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

postReportModel.plugin(mongoosePaginate);
module.exports = mongoose.model("postReportModel", postReportModel);