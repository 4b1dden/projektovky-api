const constants = require("../constants");
const SSHService = require("../services/SSHService");
const HandlersService = require("../services/HandlersService");
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const Session = require("../models/Session");

module.exports.login = function (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
        let ssh = SSHService.getNewSSHInstance(username, password);
        ssh.exec("echo 1").start({
            fail: function(err) {
                return HandlersService.sendError(res, 400, constants.RESPONSE.INCORRECT_CREDENTIALS);
            },
            success: async function() {
                let entry = await User.findOne({username: username}).exec();

                if (entry) {
                    let token = jwt.sign({ id: entry._id }, constants.JWT.SECRET_KEY, {
                        expiresIn: constants.JWT.DEFAULT_EXPIRATION
                    });

                    let session = new Session({
                        user: entry._id,
                        time: new Date(),
                        active: true,
                        token: token
                    });

                    session.save(function (err) {
                        if (err) return HandlersService.sendError(res, 500, err);

                        // todo: Add virtual properties to returned user object
                        res.status(200).json({
                            isError: false,
                            data: {
                                user: user,
                                token: token
                            }
                        })
                    })
                } else {
                    let conn = SSHService.getNewSSHInstance(username, password);
                    conn.exec(`cat /etc/passwd | grep ${username}`, {
                        out: async (data) => {
                            let row = data.split(":");

                            let user = new User({
                                username: username,
                                gid: row[constants.PASSWD_ENUMERABLES.GID],
                                uid: row[constants.PASSWD_ENUMERABLES.UID],
                                fullname: row[constants.PASSWD_ENUMERABLES.FULL_NAME]
                            });

                            user.save(function (err) {
                                if (err) return HandlersService.sendError(res, 500, err);

                                let token = jwt.sign({ id: user._id }, constants.JWT.SECRET_KEY, {
                                    expiresIn: constants.JWT.DEFAULT_EXPIRATION
                                });

                                let session = new Session({
                                    user: user._id,
                                    time: new Date(),
                                    active: true,
                                    token: token
                                });

                                console.log(session);
                                console.log(user);

                                session.save(function (err) {
                                    if (err) return HandlersService.sendError(res, 500, err);

                                    // todo: Add virtual properties to returned user object
                                    res.status(200).json({
                                        isError: false,
                                        data: {
                                            user: user,
                                            token: token
                                        }
                                    })
                                })
                            })
                        }
                    }).start();
                }
            }
        })
    } else {
        return HandlersService.sendError(400, constants.RESPONSE.MISSING_DATA);
    }
}