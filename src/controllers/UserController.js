const constants = require("../constants");
const HandlersService = require("../services/HandlersService");
const User = require("../models/User");

module.exports.getMe = function (req, res) {
    let userId = req.body.session.user._id;
    
    User.findById(userId)
        .lean({virtuals: true})
        .exec((err, user) => {
            if (err) return HandlersService.sendError(res, 500, err);
            
            res.status(200).json({
                isError: false,
                data: user
            })
        })
}

module.exports.getUserByUsername = function (req, res) {
    let username = req.get("username");

    User.findOne({username: username})
        .exec((err, user) => {
            if (err) return HandlersService.sendError(res, 500, err);
        
            res.status(200).json({
                isError: false,
                data: user
            });
        });
}