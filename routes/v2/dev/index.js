const express = require('express');
const router = express.Router();
const notification = require("./notification");
const auth = require('../auth');
const error = require('../error');


router.post(`/notification`,
auth,
notification.trigger,
error
)


module.exports = router;