const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../constants");

const ProjectSchema = new Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: false
    },
    consultant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    opponent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    title: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: false,
        default: new Date()
    },
    dueTo: {
        type: Date,
        required: false
    },
    description: {
        type: String,
        required: true
    }
}, {
    collection: constants.DB.COLLECTIONS.PROJECTS
})

module.exports = mongoose.model("Project", ProjectSchema);