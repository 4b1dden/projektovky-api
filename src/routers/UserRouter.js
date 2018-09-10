const express = require('express');
const router = express.Router();
const user = require("../controllers/UserController");
const SessionListener = require('../services/SessionListener');

router.use(SessionListener.requireSession);

router
    .route("/me")
    .get(user.getMe);

module.exports = router;