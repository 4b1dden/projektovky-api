const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../constants");

const MembershipSchema = new Schema({
    user: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    // used for being able to invite users who havent been logged in the page yet
    username: {
        type: String,
        required: false
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true   
    },
    // An integer representing state of membership
    // -1 - left the group
    // 1 - pending invite
    // 2 - accepted invite - part of group
    // -1 - declined invite
    state: {
        type: Number,
        required: true,
        default: 1
    }
}, {
    collection: constants.DB.COLLECTIONS.MEMBERSHIPS
});

module.exports = mongoose.model("Membership", MembershipSchema);