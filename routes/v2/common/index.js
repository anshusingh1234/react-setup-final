const express = require('express');
const router = express.Router();
const config = require("./config");
const error = require('../error');


router.get(`/config`,
  config.getConfig,
  error
)

module.exports = router;