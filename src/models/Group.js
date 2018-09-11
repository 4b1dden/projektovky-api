const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../constants");
const Membership = require("../models/Membership");
const GP_R = require('../models/GroupProjectRelation');

const GroupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: false,
        default: new Date()
    },
    isAbandoned: {
        type: Boolean,
        required: false,
        default: false
    },
    creator: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "User",
        // required: true
        type: String,
        // will be probably easier to handle
    }
}, {
    collection: constants.DB.COLLECTIONS.GROUPS
});

GroupSchema.virtual("memberships").get(function () {
    let memberships = [];

    Membership.find({group: this._id}).lean().exec((err, documents) => {
        if (err) return memberships

        memberships = documents.filter(x => x.state != constants.GROUP_STATES.LEFT);

        return memberships
    });
});

GroupSchema.virtual("relations").get(function () {
    GP_R.find({group: this._id}).lean().exec((err, relations) => {
        return relations
    })
})

module.exports = mongoose.model("Group", GroupSchema)