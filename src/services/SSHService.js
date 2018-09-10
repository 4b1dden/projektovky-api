const SSH = require("simple-ssh");
const constants = require('../constants');

module.exports.getNewSSHInstance = (name, pass) => {
    return new SSH({
      host: constants.SSH.HOST_URL,
      user: name,
      pass: pass,
      timeout: constants.SSH.TIMEOUT_LIMIT
    });
}