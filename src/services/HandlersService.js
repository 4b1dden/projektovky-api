const constants = require('../constants');

module.exports.sendError = (res, code, message) => { 
    res.status(code).json({
        isError: true,
        message: message,
    });
}