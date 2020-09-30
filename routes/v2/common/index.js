const express = require('express');
const router = express.Router();
const config = require("./config");
const mediaUploader = require("./mediaUploader");
const error = require('../error');


router.get(`/config`,
config.getConfig,
error
)

router.post(`/media`,
mediaUploader.uploadFormData,
error
)

module.exports = router;