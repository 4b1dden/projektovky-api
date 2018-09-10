const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../constants");

const MembershipSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true   
    },
    // An integer representing state of membership
    // 1 - pending invite
    // 2 - accepted invite - part of group
    // -1 - declined invite
    state: {
        type: Number,
        required: true,
        default: 1
    }
})