const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const schema = mongoose.Schema;
var joinRequest = new schema({
    userId: {
        type: String,
        ref: "user"
    },
    eventId: {
        type: String,
        ref: "event"
    },
    eventTitle: {
        type: String
    },
    eventImage: {
        type: String
    },
    eventType: {
        type: String
    },
    date: {
        type: String
    },
    eventHostedBy: {
        type: String,
        ref: "user"
    },
    requestStatus: {
        type: String,
        enum: ["PENDING", "ACCEPT", "REJECT", "CANCEL", "WITHDRAW"],
        default: "PENDING"
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    },
}, {
        timestamps: true
    })

joinRequest.plugin(mongoosePaginate);
joinRequest.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model('joinRequest', joinRequest);