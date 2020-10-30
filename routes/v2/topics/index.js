const express = require('express');
const router = express.Router();
const getTopic = require("./list");
const addTopic = require("./add");
const editTopic = require("./edit");
const deleteTopic = require("./delete");
const auth = require('../auth');
const error = require('../error');
const mediaUploader = require("../common/mediaUploader");

router.post(`/add`,
auth,
addTopic.formDataWrapper,
mediaUploader.uploadReqFiles,
addTopic.validateBody,
addTopic.saveInMongo,
error
)

router.put(`/edit`,
auth,
editTopic.validateBody,
editTopic.updateInMongo,
error
)

router.get(`/list`,
auth,
getTopic.validateBody,
getTopic.list,
error
)

router.delete(`/delete`,
auth,
deleteTopic.validateBody,
deleteTopic.inMongo,
error
)

module.exports = router;