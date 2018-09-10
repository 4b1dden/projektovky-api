const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../constants");

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    uid: {
        type: Number
    },
    gid: {
        type: Number
    },
    fullname: {
        type: String,
    }
}, {
    collection: constants.DB.COLLECTIONS.USERS,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true 
    }
});

UserSchema.virtual("role").get(function () {
    if (this.gid) {
        return this.gid.toString() == "1015" ? constants.ROLES.TEACHER : constants.ROLES.STUDENT
    }
});

module.exports = mongoose.model("User", UserSchema)