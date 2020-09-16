const express= require('express');
const router= express.Router();

const admin= require('./adminRoute/adminRoute');
const user= require('./userRoute/userRoute');
const staticContent=require('./staticRoute/staticContentRoute')
const event= require('./eventRoute/eventRoute');
const feeds = require('./feeds');
const comments = require('./comments');

router.use('/admin', admin)
router.use('/user',user)
router.use('/static', staticContent)
router.use('/event',event)
router.use('/feeds',feeds)
router.use('/comments',comments)

module.exports= router;
