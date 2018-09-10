// BASE SETUP
// =============================================================

// requiring needed packages
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const constants = require('./src/constants');
const cors = require('cors');

const PORT = process.env.PORT || 8080;

// using bodyParser to handle POST data
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res) {
    res.status(404).send({isError: true, message: constants.RESPONSE.NOT_FOUND})
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})