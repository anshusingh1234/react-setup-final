const express = require('express');
const router = express.Router();
const createPost = require("./createPost");
const feeds = require("./feeds");

router.post(`/post`,
createPost.validateBody,
createPost.saveInMongo,
createPost.saveInES,
)

router.get(`/search`,
feeds.search
)

module.exports = router;