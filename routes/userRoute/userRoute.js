const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController');
const postController =require('../../controllers/postController') 
const eventController = require('../../controllers/eventController')
const validation = require('../../middleware/validation');
const auth = require('../../middleware/auth')

/**
 * @swagger
 * /api/v1/user/otpSent:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: countryCode
 *         description: countryCode
 *         in: formData
 *         required: true
 *       - name: mobileNumber
 *         description: mobileNumber
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: otp sent successful
 *       409:
 *         description: This mobile number already exists
 *       500:
 *         description: Internal Server Error
 */
router.post('/otpSent',userController.otpSent)
/**
 * @swagger
 * /api/v1/user/verifyOtp:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: mobileNumber
 *         description: mobileNumber
 *         in: formData
 *         required: true
 *       - name: otp
 *         description: otp
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: otp verify successful
 *       404:
 *         description: Invalid otp
 *       500:
 *         description: Internal Server Error
 */
router.post('/verifyOtp',userController.verifyOtp)
/**
 * @swagger
 * /api/v1/user/resendOtp:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: mobileNumber
 *         description: mobileNumber
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: otp sent successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/resendOtp',userController.resendOtp)
/**
 * @swagger
 * /api/v1/user/socialLogin:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
*       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: socialId
 *         description: socialId
 *         in: formData
 *         required: true
 *       - name: loginType
 *         description: loginType
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Login successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/socialLogin',userController.socialLogin)
/**
 * @swagger
 * /api/v1/user/getFriendWithSocialLogin:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: socialId
 *         description: socialId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Friends found on jigar successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/getFriendWithSocialLogin',userController.getFriendWithSocialLogin)

/**
 * @swagger
 * /api/v1/user/importContact:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: contactData
 *         description: contactData
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Contact found on jigar successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/importContact',userController.importContact)

/**
 * @swagger
 * /api/v1/user/addFriend:
 *  post:
 *    tags:
 *       - USER
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - in: body
 *         name: friend
 *         description: add friend.
 *         schema:
 *           type: object
 *           required:
 *             - friends
 *           properties:
 *             friends:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 friendId:
 *                   type: string
 *    responses:
 *       200:
 *         description: Contact added successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error.   
 */
router.post('/addFriend',userController.addFriend)
/**
 * @swagger
 * /api/v1/user/getFriendList:
 *   get:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: pageNumber
 *         description: pageNumber
 *         in: query
 *         required: true
 *       - name: limit
 *         description: limit
 *         in: query
 *         required: true
 *     responses:
 *       200:
 *         description: Friend list get successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.get('/getFriendList',userController.getFriendList)
/**
 * @swagger
 * /api/v1/user/addBasicInfo:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: name
 *         description: name
 *         in: formData
 *         required: false
 *       - name: nickName
 *         description: nickName
 *         in: formData
 *         required: false
 *       - name: image
 *         description: image
 *         in: formData
 *         required: false
 *       - name: mirrorFlyId
 *         description: mirrorFlyId
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Data Saved successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/addBasicInfo',userController.addBasicInfo)
/**
 * @swagger
 * /api/v1/user/blockUnblockUserProfile:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: _id
 *         in: header
 *         required: true
 *       - name: userId
 *         description: userId
 *         in: formData
 *         required: true
 *       - name: status
 *         description: BLOCK/UNBLOCK
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: user block successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */

router.post('/blockUnblockUserProfile',userController.blockUnblockUserProfile)
/**
 * @swagger
 * /api/v1/user/reportUser:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: reportTo
 *         description: reportTo
 *         in: formData
 *         required: true
 *       - name: reason
 *         description: reason
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Data is saved successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */

router.post('/reportUser',userController.reportUser)

/**
 * @swagger
 * /api/v1/user/showUserProfile:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: userId
 *         in: formData
 *         required: true
 *       - name: user
 *         description: user
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: user found successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */

router.post('/showUserProfile',userController.showUserProfile)

/**
 * @swagger
 * /api/v1/user/deleteAccount:
 *   delete:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: Requested data not found
 *       500:
 *         description: Internal Server Error
 */

router.delete('/deleteAccount',userController.deleteAccount)


/**
 * @swagger
 * /api/v1/user/editProfile:
 *   put:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: userId
 *         in: formData
 *         required: true
 *       - name: profilePrivacy
 *         description: profilePrivacy
 *         in: formData
 *         required: false
 *       - name: name
 *         description: name
 *         in: formData
 *         required: false
 *       - name: surName
 *         description: surName
 *         in: formData
 *         required: false
 *       - name: aboutMe
 *         description: aboutMe
 *         in: formData
 *         required: false
 *       - name: age
 *         description: age
 *         in: formData
 *         required: false
 *       - name: aboutMe
 *         description: aboutMe
 *         in: formData
 *         required: false
 *       - name: intersts
 *         description: intersts
 *         in: formData
 *         required: false
 *       - name: favoriteFood
 *         description: favoriteFood
 *         in: formData
 *         required: false
 *       - name: language
 *         description: language
 *         in: formData
 *         required: false
 *       - name: image
 *         description: image
 *         in: formData
 *         required: false
 *       - name: location
 *         description: location
 *         in: formData
 *         required: false
 *       - name: profile
 *         description: profile
 *         in: formData
 *         required: false
 *       - name: gender
 *         description: gender
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Successfully updated
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.put('/editProfile',userController.editProfile)
/**
 * @swagger
 * /api/v1/user/showMyProfile/{_id}:
 *   get:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: _id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Details have been fetched successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */

router.get('/showMyProfile/:_id',userController.showMyProfile)
/**
 * @swagger
 * /api/v1/user/viewPost/{_id}:
 *   get:
 *     tags:
 *       - USER
 *     description: Check fountryor Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: _id
 *         description: postId
 *         in: path
 *         required: true   
 *     responses:
 *       200:
 *         description: Details have been fetched successfully.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/viewPost/:_id', postController.viewPost)
/**
 * @swagger
 * /api/v1/user/postComment:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: postId
 *         description: postId
 *         in: formData
 *         required: true
 *       - name: comment
 *         description: comment
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: post created successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/postComment',postController.postComment)
// /**
//  * @swagger
//  * /api/v1/user/editComment:
//  *   post:
//  *     tags:
//  *       - USER
//  *     description: Check for Social existence and give the access Token 
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: _id
//  *         description: _id
//  *         in: headers
//  *         required: true
//  *       - name: postId
//  *         description: postId
//  *         in: formData
//  *         required: true
//  *       - name: commented
//  *         description: commentId
//  *         in: formData
//  *         required: true
//  *       - name: comment
//  *         description: comment
//  *         in: formData
//  *         required: true
//  *     responses:
//  *       200:
//  *         description: comment edited successfully
//  *       404:
//  *         description: Invalid credentials
//  *       500:
//  *         description: Internal Server Error
//  */

router.post('/editComment',postController.editComment)
/**
 * @swagger
 * /api/v1/user/replyOnComment:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: postId
 *         description: postId
 *         in: formData
 *         required: true
 *       - name: commentId
 *         description: commentId
 *         in: formData
 *         required: true
 *       - name: comment
 *         description: comment
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Replied successfully successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/replyOnComment',postController.replyOnComment)
/**
 * @swagger
 * /api/v1/user/LikesOnComment:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: postId
 *         description: postId
 *         in: formData
 *         required: true
 *       - name: commentId
 *         description: commentId
 *         in: formData
 *         required: true
 *       - name: likeSymbol
 *         description: likeSymbol
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Replied successfully successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/LikesOnComment',postController.LikesOnComment)
/**
/**
 * @swagger
 * /api/v1/user/hidePost:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userID
 *         in: header
 *         required: true
 *       - name: postId
 *         description: postId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description:Post hide successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/hidePost',postController.hidePost)

/**
 * @swagger
 * /api/v1/user/postReport:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: _id
 *         in: headers
 *         required: true
 *       - name: postId
 *         description: postId
 *         in: formData
 *         required: true
 *       - name: reason
 *         description: reason
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: data found successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */

router.post('/postReport',postController.postReport)

router.post('/removeFriend',userController.removeFriend)
/**
 * @swagger
 * /api/v1/user/createPost:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: text
 *         description: text
 *         in: formData
 *         required: false
 *       - name: tagFriends
 *         description: tagFriends
 *         in: formData
 *         required: false
 *       - name: tagFriends
 *         description: tagFriends
 *         in: formData
 *         required: false
 *       - name: privacy
 *         description: privacy
 *         in: formData
 *         required: false
 *       - name: location
 *         description: location
 *         in: formData
 *         required: false
 *       - name: activity
 *         description: activity
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description:your Post posted successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/createPost',postController.createPost)

router.post('/testing', postController.testing)
/**
 * @swagger
 * /api/v1/user/uploadImageAndVideo:
 *   put:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: media_id
 *         description: postid
 *         in: headers
 *         required: true
 *       - name: image
 *         description: image
 *         in: formData
 *         required: false
 *       - name: video
 *         description: video
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description:Posting  successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.put('/uploadImageAndVideo',postController.uploadImageAndVideo)
/**
 * @swagger
 * /api/v1/user/followUser:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: followingId
 *         description: followingId
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description: User follow  successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/followUser',userController.followUser)
/**
 * @swagger
 * /api/v1/user/unFollowUser:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: followingId
 *         description: followingId
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description:User Unfollow  successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/unFollowUser',userController.unFollowUser)
/**
 * @swagger
 * /api/v1/user/acceptRequest:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: senderId
 *         description: senderId
 *         in: formData
 *         required: true
 *       - name: response
 *         description: response
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: User follow  successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/acceptRequest',userController.acceptRequest)

/**
 * @swagger
 * /api/v1/user/followingList:
 *   get:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: userId
 *         description: userId
 *         in: formData
 *         required: true
 *       - name: pageNumber
 *         description: pageNumber
 *         in: formData
 *         required: false
 *       - name: limit
 *         description: limit
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description:Following list get successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/followingList',userController.followingList)
/**
 * @swagger
 * /api/v1/user/followerList:
 *   get:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: userId
 *         description: userId
 *         in: formData
 *         required: true
 *       - name: pageNumber
 *         description: pageNumber
 *         in: formData
 *         required: false
 *       - name: limit
 *         description: limit
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description:Follower list get successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/followerList',userController.followerList)
/**
 * @swagger
 * /api/v1/user/editPost:
 *   put:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: postId
 *         description: postId
 *         in: formData
 *         required: true
 *       - name: image
 *         description: image
 *         in: formData
 *         required: false
 *       - name: video
 *         description: video
 *         in: formData
 *         required: false
 *       - name: text
 *         description: text
 *         in: formData
 *         required: false
 *       - name: tagFriends
 *         description: tagFriends
 *         in: formData
 *         required: false
 *       - name: tagFriends
 *         description: tagFriends
 *         in: formData
 *         required: false
 *       - name: privacy
 *         description: privacy
 *         in: formData
 *         required: false
 *       - name: location
 *         description: location
 *         in: formData
 *         required: false
 *       - name: activity
 *         description: activity
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description:your Post updated successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.put('/editPost',postController.editPost)
/**
 * @swagger
 * /api/v1/user/myPostList:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: pageNumber
 *         description: pageNumber
 *         in: formData
 *         required: false
 *       - name: limit
 *         description: limit
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description:Post list get successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/myPostList',postController.myPostList)
router.put('/editPost',postController.editPost)
/**
 * @swagger
 * /api/v1/user/postList:
 *   get:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: pageNumber
 *         description: pageNumber
 *         in: path
 *         required: true
 *       - name: limit
 *         description: limit
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description:Post list get successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/postList',postController.postList)


/**
 * @swagger
 * /api/v1/user/userPostList/{_id}:
 *   get:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: _id
 *         description: _id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description:Post list get successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/userPostList',postController.userPostList)
/**
 * @swagger
 * /api/v1/user/deletePost:
 *   delete:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userID
 *         in: header
 *         required: true
 *       - name: postId
 *         description: postId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description:Post deleted successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deletePost',postController.deletePost)
/**
 * @swagger
 * /api/v1/user/likeAndDislikePost:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: postId
 *         description: postId
 *         in: formData
 *         required: true
 *       - name: like
 *         description: true/false
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description:Post  liked/dislike  successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/likeAndDislikePost',postController.likeAndDislikePost)
/**
 * @swagger
 * /api/v1/user/editPostComment:
 *   put:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: postId
 *         description: postId
 *         in: formData
 *         required: true
 *       - name: commented
 *         description: comment Id
 *         in: formData
 *         required: true
 *       - name: comment
 *         description: comment
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description:your comment updated successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.put('/editPostComment',postController.editPostComment)

router.delete('/deleteComment',postController.deleteComment)
/**
 * @swagger
 * /api/v1/user/friendSuggestion:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: _id
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description: Details have been fetched successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/friendSuggestion',userController.friendSuggestion)

router.get('/friendsRecommendation', userController.friendsRecommendation)

router.get('/peopleYouMayKnow', userController.peopleYouMayKnow)

router.post('/searchFriend', userController.searchFriend)
/**
 * @swagger
 * /api/v1/user/myBlockUserList:
 *   get:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: _id
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description: Details have been fetched successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */

router.get('/myBlockUserList',userController.myBlockUserList)
/**
 * @swagger
 * /api/v1/user/feedback:
 *   post:
 *     tags:
 *       - FEEDBACK-USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: _id
 *         description: eventId
 *         in: formData
 *         required: true
 *       - name: overAllExp
 *         description: overAllExp
 *         in: formData
 *         required: false
 *       - name: punctualTime
 *         description: punctualTime
 *         in: formData
 *         required: false
 *       - name: welcome
 *         description: welcome
 *         in: formData
 *         required: false
 *       - name: recommend
 *         description: recommend
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description:Feedback  posted successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/feedback',userController.feedback)
/**
 * @swagger
 * /api/v1/user/feedbackList:
 *   get:
 *     tags:
 *       - FEEDBACK-USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description: Data found successfully
 *       404:
 *         description: Requested data not found
 *       500:
 *         description: Internal Server Error
 */

router.get('/feedbackList',userController.feedbackList)
/**
 * @swagger
 * /api/v1/user/feedbackOnMyEvent:
 *   post:
 *     tags:
 *       - FEEDBACK-USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: eventId
 *         description: eventId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Data found successfully
 *       404:
 *         description: Requested data not found
 *       500:
 *         description: Internal Server Error
 */

router.post('/feedbackOnMyEvent',userController.feedbackOnMyEvent)

/**
 * @swagger
 * /api/v1/user/viewFeedback:
 *   post:
 *     tags:
 *       - FEEDBACK-USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: feedbackId
 *         description: feedbackId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Details have been fetched successfully.
 *       404:
 *         description: Requested data not found
 *       500:
 *         description: Internal Server Error
 */

router.post('/viewFeedback', userController.viewFeedback)
/**
 * @swagger
 * /api/v1/user/checkOnlineStatus:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: onlineStatus
 *         description: onlineStatus
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Data Saved successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/checkOnlineStatus',userController.checkOnlineStatus)
router.post('/replyOnComment',postController.replyOnComment)

router.get('/commentList/:_id',postController.commentList)
/**
 * @swagger
 * /api/v1/user/deleteReplyComment:
 *   delete:
 *     tags:
 *       USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: postId
 *         description: postId
 *         in: formData
 *         required: true
 *       - name: commentId
 *         description: commentId
 *         in: formData
 *         required: true
 *       - name: replyId
 *         description: replyId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Reply comment deleted successfully
 *       404:
 *         description: Requested data not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deleteReplyComment',postController.deleteReplyComment)

router.put('/updateReplyComment',postController.updateReplyComment)
/**
 * @swagger
 * /api/v1/user/InterestList:
 *   get:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description:Interest list get successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.get('/InterestList',userController.InterestList)
/**
 * @swagger
 * /api/v1/user/foodList:
 *   get:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description:food list get successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.get('/foodList',userController.foodList)
/**
 * @swagger
 * /api/v1/user/languageList:
 *   get:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description:Language list get successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.get('/languageList',userController.languageList)

router.post('/replyCommentLists',postController.replyCommentLists)
/**
 * @swagger
 * /api/v1/user/userReward:
 *   get:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description:Data found successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */

router.get('/userReward',userController.userReward)
/**
 * @swagger
 * /api/v1/user/rewardList:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: page
 *         description: page
 *         in: formData
 *         required: true
 *       - name: limit
 *         description: limit
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description:Data found successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/rewardList',userController.rewardList)

router.get('/userTest',userController.userTest)
/**
 * @swagger
 * /api/v1/user/likeAndDislikeReward:
 *   get:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: like
 *         description: true/false
 *         in: formData
 *         required: true
 *       - name: rewardId
 *         description: rewardId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description:like/dislike successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/likeAndDislikeReward',userController.likeAndDislikeReward)
/**
 * @swagger
 * /api/v1/user/rewardComment:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: rewardId
 *         description: rewardId
 *         in: formData
 *         required: true
 *       - name: comment
 *         description: comment
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description:comment successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/rewardComment',userController.rewardComment)

/**
 * @swagger
 * /api/v1/user/rewardCommentList:
 *   get:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: _id
 *         description: _id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description:comment successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.get('/rewardCommentList/:_id',userController.rewardCommentList)

/**
 * @swagger
 * /api/v1/user/deleteRewardComment:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: postId
 *         description: postId
 *         in: formData
 *         required: true
 *       - name: commentId
 *         description: commentId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description:comment deleted successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deleteRewardComment',userController.deleteRewardComment)

router.put('/editRewardComment',userController.editRewardComment)

router.post('/likeRewardComment',userController.likeRewardComment)

router.post('/rewardReplyOnComment',userController.rewardReplyOnComment)

router.delete('/rewardDeleteReplyComment',userController.rewardDeleteReplyComment)

router.put('/rewardUpdateReplyComment',userController.rewardUpdateReplyComment)

router.post('/rewardReplyCommentLists',userController.rewardReplyCommentLists)

router.post('/getMyFriendList',userController.getMyFriendList)

router.post('/createGroup',userController.createGroup)

router.post('/addGroupMember',userController.addGroupMember)

router.post('/searchContact',userController.searchContact)

router.post('/rewardPostReport',userController.rewardPostReport)

//router.post('/friendData',userController.friendData)
/**
 * @swagger
 * /api/v1/user/friends:
 *   get:
 *     tags:
 *       - USER
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: userId
 *         description: userId
 *         in: formData
 *         required: true
 *       - name: pageNumber
 *         description: pageNumber
 *         in: formData
 *         required: false
 *       - name: limit
 *         description: limit
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description:Friend list get successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/friends',userController.friends)
/**
 * @swagger
 * /api/v1/user/sendFriendRequest:
 *  post:
 *    tags:
 *       - USER
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: friendId
 *         description: friendId
 *         in: formData
 *         required: true
 *    responses:
 *       200:
 *         description: Friend Request sent  successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error.   
 */
router.post('/sendFriendRequest',userController.sendFriendRequest)

router.post('/actionToFriendRequest',userController.actionToFriendRequest)

/**
 * @swagger
 * /api/v1/user/followStatus:
 *  post:
 *    tags:
 *       - USER
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: userId
 *         description: userId
 *         in: formData
 *         required: true
 *    responses:
 *       200:
 *         description: Follow Status found
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error.   
 */
router.post('/followStatus',userController.followStatus)
/**
 * @swagger
 * /api/v1/user/friendStatus:
 *  post:
 *    tags:
 *       - USER
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: userId
 *         description: userId
 *         in: formData
 *         required: true
 *    responses:
 *       200:
 *         description: Follow Status found
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error.   
 */
router.post('/friendStatus',userController.friendStatus)
router.post('/unblockUser',userController.unblockUser)

router.post('/bookmarkProfile', userController.bookmarkProfile)

router.post('/applicationSearch', userController.applicationSearch)


module.exports = router;   
