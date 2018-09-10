const constants = require("../constants");
const HandlersService = require("../services/HandlersService");
const User = require("../models/User");
const Group = require("../models/Group");
const Membership = require('../models/Membership');

module.exports.createGroup = function (req, res) {
    let group = new Group(req.body);

    group.save(function (err) {
        if (err) return HandlersService.sendError(res, 500, err);

        let membership = new Membership({
            user: req.body.session.user._id,
            group: group._id,
            state: constants.GROUP_STATES.ACCEPTED
        });

        membership.save(function (err) {
            if (err) return HandlersService.sendError(res, 500, err);

            group.memberships = [membership];
            
            res.status(200).json({
                isError: false,
                data: group
            })
        })
    })
}