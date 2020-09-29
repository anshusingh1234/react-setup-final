const express = require('express');
const router = express.Router();
const userList = require("./list");
const referrals = require("./referrals");
const syncContacts = require("./syncContacts");
const auth = require('../auth');
const error = require('../error');

router.get(`/list`,
userList.list,
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
error
)

module.exports = router;