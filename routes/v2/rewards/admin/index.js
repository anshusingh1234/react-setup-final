const express = require('express');
const router = express.Router();
const createPost = require("./createPost");
const adminAuth = require('../../adminAuth');
const error = require('../../error');

router.post(`/post`,
adminAuth,
createPost.validate,
createPost.saveInMongo,
createPost.saveInES,
createPost.buildResponse,
error);

module.exports = router;