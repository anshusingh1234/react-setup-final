const express = require('express');
const router = express.Router();
const admin = require("./admin");
const timeline = require("./timeline");
const auth = require('../auth');
const error = require('../error');

router.use(`/admin`, admin);

router.use(`/timeline`,
auth,
timeline.validate,
timeline.search,
timeline.fetchDetails,
error);

module.exports = router;