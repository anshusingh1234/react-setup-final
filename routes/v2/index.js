const express= require('express');
const router= express.Router();

const feeds = require('./feeds');
const comments = require('./comments');

router.use('/feeds', feeds);
router.use('/comments',comments)

module.exports= router;
