const express = require('express');
const router = express.Router();
const getComment = require("./list");
const addComment = require("./add");
const editComment = require("./edit");
const deleteComment = require("./delete");
const auth = require('../auth');
const error = require('../error');


router.post(`/add`,
auth,
addComment.validateBody,
addComment.saveInMongo,
addComment.saveInES,
error
)

router.put(`/edit`,
auth,
editComment.validateBody,
editComment.verifyOwner,
editComment.updateInMongo,
error
)

router.get(`/list`,
auth,
getComment.validateBody,
getComment.list,
error
)

router.delete(`/delete`,
auth,
deleteComment.validateBody,
deleteComment.verifyOwner,
deleteComment.inMongo,
deleteComment.inElastic,
error
)

module.exports = router;