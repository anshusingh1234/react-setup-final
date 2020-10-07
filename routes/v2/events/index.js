const express = require('express');
const router = express.Router();
const match = require("./match");
const auth = require('../auth');
const error = require('../error');


router.get(`/match/search`,
auth,
match.validateBody,
match.oneToOneSearch,
error
)


module.exports = router;