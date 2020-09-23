const express = require('express');
const router = express.Router();
const userList = require("./list");
const auth = require('../auth');
const error = require('../error');

router.get(`/list`,
  userList.list,
  error
)

module.exports = router;