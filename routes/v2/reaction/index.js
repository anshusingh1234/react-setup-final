const express = require('express');
const router = express.Router();
const addReaction = require("./add");
const deleteReaction = require("./delete");
const listUsers = require("./list");
const auth = require('../auth');
const error = require('../error');

router.post(`/add`,
  auth,
  addReaction.validateBody,
  addReaction.saveInMongo,
  addReaction.saveInES,
  error
)

router.delete(`/delete`,
  auth,
  deleteReaction.validateBody,
  deleteReaction.inMongo,
  deleteReaction.inElastic,
  error
)


router.get(`/getUsers`,
  auth,
  listUsers.validateBody,
  listUsers.inMongo,
  error
)

module.exports = router;