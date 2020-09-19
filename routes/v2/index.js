const express= require('express');
const router= express.Router();

const feeds = require('./feeds');
const comments = require('./comments');
const common = require('./common');

router.use('/feeds', feeds);
router.use('/comments',comments)
router.use('/common',common)

module.exports= router;
