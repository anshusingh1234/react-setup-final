const express = require('express');
const router = express.Router();
const createPost = require("./createPost");
const feeds = require("./feeds");
const timeline = require("./timeline");
const deletePost = require("./deletePost");
const auth = require('../auth');
const error = require('../error');

router.post(`/post`,
auth,
createPost.validateBody,
createPost.saveInMongo,
createPost.saveInES,
error);

router.get(`/search`,
auth,
feeds.search,
error);

router.delete(`/post`,
auth,
deletePost.validate,
deletePost.inMongo,
deletePost.inElastic,
error);

router.get(`/timeline`,
auth,
timeline.validate,
timeline.search,
timeline.fetchDetails,
error);

module.exports = router;