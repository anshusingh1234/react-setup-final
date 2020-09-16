const express= require('express');
const router= express.Router();

const feeds = require('./feeds');

router.use('/feeds', feeds)

module.exports= router;
