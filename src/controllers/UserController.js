const constants = require("../constants");
const HandlersService = require("../services/HandlersService");
const User = require("../models/User");
const Membership = require("../models/Membership");
const Group = require("../models/Group");

module.exports.getMe = function (req, res) {
    let userId = req.body.session.user._id;
    
    User.findById(userId)
        .lean({virtuals: true})
        .exec(async (err, user) => {
            if (err) return HandlersService.sendError(res, 500, err);

            let memberships = await Membership.find({user: user._id}).exec();
            user.memberships = memberships;

            let activeMembership = memberships.find(x => x.state == constants.MEMBERSHIP_STATES.ACCEPTED);
            let group = null;
            
            if (activeMembership) {
                group = await Group.findById(activeMembership.group).exec();
            }
            
            user.group = group;

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