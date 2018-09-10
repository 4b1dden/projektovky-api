const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../constants");

// User session schema used to manage active JWT tokens
var SessionSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    time: {
        type: Date,
        unique: false,
        required: true
    },
    active: {
        type: Boolean,
        unique: false,
        required: true,
        default: true
    },
    token: {
        type: String,
        unique: false,
        required: true
    }
}, { collection: constants.DB.COLLECTIONS.SESSIONS});

// creating and exporting mongoose Session model for further use
module.exports = mongoose.model("Session", SessionSchema);
