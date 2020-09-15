const express = require('express');
const router = express.Router();
const createPost = require("./createPost");
const feeds = require("./feeds");
const timeline = require("./timeline");
const deletePost = require("./deletePost");

router.post(`/post`,
createPost.validateBody,
createPost.saveInMongo,
createPost.saveInES,
)

router.get(`/search`,
feeds.search
)

router.delete(`/post`,
deletePost.validate,
deletePost.inMongo,
deletePost.inElastic
)

router.get(`/timeline`,
timeline.validate,
timeline.search,
timeline.fetchDetails
)

module.exports = router;