const express = require('express');
const router = express.Router();
const addReaction = require("./add");
const deleteReaction = require("./delete");
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
  deleteReaction.verifyOwner,
  deleteReaction.inMongo,
  deleteReaction.inElastic,
  error
)

module.exports = router;