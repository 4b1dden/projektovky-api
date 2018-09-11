const constants = require('../constants');
const Membership = require('../models/Membership');

module.exports.sendError = (res, code, message) => { 
    res.status(code).json({
        isError: true,
        message: message,
    });
}

module.exports.hydrateGroupWithItsUsers = (group) => {
    return new Promise (
        async function (resolve, reject) {
            if (!group) resolve({});
            let memberships = await Membership.find({group: group._id}).populate("user").exec();

            let active = memberships.filter(x => parseInt(x.state) == constants.MEMBERSHIP_STATES.ACCEPTED);
            let pending = memberships.filter(x => parseInt(x.state) == constants.MEMBERSHIP_STATES.PENDING_INVITE);
            
            group.activeMembers = active;
            group.pendingMembers = pending;

            resolve(group);
        }
    )
}