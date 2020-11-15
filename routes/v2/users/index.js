const express = require('express');
const router = express.Router();
const userList = require("./list");
const friends = require("./friends");
const social = require("./social");
const username = require("./username");
const referrals = require("./referrals");
const syncContacts = require("./syncContacts");
const mirrorfly = require("./mirrorfly");
const signOut = require("./signOut");
const auth = require('../auth');
const error = require('../error');

router.get(`/list`,
userList.list,
error
)

router.get(`/friend/suggestions`,
auth,
friends.suggestions,
error
)

router.get(`/friend/requests`,
auth,
friends.requests,
error
)

router.post(`/syncContacts`,
auth,
syncContacts.upload,
error
)

router.patch(`/referrals`,
auth,
referrals.validate,
referrals.save,
referrals.pushNotification,
error
)

router.post(`/mirrorfly/linkUserId`,
auth,
mirrorfly.validate,
mirrorfly.linkUserId,
error
)

router.get(`/validateUsername`,
username.validate,
username.suggest,
error
)

router.post(`/social/link`,
auth,
social.validate,
social.link,
error
)

router.patch(`/signOut`,
auth,
signOut.handle,
error
)

module.exports = router;