const express = require('express');
const router = express.Router();
const group = require("../controllers/GroupController");
const SessionListener = require('../services/SessionListener');

router.use(SessionListener.requireSession);

router
    .route("/single")
    .post(group.createGroup)
    .get(group.getSingleGroup);

router
    .route("/single/membership/add")
    .get(group.createInvitationsForGroup);

router
    .route("/single/membership/remove")
    .get(group.cancelPendingInvitation);

router
    .route("/single/membership/react")
    .get(group.reactToInvitation);

module.exports = router;