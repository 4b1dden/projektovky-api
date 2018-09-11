const constants = require("../constants");
const HandlersService = require("../services/HandlersService");
const User = require("../models/User");
const Group = require("../models/Group");
const Membership = require('../models/Membership');
const Project = require("../models/Project");
const GP_Relation = require("../models/GroupProjectRelation");

module.exports.createGroup = function (req, res) {
    let group = new Group(req.body);

    group.save(function (err) {
        if (err) return HandlersService.sendError(res, 500, err);

        let membership = new Membership({
            user: req.body.session.user._id,
            group: group._id,
            state: constants.MEMBERSHIP_STATES.ACCEPTED
        });

        membership.save(function (err) {
            if (err) return HandlersService.sendError(res, 500, err);

            group.memberships = [membership];
            
            res.status(200).json({
                isError: false,
                data: group
            });
        });
    });
}

module.exports.cancelGroupAndItsMemberships = function (req, res) {
    let groupId = req.get('group_id');

    if (groupId) {
        Group.findOneAndRemove({_id: groupId}, (err, deleted) => {
            if (err) return HandlersService.sendError(res, 500, constants.RESPONSE.MISSING_DATA);
    
            Membership.remove({group: groupId}, (err, removed) => {
                if (err) return HandlersService.sendError(res, 500, constants.RESPONSE.MISSING_DATA);
    
                res.status(200).json({
                    isError: false,
                })
            })
        })
    } else {
        return HandlersService.sendError(res, 400, constants.RESPONSE.MISSING_DATA);
    }
}

module.exports.createInvitationsForGroup = function (req, res) {
    const groupId = req.get("group_id");
    const targetUsernames = JSON.parse(req.get("usernames"));

    if (Array.isArray(targetUsernames)) {
        if (groupId && targetUsernames) {
            let promises = targetUsernames.map(async username => {
                return new Promise (
                    async function (resolve, reject) {
                        let user = await User.findOne({username: username}).exec();
    
                        let obj = {
                            username: username,
                            group: groupId,
                            state: 1
                        }
                        if (user) obj.user = user._id;
    
                        let membership = new Membership(obj);
    
                        membership.save(function (err) {
                            if (err) reject(err);
    
                            resolve(membership);
                        });
                    }
                )
            });
    
            Promise.all(promises).then(memberships => {
                res.status(200).json({
                    isError: false,
                    data: memberships
                });
            }).catch(err => {
                return HandlersService.sendError(res, 500, err);
            });
        } else {
            return HandlersService.sendError(res, 400, constants.RESPONSE.MISSING_DATA);
        }
    } else {
        return HandlersService.sendError(res, 400, constants.RESPONSE.INPUT_WAS_NOT_ARRAY)
    }
}

module.exports.cancelPendingInvitation = function (req, res) {
    let membership = req.get("membership_id");

    if (membership) {
        Membership.findOneAndRemove({_id: membership}, (err, removed) => {
            if (err) return HandlersService.sendError(res, 500, err);

            res.status(200).json({
                isError: false,
            })
        })
    } else {
        return HandlersService.sendError(res, 400, constants.RESPONSE.MISSING_DATA);
    }
}

module.exports.reactToInvitation = function (req, res) {
    let membership = req.get("membership_id");
    let newState = parseInt(req.get("new_state"));

    if (membership && newState) {
        Membership.updateOne({_id: membership}, {state: newState}, {new: true}, (err, updatedMembership) => {
            if (err) return HandlersService.sendError(res, 500, err);
    
            res.status(200).json({
                isError: false,
                data: updatedMembership
            });
        });
    } else {
        return HandlersService.sendError(res, 400, constants.RESPONSE.MISSING_DATA);
    }
}

module.exports.getGroupMembershipsByUserId = function (req, res) {
    let userId = req.body.session.user._id;

    Membership.find({user: userId}).exec((err, memberships) => {
        if (err) return HandlersService.sendError(res, 500, err);

        res.status(200).json({
            isError: false,
            data: memberships
        })
    })
}

module.exports.getSingleGroup = function (req, res) {
    let groupId = req.get("group_id");

    if (groupId) {
        Group.findOne({_id: groupId}).lean({virtuals: true}).exec(async (err, group) => {
            if (err) return HandlersService.sendError(res, 500, err);
    
            let memberships = await Membership.find({group: group._id}).populate("user").lean().exec();
            let activeMemberships = memberships.filter(m => parseInt(m.state) == constants.MEMBERSHIP_STATES.ACCEPTED);
            let pendingMemberships = memberships.filter(m => parseInt(m.state) == constants.MEMBERSHIP_STATES.PENDING_INVITE);
            let projects = await Project.find({group: group._id}).populate("consultant opponent").exec();
            let relations = await GP_Relation.find({group: group._id}).exec();
    
            group = await HandlersService.hydrateGroupWithItsUsers(group);
            group.projects = projects || [];
            group.projectRelations = relations || [];

            res.status(200).json({
                isError: false,
                data: group
            });
        });
    } else {
        return HandlersService.sendError(res, 400, constants.RESPONSE.MISSING_DATA);
    }
}