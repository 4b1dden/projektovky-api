const constants = require('../constants');
const HandlersService = require("../services/HandlersService");
const User = require('../models/User');
const Session = require("../models/Session");
const jwt = require('jsonwebtoken');

module.exports.requireSession = function (req, res, next) {
    var token = req.get('token');

    if (!token) {
        // No token was provided
        return HandlersService.sendError(res, 401, constants.RESPONSE.NO_TOKEN_PROVIDED)
    }
    
    jwt.verify(token, constants.JWT.SECRET_KEY, function(err, sessionObject) {
        if (err) {
            // Token has timed out or doesn't match the JWT secret
            return HandlersService.sendError(res, 401, constants.RESPONSE.INVALID_TOKEN);
        }

        Session.findOne({token: token}, function(err, session) {
            if (session) {
                if (!session.active) {
                    // Token was correct, but is no longer active - user logged out
                    return HandlersService.sendError(res, 401, constants.RESPONSE.INVALID_TOKEN);
                }
            } else {
                // No corresponding session found in database - token was either forged or manually deleted from database
                return HandlersService.sendError(res, 401, constants.RESPONSE.INVALID_TOKEN);
            }

            // Hydrate request with corresponding user
            User.findById(sessionObject.id).lean({ virtuals: true }).exec((err, user) => {
                if (err) return HandlersService.sendError(res, 401, err);
                if (!user) return HandlersService.sendError(res, 404, constants.RESPONSE.USER_NOT_FOUND);

                req.body.session = {
                    token: token,
                    user: user
                };

                return next();
            });
        });
    });
}