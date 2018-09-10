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

// app-wide access to our database and success/error handlers
mongoose.connect(constants.DB.URI);

mongoose.connection.on('error', function(err){
    throw err;
});

mongoose.connection.once('open', function(){
    console.log('succesfully connected to db');
});

// using bodyParser to handle POST data
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// requiring routers
const authRouter = require("./src/routers/AuthRouter");
const userRouter = require('./src/routers/UserRouter');

// wiring up routers
app.use(constants.SERVER.REQ_URL_PREFIX + "/auth", authRouter);
app.use(constants.SERVER.REQ_URL_PREFIX + "/user", userRouter);

// keep last - handles 404s
app.use(function(req, res) {
    res.status(404).send({isError: true, message: constants.RESPONSE.NOT_FOUND})
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})