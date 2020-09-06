const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var schema = mongoose.Schema;
var roleKey = new schema({
    roleName: {
        type: String
    },
    createdBy:{
        type: String
    },
    permissions: [{
        dashboard: {
            type: Boolean,
            default: false
        },
        newCustomer: {
            type: Boolean,
            default: false
        },
        events: {
            type: Boolean,
            default: false
        },
        reportFeed: {
            type: Boolean,
            default: false
        },
        adminMaster: {
            type: Boolean,
            default: false
        },
        genderMaster: {
            type: Boolean,
            default: false
        },
        languageMaster: {
            type: Boolean,
            default: false
        },
        interestMaster: {
            type: Boolean,
            default: false
        },
        setting: {
            type: Boolean,
            default: false
        },
        customerManagement: {
            type: Boolean,
            default: false
        },
        rewardReport: {
            type: Boolean,
            default: false
        },
        staticContentManagement:{
            type: Boolean,
            default: false
        }
    }],
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    }
},
    {
        timestamps: true
    })
roleKey.plugin(mongoosePaginate);
module.exports = mongoose.model("role", roleKey)