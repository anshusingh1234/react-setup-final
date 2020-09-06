const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController');
const eventController = require('../../controllers/eventController')
const validation = require('../../middleware/validation');
const auth = require('../../middleware/auth')

/**
 * @swagger
 * /api/v1/event/createEvent:
 *   post:
 *     tags:
 *       - USER-EVENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: eventType
 *         description: OFLINE/ONLINE_GENERAL
 *         in: formData
 *         required: true
 *       - name: onlieEentType
 *         description: VIDEO_MEET/LIVE_STREAM
 *         in: formData
 *         required: false
 *       - name: eventCategoryId
 *         description: eventCategoryId
 *         in: formData
 *         required: false
 *       - name: eventCategoryName
 *         description: eventCategoryName
 *         in: formData
 *         required: false
 *       - name: image
 *         description: image
 *         in: formData
 *         required: false
 *       - name: video
 *         description: video
 *         in: formData
 *         required: false
 *       - name: title
 *         description: title
 *         in: formData
 *         required: false
 *       - name: participant
 *         description: participant
 *         in: formData
 *         required: false
 *       - name: date
 *         description: date
 *         in: formData
 *         required: false
 *       - name: time
 *         description: time
 *         in: formData
 *         required: false
 *       - name: privacy
 *         description: privacy
 *         in: formData
 *         required: false
 *       - name: pricePerPerson
 *         description: pricePerPerson
 *         in: formData
 *         required: false
 *       - name: radius
 *         description: radius
 *         in: formData
 *         required: false
 *       - name: lat
 *         description: lat
 *         in: formData
 *         required: false
 *       - name: long
 *         description: long
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: event created successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/createEvent', eventController.createEvent)
/**
 * @swagger
 * /api/v1/event/editEvent:
 *   put:
 *     tags:
 *       - USER-EVENT
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
 *       - name: eventCategoryId
 *         description: eventCategoryId
 *         in: formData
 *         required: false
 *       - name: image
 *         description: image
 *         in: formData
 *         required: false
 *       - name: video
 *         description: video
 *         in: formData
 *         required: false
 *       - name: description
 *         description: description
 *         in: formData
 *         required: false
 *       - name: participant
 *         description: participant
 *         in: formData
 *         required: false
 *       - name: date
 *         description: date
 *         in: formData
 *         required: false
 *       - name: time
 *         description: time
 *         in: formData
 *         required: false
 *       - name: location
 *         description: location
 *         in: formData
 *         required: false
 *       - name: privacy
 *         description: privacy
 *         in: formData
 *         required: false
 *       - name: pricePerPerson
 *         description: pricePerPerson
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description:your event updated successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.put('/editEvent', eventController.editEvent)
/**
 * @swagger
 * /api/v1/event/event:
 *   delete:
 *     tags:
 *       - USER-EVENT
 *     description: Check for Social 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userID
 *         in: header
 *         required: true
 *       - name: eventId
 *         description: eventId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description:Event deleted successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.delete('/event', eventController.deleteEvent)
/**
 * @swagger
 * /api/v1/event/addEventCategory:
 *   post:
 *     tags:
 *       - USER-EVENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: eventCategoryName
 *         description: eventCategoryName
 *         in: formData
 *         required: true
 *       - name: image
 *         description: image
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Event category has been added successfully
 *       404:
 *         description: This event category already exists
 *       500:
 *         description: Internal Server Error
 */
router.post('/addEventCategory', eventController.addEventCategory)
/**
 * @swagger
 * /api/v1/event/cancelEvent:
 *   post:
 *     tags:
 *       - USER-EVENT
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
 *         description: Event cancel successfully
 *       404:
 *         description: Requested data not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/cancelEvent', eventController.cancelEvent)
/**
 * @swagger
 * /api/v1/event/eventCategoryList:
 *   post:
 *     tags:
 *       - USER-EVENT
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
router.get('/eventCategoryList', eventController.eventCategoryList)
/**
 * @swagger
 * /api/v1/event/joinEventRequest:
 *   post:
 *     tags:
 *       - USER-EVENT
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
 *         description: Request for join event successfully
 *       404:
 *         description: Requested data not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/joinEventRequest', eventController.joinEventRequest)

/**
 * @swagger
 * /api/v1/event/cancelEventRequest:
 *   post:
 *     tags:
 *       - USER-EVENT
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
 *         description: Request for join event cancelled successfully
 *       404:
 *         description: Requested data not found
 *       500:
 *         description: Internal Server Error
 */

router.post('/cancelEventRequest', eventController.cancelEventRequest)
/**
 * @swagger
 * /api/v1/event/acceptRejectJoinRequest:
 *   post:
 *     tags:
 *       - USER-EVENT
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
 *       - name: joinId
 *         description: joinId
 *         in: formData
 *         required: true
 *       - name: response
 *         description: ACCEPT
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Request for join event accepted successfully
 *       404:
 *         description: Requested data not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/acceptRejectJoinRequest', eventController.acceptRejectJoinRequest)

//*********************************************************************************** Online Event************************************************ */
/**
 * @swagger
 * /api/v1/event/createAntakshriEvent:
 *   post:
 *     tags:
 *       - USER-EVENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: image
 *         description: image
 *         in: formData
 *         required: false
 *       - name: video
 *         description: video
 *         in: formData
 *         required: false
 *       - name: title
 *         description: title
 *         in: formData
 *         required: false
 *       - name: participant
 *         description: participant
 *         in: formData
 *         required: false
 *       - name: date
 *         description: date
 *         in: formData
 *         required: false
 *       - name: time
 *         description: time
 *         in: formData
 *         required: false
 *       - name: privacy
 *         description: Only Seleted friends/Public/Friends of Friends/Friends
 *         in: formData
 *         required: false
 *       - name: refree
 *         description: refree
 *         in: formData
 *         required: false
 *       - name: suggestedThinkingTime
 *         description: suggestedThinkingTime
 *         in: formData
 *         required: false
 *       - name: votingSystem
 *         description: votingSystem
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description:event created successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/createAntakshriEvent', eventController.createAntakshriEvent)
/**
 * @swagger
 * /api/v1/event/notificationList:
 *   get:
 *     tags:
 *       - USER-EVENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: page
 *         description: page
 *         in: query
 *         required: true
 *       - name: limit
 *         description: limit
 *         in: query
 *         required: true
 *     responses:
 *       200:
 *         description: Data found successfully
 *       404:
 *         description: Requested data not found
 *       500:
 *         description: Internal Server Error
 */

router.get('/notificationList', eventController.notificationList)
/**
 * @swagger
 * /api/v1/event/myEventList:
 *   get:
 *     tags:
 *       - USER-EVENT
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

router.get('/myEventList', eventController.myEventList)
/**
 * @swagger
 * /api/v1/event/viewEvent/{_id}:
 *   get:
 *     tags:
 *       - USER-EVENT
 *     description: Check fountryor Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: _id
 *         description: eventId
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

router.get('/viewEvent/:_id', eventController.viewEvent)
/**
 * @swagger
 * /api/v1/event/createRoom:
 *   post:
 *     tags:
 *       - ROOM
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: title
 *         description: title
 *         in: formData
 *         required: true
 *       - name: gender
 *         description: Male/Female/Mixed
 *         in: formData
 *         required: true
 *       - name: ageRange
 *         description: Teen/Twenties/Thirties/Forties
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description:Room created successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/createRoom', eventController.createRoom)
/**
 * @swagger
 * /api/v1/event/editAntakshri:
 *   put:
 *     tags:
 *       - USER-EVENT
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
 *         in: header
 *         required: true
 *       - name: image
 *         description: image
 *         in: formData
 *         required: false
 *       - name: video
 *         description: video
 *         in: formData
 *         required: false
 *       - name: title
 *         description: title
 *         in: formData
 *         required: false
 *       - name: participant
 *         description: participant
 *         in: formData
 *         required: false
 *       - name: date
 *         description: date
 *         in: formData
 *         required: false
 *       - name: time
 *         description: time
 *         in: formData
 *         required: false
 *       - name: privacy
 *         description: privacy
 *         in: formData
 *         required: false
 *       - name: refree
 *         description: refree
 *         in: formData
 *         required: false
 *       - name: suggestedThinkingTime
 *         description: suggestedThinkingTime
 *         in: formData
 *         required: false
 *       - name: votingSystem
 *         description: votingSystem
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description:event created successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.put('/editAntakshri', eventController.editAntakshri)
/**
 * @swagger
 * /api/v1/event/networkEventList:
 *   post:
 *     tags:
 *       - USER-EVENT
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

router.post('/networkEventList', eventController.networkEventList)
/**
 * @swagger
 * /api/v1/event/editOnlineEvent:
 *   put:
 *     tags:
 *       - USER-EVENT
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
 *       - name: image
 *         description: image
 *         in: formData
 *         required: false
 *       - name: video
 *         description: video
 *         in: formData
 *         required: false
 *       - name: title
 *         description: title
 *         in: formData
 *         required: false
 *       - name: participant
 *         description: participant
 *         in: formData
 *         required: false
 *       - name: date
 *         description: date
 *         in: formData
 *         required: false
 *       - name: time
 *         description: time
 *         in: formData
 *         required: false
 *       - name: privacy
 *         description: privacy
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description:your event updated successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.put('/editOnlineEvent', eventController.editOnlineEvent)
/**
 * @swagger
 * /api/v1/event/joinEventRequestList:
 *   post:
 *     tags:
 *       - USER-EVENT
 *     description: Check fountryor Social existence and give the access Token 
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
 *         description: Details have been fetched successfully.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/joinEventRequestList', eventController.joinEventRequestList)
/**
 * @swagger
 * /api/v1/event/titleSearch:
 *   get:
 *     tags:
 *       - USER-EVENT
 *     description: Check fountryor Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: title
 *         description: title
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

router.get('/titleSearch', eventController.titleSearch)
/**
 * @swagger
 * /api/v1/event/uploadImageAndVideo:
 *   put:
 *     tags:
 *       - USER-EVENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: media_id
 *         description: eventId
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
 *     responses:
 *       200:
 *         description:your event updated successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.put('/uploadImageAndVideo', eventController.uploadImageAndVideo)

router.get('/eventHosted', eventController.eventHosted)

router.post('/offlineEventList', eventController.offlineEventList)

router.post('/getEventList', eventController.getEventList)

router.get('/requestBooking', eventController.requestBooking)

router.post('/withdrawRequest', eventController.withdrawRequest)

router.post('/cancelRequest', eventController.cancelRequest)

router.post('/test', eventController.test)

router.post('/latestV2', eventController.latestV2)

router.post('/eventList', eventController.eventList)



/**
 * @swagger
 * /api/v1/event/nearByEvents:
 *   post:
 *     tags:
 *       - USER-EVENT
 *     description: Check fountryor Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: userId
 *         in: header
 *         required: true
 *       - name: lat
 *         description: lat
 *         in: formData
 *         required: true   
 *       - name: long
 *         description: long
 *         in: formData
 *         required: true   
 *     responses:
 *       200:
 *         description: Details have been fetched successfully.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/nearByEvents', eventController.nearByEvents)
router.get('/eventAttended', eventController.eventAttended)
/**
 * @swagger
 * /api/v1/event/nearByEvents:
 *   post:
 *     tags:
 *       - FEEDBACK-USER
 *     description: Check fountryor Social existence and give the access Token 
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
 *         description: Details have been fetched successfully.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/myEvents', eventController.myEvents)

router.get('/completedEventsList', eventController.completedEventsList)
module.exports = router;   