const express = require('express');
const router = express.Router();
const project = require("../controllers/ProjectController");
const SessionListener = require('../services/SessionListener');

router.use(SessionListener.requireSession);

router
    .route("/single")
    .post(project.createNewProject)
    .get(project.getSingleProject)
    .put(project.editSingleProject);

router
    .route("/all")
    .get(project.getAllProjects);

router
    .route("/single/group/request")
    .get(project.createGroupProjectRelation);

router
    .route("/single/group/request/react")
    .get(project.reactToGroupProjectRelation);

module.exports = router;