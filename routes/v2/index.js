const express= require('express');
const router= express.Router();
const jConfig = require("../../config/jigrrConfig").getConfig();

const feeds = require('./feeds');
const comments = require('./comments');
const common = require('./common');
const reaction = require('./reaction');
const rewards = require('./rewards');
const users = require('./users');
const topics = require('./topics');
const events = require('./events');
const dev = require('./dev');

router.use('/feeds', feeds);
router.use('/comments',comments);
router.use('/common',common);
router.use('/reaction',reaction);
router.use('/rewards', rewards);
router.use('/users', users);
router.use('/topics', topics);
router.use('/events', events);

['dev', 'local'].includes(jConfig.ENV) && router.use('/dev', dev);

module.exports= router;
