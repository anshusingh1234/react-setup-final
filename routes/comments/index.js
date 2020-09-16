const express = require('express');
const router = express.Router();
const getComment = require("./list");
const addComment = require("./add");
const editComment = require("./edit");
const deleteComment = require("./delete");


router.post(`/add`,
    addComment.validateBody,
    addComment.saveInMongo,
    addComment.saveInES,
)

router.put(`/edit`,
    editComment.validateBody,
    editComment.saveInMongo,
    editComment.saveInES,
)

router.get(`/list`,
    getComment.validate,
    getComment.list
)

router.delete(`/delete`,
    deleteComment.validate,
    deleteComment.inMongo,
    deleteComment.inElastic
)

module.exports = router;