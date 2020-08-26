const express = require('express');
const router = express.Router();
const staticContentController = require('../../controllers/staticContentController');
const auth = require('../../middleware/auth')
const validation = require('../../middleware/validation');



  /**
   * @swagger
   * /api/v1/static/viewStaticContent:
   *   post:
   *     tags:
   *       - STATIC
   *     description: Check for Social existence and give the access Token 
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: staticId
   *         description: staticId
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description: Details have been fetched successfully
   *       404:
   *         description: Data not found
   *       500:
   *         description: Internal Server Error
   */
router.post("/viewStaticContent",staticContentController.viewStaticContent)

/**
   * @swagger
   * /api/v1/static/addFaqs:
   *   post:
   *     tags:
   *       - STATIC
   *     description: Check for Social existence and give the access Token 
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true  
   *       - name: faqId
   *         description: faqId
   *         in: formData
   *         required: true 
   *       - name: question
   *         description: question
   *         in: formData
   *         required: true
   *       - name: answer
   *         description: answer
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description: Data saved successfully
   *       404:
   *         description: Data not found
   *       500:
   *         description: Internal Server Error
   */
  router.post("/viewFaq",staticContentController.viewFaq)

  /**
     * @swagger
     * /api/v1/static/faqList:
     *   get:
     *     tags:
     *       - STATIC
     *     description: Check for Social existence and give the access Token 
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: token
     *         description: token
     *         in: header
     *         required: true  
     *     responses:
     *       200:
     *         description: Data found successfully
     *       404:
     *         description: Data not found
     *       500:
     *         description: Internal Server Error
     */
    router.get("/faqList",staticContentController.faqList)
    router.get("/staticContentList",staticContentController.staticContentList)
      /**
     * @swagger
     * /api/v1/static/viewStatic:
     *   post:
     *     tags:
     *       - STATIC
     *     description: Check for Social existence and give the access Token 
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: Type
     *         description: PRIVACY/TERMS/ABOUT_US/FAQ
     *         in: formData
     *         required: true  
     *     responses:
     *       200:
     *         description: Data found successfully
     *       404:
     *         description: Data not found
     *       500:
     *         description: Internal Server Error
     */
    router.post("/viewStatic",staticContentController.viewStatic)
    
    /**
 * @swagger
 * /api/v1/static/editStaticPage:
 *   post:
 *     tags:
 *       - STATIC
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: staticId 
 *         description: staticId
 *         in: formData
 *         required: false
 *       - name: title
 *         description: title
 *         in: formData
 *         required: false
 *       - name: description
 *         description: description
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Role has been added successfully.
 *       404:
 *         description: This role already exists.
 *       500:
 *         description: Internal Server Error
 */
router.post('/editStaticPage' , staticContentController.editStaticPage)
module.exports=router