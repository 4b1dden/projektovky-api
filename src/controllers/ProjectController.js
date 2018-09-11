const constants = require("../constants");
const HandlersService = require("../services/HandlersService");
const User = require("../models/User");
const Group = require("../models/Group");
const Membership = require('../models/Membership');
const Project = require("../models/Project");
const GP_Relation = require("../models/GroupProjectRelation");

module.exports.createNewProject = async function (req, res) {
    let userId = req.body.session.user._id;
    let user = await User.findOne({_id: userId}).exec();

    if (user.role.slug == constants.ROLES.TEACHER.slug) {
        let project = new Project(req.body);
        
        project.save(function (err) {
            if (err) return HandlersService.sendError(res, 500, err);

            res.status(200).json({
                isError: false,
                data: project
            });
        });
    } else {
        return HandlersService.sendError(res, 403, constants.RESPONSE.INSUFFICIENT_PERMISSIONS);
    }
}

module.exports.createGroupProjectRelation = function (req, res) {
    let group = req.get('group_id');
    let project = req.get('project_id');

    if (group && project) {
        let gpr = new GP_Relation({
            group: group,
            project: project,
            state: 1
        });

        gpr.save(function (err) {
            if (err) return HandlersService.sendError(res, 500, err);

            res.status(200).json({
                isError: false,
                data: gpr
            });
        });
    } else {
        return HandlersService.sendError(res, 400, constants.RESPONSE.MISSING_DATA);
    }
}

module.exports.reactToGroupProjectRelation = async function (req, res) {
    let userId = req.body.session.user._id;
    let relationId = req.get('relation_id');
    let newState = parseInt(req.get('new_state'));
    let user = await User.findOne({_id: userId}).exec();
    let relation = await GP_Relation.findOne({_id: relationId}).populate("project").exec();

    if (relationId && newState) {
        if (user.role.slug == constants.ROLES.TEACHER.slug && relation.project.consultant.toString() == userId.toString()) {
            GP_Relation.updateOne({_id: relationId}, {state: newState}, {new: true}, async (err, raw) => {
                if (err) return HandlersService.sendError(res, 500, err);

                if (newState == constants.GROUP_PROJECT_RELATION_STATES.ACCEPTED) {
                    await Project.findOneAndUpdate({_id: relation.project}, {group: relation.group}).exec();
                    console.log('updated project in db');
                }
    
                res.status(200).json({
                    isError: false,
                    data: raw
                });
            });
        } else {
            return HandlersService.sendError(res, 403, constants.RESPONSE.INSUFFICIENT_PERMISSIONS);
        }
    } else {
        return HandlersService.sendError(res, 400, constants.RESPONSE.MISSING_DATA)
    }
}

module.exports.getSingleProject = function (req, res) {
    let projectId = req.get('project_id');

    if (projectId) {
        Project.findOne({_id: projectId}).populate("group consultant").lean().exec(async (err, project) => {
            if (err) return HandlersService.sendError(res, 500, err);

            project.group = await HandlersService.hydrateGroupWithItsUsers(project.group);

            res.status(200).json({
                isError: false,
                data: project
            })
        })
    } else {
        return HandlersService.sendError(res, 500, constants.RESPONSE.MISSING_DATA)
    }
}

module.exports.editSingleProject = function (req, res) {
    let projectId = req.get("project_id");

    if (projectId) {
        Project.findOneAndUpdate({_id: projectId}, req.body, {new: true}, async (err, raw) => {
            if (err) return HandlersService.sendError(res, 500, err);

            let project = await Project.findOne({_id: projectId}).populate("group").lean().exec();
            project.group = await HandlersService.hydrateGroupWithItsUsers(project.group);

            res.status(200).json({
                isError: false,
                data: project
            });
        })
    } else {
        return HandlersService.sendError(res, 500, constants.RESPONSE.MISSING_DATA)
    }
}

module.exports.getAllProjects = function (req, res) {
    Project.find({}).populate("group consultant").lean().exec((err, projects) => {
        if (err) return HandlersService.sendError(res, 500, err);

        let promises = projects.map(async project => {
            return new Promise (
                async function (resolve, reject) {
                    project.group = await HandlersService.hydrateGroupWithItsUsers(project.group);

                    resolve(project);
                }
            )
        });

        Promise.all(promises).then(data => {
            res.status(200).json({
                isError: false,
                data: data
            })
        });
    })
}