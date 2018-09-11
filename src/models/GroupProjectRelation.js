const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../constants");

const GroupProjectRelationSchema = new Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true   
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true   
    },
    state: {
        type: Number,
        required: true,
        default: 1
    },
    at: {
        type: Date,
        required: false,
        default: new Date()
    }
}, {
    collection: constants.DB.COLLECTIONS.GROUP_PROJECT_RELATION
});

module.exports = mongoose.model("GroupProjectRelation", GroupProjectRelationSchema);