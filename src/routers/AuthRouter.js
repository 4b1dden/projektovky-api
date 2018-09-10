const express = require('express');
const router = express.Router();
const auth = require("../controllers/AuthController");

router
    .route("/login")
    .post(auth.login);

module.exports = router;