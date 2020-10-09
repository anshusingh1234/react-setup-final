const express = require('express');
const router = express.Router();
const createPost = require("./createPost");
const feeds = require("./feeds");
const timeline = require("./timeline");
const deletePost = require("./deletePost");
const updatePost = require("./updatePost");
const detail = require("./detail");
const report = require("./report");
const hide = require("./hide");
const auth = require('../auth');
const error = require('../error');
const mediaUploader = require("../common/mediaUploader");

router.post(`/post`,
auth,
createPost.formDataWrapper,
createPost.validateBody,
mediaUploader.uploadReqFiles,
createPost.saveInMongo,
createPost.saveInES,
createPost.buildResponse,
createPost.tagPushNotification,
error);

router.get(`/search`,
auth,
feeds.search,
feeds.fetchDetails,
feeds.buildResponse,
error);

router.delete(`/post`,
auth,
deletePost.validate,
deletePost.inMongo,
deletePost.inElastic,
error);

router.patch(`/post`,
auth,
updatePost.validate,
updatePost.updateInMongo,
updatePost.updateInES,
error);

router.get(`/timeline`,
auth,
timeline.validate,
timeline.checkProfileVisibiility,
timeline.search,
timeline.fetchDetails,
error);

router.patch(`/post/report`,
auth,
report.validate,
report.save,
error);

router.get(`/post/detail`,
auth,
detail.validate,
detail.checkForPrivacy,
detail.fetchDetails,
detail.buildResponse,
error);

router.patch(`/post/hide`,
auth,
hide.validate,
hide.save,
error);

module.exports = router;