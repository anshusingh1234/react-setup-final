const express = require('express');
const router = express.Router();
const userList = require("./list");
const friends = require("./friends");
const syncContacts = require("./syncContacts");
const auth = require('../auth');
const error = require('../error');

router.get(`/list`,
userList.list,
error
)

router.get(`/friendSuggestions`,
auth,
friends.suggestions,
error
)

router.post(`/syncContacts`,
auth,
syncContacts.upload,
error
)

module.exports = router;