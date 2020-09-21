const express= require('express');
const router= express.Router();

const feeds = require('./feeds');
const comments = require('./comments');
const common = require('./common');
const rewards = require('./rewards');

router.use('/feeds', feeds);
router.use('/comments', comments)
router.use('/common', common)
router.use('/rewards', rewards)

module.exports= router;
