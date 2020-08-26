const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/adminController');
const validation = require('../../middleware/validation');
const auth = require('../../middleware/auth')


/**
 * @swagger
 * /api/v1/admin/login:
 *   post:
 *     tags:
 *       - ADMIN
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *       - name: password
 *         description: password
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Your login is successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/login', validation.loginValidation, adminController.login);



/**
 * @swagger
 * /api/v1/admin/viewProfile:
 *   get:
 *     tags:
 *       - ADMIN
 *     description:  To view the profile of the admin .
 *     produces:
 *       - application/json
 *     parameters:
  *       - name: token
 *         description: admin login token
 *         in: header
 *         required: true
 *       - name: adminid
 *         description: admin id
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description: Admin profile found successfully.
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.get("/viewProfile", auth.verifyToken, adminController.viewProfile);
/**
 * @swagger
 * /api/v1/admin/editProfile:
 *   post:
 *     tags:
 *       - ADMIN
 *     description:  To edit the profile of the admin .
 *     produces:
 *       - application/json
 *     parameters:
  *       - name: token
 *         description: admin login token
 *         in: header
 *         required: true
 *       - name: adminid
 *         description: admin id
 *         in: header
 *         required: true
 *       - name: name
 *         description: name of the sub admin
 *         in: formData
 *         required: false
 *       - name: email
 *         description: email
 *         in: formData
 *         required: false
 *       - name: mobileNumber
 *         description: mobile number 
 *         in: formData
 *         required: false
 *       - name: userType
 *         description: role to be assigned(sub-admin only)
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Your profile details has been updated successfully.
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post("/editProfile", auth.verifyToken, adminController.editProfile);
/**
 * @swagger
 * /api/v1/admin/forgotPassword:
 *   post:
 *     tags:
 *       - ADMIN
 *     description: forgot password of the admin 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: The link has been sent to the registered email .
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */


router.post('/forgotPassword', adminController.forgotPassword);

/**
 * @swagger
 * /api/v1/admin/resetPassword:
 *   post:
 *     tags:
 *       - ADMIN
 *     description:  admin forget password .
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: admin login token
 *         in: header
 *         required: true
 *       - name: adminid
 *         description: admin  id
 *         in: header
 *         required: true
 *       - name: password
 *         description: new password
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Your password has been updated successfully.
 *       404:
 *         description: Invalid email
 *       500:
 *         description: Internal Server Error
 */
router.post('/resetPassword', auth.verifyToken, adminController.resetPassword);

/**
 * @swagger
 * /api/v1/admin/changePassword:
 *   post:
 *     tags:
 *       - ADMIN
 *     description: admin change own password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: admin login token
 *         in: header
 *         required: true
 *       - name: adminid
 *         description: admin id
 *         in: header
 *         required: true
 *       - name: oldPassword
 *         description: old password
 *         in: formData
 *         required: true
 *       - name: newPassword
 *         description: newPasword
 *         in: formData
 *         required: true
 *       - name: confirmPassword
 *         description: confirm new password
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Your password has been changed successfully.
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post("/changePassword", auth.verifyToken, adminController.changePassword);
/**
 * @swagger
 * /api/v1/admin/addSubAdmin:
 *   post:
 *     tags:
 *       - SUBADMIN (ADD BY ADMIN)
 *     description: admin adds new sub-admin 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: admin login token
 *         in: header
 *         required: true
 *       - name: adminid
 *         description: admin id
 *         in: header
 *         required: true
 *       - name: name
 *         description: name of the sub admin
 *         in: formData
 *         required: true
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *       - name: mobileNumber
 *         description: mobile number 
 *         in: formData
 *         required: true
 *       - name: userType
 *         description: role to be assigned(SUBADMIN only)
 *         in: formData
 *         required: true
 *       - name: password
 *         description: password
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Sub-admin has been created successfully.
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post("/addSubAdmin", auth.verifyToken, adminController.addSubAdmin);


/**
 * @swagger
 * /api/v1/admin/listSubAdmin:
 *   post:
 *     tags:
 *       - SUBADMIN (LIST VIEW BY ADMIN)
 *     description:  To list all the sub-admins and admin .
 *     produces:
 *       - application/json
 *     parameters:
  *       - name: token
 *         description: admin login token
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description: Details have been fetched successfully.
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post("/listSubAdmin", auth.verifyToken, adminController.listSubAdmin);
/**
 * @swagger
 * /api/v1/admin/editSubAdmin:
 *   put:
 *     tags:
 *       - SUBADMIN (UPDATE BY ADMIN)
 *     description: admin edits the sub-admin 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: admin login token
 *         in: header
 *         required: true
 *       - name: subAdminId
 *         description: subAdminId
 *         in: formData
 *         required: true
 *       - name: name
 *         description: name of the sub admin
 *         in: formData
 *         required: false
 *       - name: email
 *         description: email
 *         in: formData
 *         required: false
 *       - name: mobileNumber
 *         description: mobile number 
 *         in: formData
 *         required: false
 *       - name: userType
 *         description: role to be assigned(SUBADMIN only)
 *         in: formData
 *         required: false
 *       - name: password
 *         description: password
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: The sub-admin updated successfully .
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.put("/editSubAdmin", auth.verifyToken, adminController.editSubAdmin);

/**
 * @swagger
 * /api/v1/admin/viewSubAdmin/{_id}:
 *   get:
 *     tags:
 *       - SUBADMIN (UPDATE BY ADMIN)
 *     description: Check fountryor Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: adminId
 *         description: adminId
 *         in: header
 *         required: true
 *       - name: _id
 *         description: _id
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

router.get('/viewSubadmin/:_id', auth.verifyToken, adminController.viewSubAdmin)
/**
 * @swagger
 * /api/v1/admin/deleteSubAdmin:
 *   delete:
 *     tags:
 *       - SUBADMIN (DELETE BY ADMIN)
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: subAdminId
 *         description: subAdminId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: This user does not exist
 *       500:
 *         description: Internal Server Error
 */
router.delete("/deleteSubAdmin", auth.verifyToken, adminController.deleteSubAdmin);

/**
 * @swagger
 * /api/v1/admin/addCountry:
 *   post:
 *     tags:
 *       - COUNTRY- ( ADD BY-ADMIN)
 *     description: Check for Social existence and give the access Token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: adminId
 *         description: adminId
 *         in: header
 *         required: true
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: countryName
 *         description: countryName
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description:Country added successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/addCountry', auth.verifyToken, adminController.addCountry)

/**
 * @swagger
 * /api/v1/admin/editCountry:
 *   put:
 *     tags:
 *       - COUNTRY- ( EDIT BY-ADMIN)
 *     description: Check for Social existence and give the access Token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: adminId
 *         description: adminId
 *         in: header
 *         required: true
 *       - name: countryId
 *         description: countryId
 *         in: formData
 *         required: true
 *       - name: countryName
 *         description: countryName
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description:Country updated successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */

router.put('/editCountry', auth.verifyToken, adminController.editCountry)

/**
 * @swagger
 * /api/v1/admin/deleteCountry:
 *   delete:
 *     tags:
 *       - COUNTRY- ( DELETE BY-ADMIN)
 *     description: Check for Social existence and give the access Token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: adminId
 *         description: adminId
 *         in: header
 *         required: true
 *       - name: countryId
 *         description: countryId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description:Country deleted successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deleteCountry', auth.verifyToken, adminController.deleteCountry)

/**
 * @swagger
 * /api/v1/admin/viewCountry/{_id}:
 *   get:
 *     tags:
 *       - COUNTRY- ( VIEW BY-ADMIN)
 *     description: Check fountryor Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: adminId
 *         description: adminId
 *         in: header
 *         required: true
 *       - name: _id
 *         description: _id
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

router.get('/viewCountry/:_id', auth.verifyToken, adminController.viewCountry)
/**
 * @swagger
 * /api/v1/admin/addFoodCategory:
 *   post:
 *     tags:
 *       - ADMIN
 *     description: Check for Social existence and give the access Token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: name
 *         description: name
 *         in: formData
 *         required: true
 *       - name: maximumPrice
 *         description: maximumPrice
 *         in: formData
 *         required: true
 *       - name: minimumPrice
 *         description: minimumPrice
 *         in: formData
 *         required: true
 *       - name: image
 *         description: image
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Data saved successfully
 *       404:
 *         description: user not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/addFoodCategory', auth.verifyToken, adminController.addFoodCategory)
/**
 * @swagger
 * /api/v1/admin/listOfCountry:
 *   post:
 *     tags:
 *       - COUNTRY- ( VIEW LIST BY-ADMIN)
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: adminId
 *         description: adminId
 *         in: header
 *         required: true
 *       - name: countryName
 *         description: search by name
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description:Country found successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */

router.post('/listOfCountry', auth.verifyToken, adminController.listOfCountry)

/**
 * @swagger
 * /api/v1/admin/addCustomer:
 *   post:
 *     tags:
 *       - CUSTOMER-(ADD BY ADMIN)
 *     description: Check for Social existence and give the access Token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: customerName
 *         description: customerName
 *         in: formData
 *         required: true
 *       - name: phone
 *         description: phone
 *         in: formData
 *         required: true
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *       - name: image
 *         description: image
 *         in: formData
 *         required: true
 *       - name: password
 *         description: password
 *         in: formData
 *         required: true
 *       - name: gender
 *         description: gender
 *         in: formData
 *         required: true
 *       - name: countryId
 *         description: countryId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description:Customer added successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/addCustomer', auth.verifyToken, adminController.addCustomer)

/**
 * @swagger
 * /api/v1/admin/editCustomer:
 *   put:
 *     tags:
 *       - CUSTOMER-(EDIT BY ADMIN)
 *     description: Check for Social existence and give the access Token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: adminId
 *         description: adminId
 *         in: formData
 *         required: false
 *       - name: customerName
 *         description: customerName
 *         in: formData
 *         required: false
 *       - name: phone
 *         description: phone
 *         in: formData
 *         required: false
 *       - name: email
 *         description: email
 *         in: formData
 *         required: false
 *       - name: image
 *         description: image
 *         in: formData
 *         required: false
 *       - name: password
 *         description: password
 *         in: formData
 *         required: false
 *       - name: gender
 *         description: gender
 *         in: formData
 *         required: false
 *       - name: customerId
 *         description: customerId
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description:Customer updated successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.put('/editCustomer', adminController.editCustomer)

/**
 * @swagger
 * /api/v1/admin/verifyCustomer:
 *   post:
 *     tags:
 *       - CUSTOMER-(VERIFY BY ADMIN)
 *     description: Check for Social existence and give the access Token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: adminId
 *         description: adminId
 *         in: formData
 *         required: true
 *       - name: customerId
 *         description: customerId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description:Customer verified successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/verifyCustomer', auth.verifyToken, adminController.verifyCustomer)

/**
* @swagger
* /api/v1/admin/listOfCustomer:
*   post:
*     tags:
*       - CUSTOMER-(GET LIST BY ADMIN)
*     description: Check for Social existence and give the access Token
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token
*         in: header
*         required: true
*       - name: adminId
*         description: adminId
*         in: header
*         required: true
*       - name: search
*         description: search
*         in: formData
*         required: false
*     responses:
*       200:
*         description:Customer found successfully
*       404:
*         description: Invalid credentials
*       500:
*         description: Internal Server Error
*/
router.post('/listOfCustomer', auth.verifyToken, adminController.listOfCustomer)
router.get('/customerList',adminController.customerList)
router.post('/blockCustomer',auth.verifyToken,adminController.blockCustomer)
/**
 * @swagger
 * /api/v1/admin/viewCustomer/{_id}:
 *   get:
 *     tags:
 *       - CUSTOMER-(VIEW BY ADMIN)
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: _id
 *         description: customerId
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

router.get('/viewCustomer/:_id', auth.verifyToken, adminController.viewCustomer)
/**
 * @swagger
 * /api/v1/admin/deleteCustomer:
 *   delete:
 *     tags:
 *       - CUSTOMER-(DELETE BY ADMIN)
 *     description: Check for Social existence and give the access Token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: adminId
 *         description: adminId
 *         in: formData
 *         required: true
 *       - name: customerId
 *         description: customerId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description:Customer deleted successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deleteCustomer', auth.verifyToken, adminController.deleteCustomer)

/**
 * @swagger
 * /api/v1/admin/addChef:
 *   post:
 *     tags:
 *       - CHEF
 *     description: Check for Social existence and give the access Token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: adminId
 *         description: adminId
 *         in: formData
 *         required: false
 *       - name: name
 *         description: name
 *         in: formData
 *         required: false
 *       - name: phone
 *         description: phone
 *         in: formData
 *         required: false
 *       - name: email
 *         description: email
 *         in: formData
 *         required: false
 *       - name: image
 *         description: image
 *         in: formData
 *         required: false
 *       - name: gender
 *         description: gender
 *         in: formData
 *         required: false
 *       - name: chefId
 *         description: chefId
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description:Chef updated successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/editChef', auth.verifyToken, adminController.editChef)
/**
 * @swagger
 * /api/v1/admin/listOfChef:
 *   post:
 *     tags:
 *       - CHEF
 *     description: Check for Social existence and give the access Token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: adminId
 *         description: adminId
 *         in: formData
 *         required: true
 *       - name: chefId
 *         description: chefId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description:Chef found successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */

/**
* @swagger
* /api/v1/admin/listOfChef:
*   post:
*     tags:
*       - CHEF
*     description: Check for Social existence and give the access Token
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token
*         in: header
*         required: true
*       - name: adminId
*         description: adminId
*         in: formData
*         required: true
*       - name: search
*         description: search
*         in: formData
*         required: false
*     responses:
*       200:
*         description:Chef found successfully
*       404:
*         description: Invalid credentials
*       500:
*         description: Internal Server Error
*/
router.post('/listOfChef', auth.verifyToken, adminController.listOfChef)

/**
 * @swagger
 * /api/v1/admin/deleteChef:
 *   delete:
 *     tags:
 *       - CHEF
 *     description: Check for Social existence and give the access Token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: adminId
 *         description: adminId
 *         in: formData
 *         required: true
 *       - name: chefId
 *         description: chefId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description:Chef deleted successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */

router.delete('/deleteChef', auth.verifyToken, adminController.deleteChef)


/**
 * @swagger
 * /api/v1/admin/addFoodCategory:
 *   post:
 *     tags:
 *       - FOOD CATEGORY
 *     description: Check for Social existence and give the access Token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: name
 *         description: name
 *         in: formData
 *         required: true
 *       - name: maximumPrice
 *         description: maximumPrice
 *         in: formData
 *         required: true
 *       - name: minimumPrice
 *         description: minimumPrice
 *         in: formData
 *         required: true
 *       - name: image
 *         description: image
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Food category saved successfully
 *       404:
 *         description: user not found
 *       500:
 *         description: Internal Server Error
 */

router.post('/addFoodCategory', auth.verifyToken, adminController.addFoodCategory)

/**
 * @swagger
 * /api/v1/admin/editFoodCategory:
 *   put:
 *     tags:
 *       - FOOD CATEGORY
 *     description: Check for Social existence and give the access Token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: foodCategoryId
 *         description: foodCategoryId
 *         in: formData
 *         required: true
 *       - name: name
 *         description: name
 *         in: formData
 *         required: false
 *       - name: maximumPrice
 *         description: maximumPrice
 *         in: formData
 *         required: false
 *       - name: minimumPrice
 *         description: minimumPrice
 *         in: formData
 *         required: false
 *       - name: image
 *         description: image
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Food category updated  successfully
 *       404:
 *         description: user not found
 *       500:
 *         description: Internal Server Error
 */

router.put('/editFoodCategory', auth.verifyToken, adminController.editFoodCategory)

/**
 * @swagger
 * /api/v1/admin/deleteFoodCatagory:
 *   delete:
 *     tags:
 *       - FOOD CATEGORY
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: foodId
 *         description: foodId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted data successfully
 *       404:
 *         description: user not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deleteFoodCatagory', auth.verifyToken, adminController.deleteFoodCatagory)

/**
 * @swagger
 * /api/v1/admin/viewFoodCategory/{_id}:
 *   get:
 *     tags:
 *       - FOOD CATEGORY
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: _id
 *         description: foodCategoryId
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

router.get('/viewFoodCategory/:_id', auth.verifyToken, adminController.viewFoodCategory)
/**
 * @swagger
 * /api/v1/admin/foodCateoryList:
 *   post:
 *     tags:
 *       - FOOD CATEGORY
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: search
 *         description: search
 *         in: formData
 *         required: false
 *       - name: page
 *         description: page
 *         in: formData
 *         required: false
 *       - name: limit
 *         description: limit
 *         in: formData
 *         required: false   
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/foodCateoryList', adminController.foodCateoryList)
/**
 * @swagger
 * /api/v1/admin/addEventCategory:
 *   post:
 *     tags:
 *       - EVENT CATEGORY -ADMIN
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
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
router.post('/addEventCategory', auth.verifyToken, adminController.addEventCategory)
/**
 * @swagger
 * /api/v1/admin/editEventCategory:
 *   post:
 *     tags:
 *       - EVENT CATEGORY -ADMIN
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: eventCategoryId
 *         description: eventCategoryId
 *         in: formData
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
 *         description: Event category has been updated successfully
 *       404:
 *         description: This event category already exists
 *       500:
 *         description: Internal Server Error
 */
router.post('/editEventCategory', auth.verifyToken, adminController.editEventCategory)
/**
 * @swagger
 * /api/v1/admin/viewEventCategory:
 *   post:
 *     tags:
 *       - EVENT CATEGORY -ADMIN
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: eventCategoryId
 *         description: eventCategoryId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Event category has been found successfully
 *       404:
 *         description: This event category not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/viewEventCategory', auth.verifyToken, adminController.viewEventCategory)
/**
 * @swagger
 * /api/v1/admin/deleteEventCategory:
 *   delete:
 *     tags:
 *       - EVENT CATEGORY -ADMIN
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: eventCategoryId
 *         description: eventCategoryId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Event category has been delete successfully
 *       404:
 *         description: This event category not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deleteEventCategory', auth.verifyToken, adminController.deleteEventCategory)
/**
 * @swagger
 * /api/v1/admin/eventCategoryList:
 *   post:
 *     tags:
 *       - ADMIN
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: eventCategoryName
 *         description: eventCategoryId
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Event category found
 *       404:
 *         description: This event category not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/eventCategoryList', auth.verifyToken, adminController.eventCategoryList)
//router.post('/approveEventCategory',auth.verifyToken,adminController.approveEventCategory)

router.post('/addEvent', auth.verifyToken, adminController.addEvent)

/**
 * @swagger
 * /api/v1/admin/editEvent:
 *   put:
 *     tags:
 *       - EVENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: eventId
 *         description: eventId
 *         in: header
 *         required: true
 *       - name: customerId
 *         description: customerId
 *         in: formData
 *         required: false
 *       - name: foodCategoryId
 *         description: foodCategoryId
 *         in: formData
 *         required: false
 *       - name: eventCategoryId
 *         description: eventCategoryId
 *         in: formData
 *         required: false
 *       - name: eventTitle
 *         description: eventTitle
 *         in: formData
 *         required: false
 *       - name: eventType
 *         description: eventType
 *         in: formData
 *         required: false
 *       - name: description
 *         description: description
 *         in: formData
 *         required: false
 *       - name: Address
 *         description: Address
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
 *       - name: invite
 *         description: invite
 *         in: formData
 *         required: false
 *       - name: MaxPersonCapacity
 *         description: MaxPersonCapacity
 *         in: formData
 *         required: false
 *       - name: pricePerPerson
 *         description: pricePerPerson
 *         in: formData
 *         required: false
 *       - name: seeEvent
 *         description: seeEvent
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
 *     responses:
 *       200:
 *         description: Event  has been updated successfully
 *       404:
 *         description: This event  already exists
 *       500:
 *         description: Internal Server Error
 */

router.put('/editEvent', auth.verifyToken, adminController.editEvent)
/**
 * @swagger
 * /api/v1/admin/eventList:
 *   post:
 *     tags:
 *       - EVENT 
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: customerName
 *         description: customerName
 *         in: formData
 *         required: false
 *       - name: foodCategory
 *         description: foodCategory
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Event  has been found successfully
 *       404:
 *         description: This event category not found
 *       500:
 *         description: Internal Server Error
 */

router.post('/eventList', auth.verifyToken, adminController.eventList)
/**
 * @swagger
 * /api/v1/admin/viewEvent:
 *   post:
 *     tags:
 *       - EVENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: eventId
 *         description: eventId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Event  has been found successfully
 *       404:
 *         description: This event  not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/viewEvent', auth.verifyToken, adminController.viewEvent)
/**
 * @swagger
 * /api/v1/admin/deleteEvent:
 *   delete:
 *     tags:
 *       - EVENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: eventId
 *         description: eventId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Event  has been delete successfully
 *       404:
 *         description: This event  not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deleteEvent', auth.verifyToken, adminController.deleteEvent)


/**
 * @swagger
 * /api/v1/admin/addMarketing:
 *   post:
 *     tags:
 *       - MARKETING
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: marketingName
 *         description: marketingName
 *         in: formData
 *         required: true
 *       - name: link
 *         description: link
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Marketing  has been added successfully
 *       404:
 *         description: This marketing  not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/addMarketing', auth.verifyToken, adminController.addMarketing)
/**
 * @swagger
 * /api/v1/admin/deleteMarketing:
 *   delete:
 *     tags:
 *       - MARKETING
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: marketingId
 *         description: marketingId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Marketing  has been delete successfully
 *       404:
 *         description: This marketing  not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deleteMarketing', auth.verifyToken, adminController.deleteMarketing)
/**
 * @swagger
 * /api/v1/admin/marketingList:
 *   post:
 *     tags:
 *       - MARKETING
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: marketingName
 *         description: marketingName
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Marketing  has been found successfully
 *       404:
 *         description: This marketing  not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/marketingList', auth.verifyToken, adminController.marketingList)




router.post('/foodCateoryList', adminController.foodCateoryList)

/**
 * @swagger
 * /api/v1/admin/addDish:
 *   post:
 *     tags:
 *       - DISH
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: name
 *         description: name
 *         in: formData
 *         required: true
 *       - name: foodCategoryId
 *         description: foodCategoryId
 *         in: formData
 *         required: true
 *       - name: description
 *         description: description
 *         in: formData
 *         required: true
 *       - name: youTubeLink
 *         description: youTubeLink
 *         in: formData
 *         required: false
 *       - name: image
 *         description: image
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Data saved successfully
 *       404:
 *         description: user not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/addDish', auth.verifyToken, adminController.addDish)
/**
 * @swagger
 * /api/v1/admin/editDish:
 *   put:
 *     tags:
 *       - DISH
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: dishId
 *         description: dishId
 *         in: formData
 *         required: true
 *       - name: name
 *         description: name
 *         in: formData
 *         required: false
 *       - name: foodCategoryId
 *         description: foodCategoryId
 *         in: formData
 *         required: false
 *       - name: description
 *         description: description
 *         in: formData
 *         required: false
 *       - name: youTubeLink
 *         description: youTubeLink
 *         in: formData
 *         required: true
 *       - name: image
 *         description: image
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: updated data successfully
 *       404:
 *         description: user not found
 *       500:
 *         description: Internal Server Error
 */

router.put('/editDish', auth.verifyToken, adminController.editDish)

/**
 * @swagger
 * /api/v1/admin/viewDish/{_id}:
 *   get:
 *     tags:
 *       - DISH
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: _id
 *         description: dishId
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

router.get('/viewDish/:_id', auth.verifyToken, adminController.viewDish)

/**
 * @swagger
 * /api/v1/admin/deleteDish:
 *   delete:
 *     tags:
 *       - DISH
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true   
 *       - name: dishId
 *         description: dishId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted data successfully
 *       404:
 *         description: user not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deleteDish', auth.verifyToken, adminController.deleteDish)
/**
 * @swagger
 * /api/v1/admin/dishesList:
 *   post:
 *     tags:
 *       - DISH
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: search
 *         description: search
 *         in: formData
 *         required: false
 *       - name: page
 *         description: page
 *         in: formData
 *         required: false
 *       - name: limit
 *         description: limit
 *         in: formData
 *         required: false   
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/dishesList', auth.verifyToken, adminController.dishesList)
/**
 * @swagger
 * /api/v1/admin/addAge:
 *   post:
 *     tags:
 *       - AGE-MASTER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: ageName
 *         description: ageName
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Data saved successfully
 *       404:
 *         description: user not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/addAge', auth.verifyToken, adminController.addAge)

/**
 * @swagger
 * /api/v1/admin/editAge:
 *   put:
 *     tags:
 *       - AGE-MASTER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: ageId
 *         description: ageId
 *         in: formData
 *         required: true 
 *       - name: ageName
 *         description: ageName
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: updated data successfully
 *       404:
 *         description: user not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/editAge', auth.verifyToken, adminController.editAge)

/**
 * @swagger
 * /api/v1/admin/viewAge/{_id}:
 *   get:
 *     tags:
 *       - AGE-MASTER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: _id
 *         description: ageId
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

router.get('/viewAge/:_id', auth.verifyToken, adminController.viewAge)

/**
 * @swagger
 * /api/v1/admin/ageList:
 *   post:
 *     tags:
 *       - AGE-MASTER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: search
 *         description: search
 *         in: formData
 *         required: false
 *       - name: page
 *         description: page
 *         in: formData
 *         required: false
 *       - name: limit
 *         description: limit
 *         in: formData
 *         required: false   
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/ageList', adminController.ageList)
/**
 * @swagger
 * /api/v1/admin/deleteAge:
 *   delete:
 *     tags:
 *       - AGE-MASTER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: ageId
 *         description: ageId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: updated data successfully
 *       404:
 *         description: user not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deleteAge', auth.verifyToken, adminController.deleteAge)
/**
 * @swagger
 * /api/v1/admin/addGender:
 *   post:
 *     tags:
 *       - GENDER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: genderName
 *         description: genderName
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: addGender successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/addGender', auth.verifyToken, adminController.addGender)
/**
 * @swagger
 * /api/v1/admin/editGender:
 *   put:
 *     tags:
 *       - GENDER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: genderId
 *         description: genderId
 *         in: formData
 *         required: true
 *       - name: genderName
 *         description: genderName
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: editGender successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.put('/editGender', auth.verifyToken, adminController.editGender)
/**
 * @swagger
 * /api/v1/admin/deleteGender:
 *   delete:
 *     tags:
 *       - GENDER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: genderId
 *         description: genderId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: deleteGender successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deleteGender', auth.verifyToken, adminController.deleteGender)
/**
 * @swagger
 * /api/v1/admin/listOfGender:
 *   post:
 *     tags:
 *       - GENDER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: search
 *         description: search
 *         in: formData
 *         required: false
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
 *         description: listOfGender  find successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/listOfGender', auth.verifyToken, adminController.listOfGender)

/**
 * @swagger
 * /api/v1/admin/viewGender/{_id}:
 *   get:
 *     tags:
 *       - GENDER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: _id
 *         description: genderId
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

router.get('/viewGender/:_id', auth.verifyToken, adminController.viewGender)
/**
 * @swagger
 * /api/v1/admin/addLanguage:
 *   post:
 *     tags:
 *       - LANGUAGE
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: languageName
 *         description: languageName
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: addLanguage successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/addLanguage', auth.verifyToken, adminController.addLanguage)
/**
 * @swagger
 * /api/v1/admin/editLanguage:
 *   put:
 *     tags:
 *       - LANGUAGE
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: languageId
 *         description: languageId
 *         in: formData
 *         required: true
 *       - name: languageName
 *         description: languageName
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Language updated successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.put('/editLanguage', auth.verifyToken, adminController.editLanguage)
/**
 * @swagger
 * /api/v1/admin/deleteLanguage:
 *   delete:
 *     tags:
 *       - LANGUAGE
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: languageId
 *         description: languageId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Language deleted successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deleteLanguage', auth.verifyToken, adminController.deleteLanguage)
/**
 * @swagger
 * /api/v1/admin/languageList:
 *   post:
 *     tags:
 *       - LANGUAGE
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: search
 *         description: search
 *         in: formData
 *         required: false
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
 *         description: listOfLanguage  find successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */

router.post('/languageList', auth.verifyToken, adminController.languageList)
/**
 * @swagger
 * /api/v1/admin/viewLanguage/{_id}:
 *   get:
 *     tags:
 *       - LANGUAGE
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: _id
 *         description: languageId
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

router.get('/viewLanguage/:_id', auth.verifyToken, adminController.viewLanguage)
/**
 * @swagger
 * /api/v1/admin/addInterest:
 *   post:
 *     tags:
 *       - INTEREST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: interestName
 *         description: interestName
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: addInterest successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/addInterest', auth.verifyToken, adminController.addInterest)
/**
 * @swagger
 * /api/v1/admin/editInterest:
 *   put:
 *     tags:
 *       - INTEREST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: interestId
 *         description: interestId
 *         in: formData
 *         required: true
 *       - name: interestName
 *         description: interestName
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: editInterest successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.put('/editInterest', auth.verifyToken, adminController.editInterest)
/**
 * @swagger
 * /api/v1/admin/deleteInterest:
 *   delete:
 *     tags:
 *       - INTEREST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: interestId
 *         description: interestId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: deleteInterest successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deleteInterest', auth.verifyToken, adminController.deleteInterest)
/**
 * @swagger
 * /api/v1/admin/interestList:
 *   post:
 *     tags:
 *       - INTEREST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: search
 *         description: search
 *         in: formData
 *         required: false
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
 *         description: listOfInterest  find successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/interestList', auth.verifyToken, adminController.interestList)
/**
 * @swagger
 * /api/v1/admin/viewInterest/{_id}:
 *   get:
 *     tags:
 *       - INTEREST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: _id
 *         description: interestId
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

router.get('/viewInterest/:_id', auth.verifyToken, adminController.viewInterest)
/**
 * @swagger
 * /api/v1/admin/addFavourite:
 *   post:
 *     tags:
 *       - FAVOURITE
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: foodName
 *         description: foodName
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Favourite food added successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/addFavourite', auth.verifyToken, adminController.addFavourite)
/**
 * @swagger
 * /api/v1/admin/editFavorite:
 *   put:
 *     tags:
 *       - FAVOURITE
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: favouriteId
 *         description: favouriteId
 *         in: formData
 *         required: true
 *       - name: foodName
 *         description: foodName
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Interest updated  successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.put('/editFavorite', auth.verifyToken, adminController.editFavorite)
/**
 * @swagger
 * /api/v1/admin/deleteFavourite:
 *   delete:
 *     tags:
 *       - FAVOURITE
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: favouriteId
 *         description: favouriteId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Favourite food deleted successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deleteFavourite', auth.verifyToken, adminController.deleteFavourite)
/**
 * @swagger
 * /api/v1/admin/favouriteList:
 *   post:
 *     tags:
 *       - FAVOURITE
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true 
 *       - name: search
 *         description: search
 *         in: formData
 *         required: false
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
 *         description: Favourite food  found successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/favouriteList', auth.verifyToken, adminController.favouriteList)

/**
 * @swagger
 * /api/v1/admin/viewFavourite/{_id}:
 *   get:
 *     tags:
 *       - FAVOURITE
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: _id
 *         description: favouriteId
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

router.get('/viewFavourite/:_id', auth.verifyToken, adminController.viewFavourite)


/**
 * @swagger
 * /api/v1/admin/siteView:
 *   get:
 *     tags:
 *       - SITE
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
 *         description: Details have been fetched successfully.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/siteView', auth.verifyToken, adminController.siteView)

/**
 * @swagger
 * /api/v1/admin/editSite:
 *   put:
 *     tags:
 *       - SITE
 *     description: edit site setting  by admin
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: siteId
 *         description: siteId
 *         in: formData
 *         required: true
 *       - name: name
 *         description: name
 *         in: formData
 *         required: false
 *       - name: email
 *         description: email
 *         in: formData
 *         required: false
 *       - name: website
 *         description: website
 *         in: formData
 *         required: false
 *       - name: phone
 *         description: phone
 *         in: formData
 *         required: false
 *       - name: mobile
 *         description: mobile
 *         in: formData
 *         required: false
 *       - name: address
 *         description: address
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Successfully updated
 *       404:
 *         description: Requested Data not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/editSite', auth.verifyToken,adminController.editSite)
/**
 * @swagger
 * /api/v1/admin/addReward:
 *   post:
 *     tags:
 *       - SITE
 *     description: edit site setting  by admin
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: userId
 *         description: userId
 *         in: formData
 *         required: true
 *       - name: reward
 *         description: reward
 *         in: formData
 *         required: false
 *       - name: rewardAmount
 *         description: rewardAmount
 *         in: formData
 *         required: false
 *       - name: comment
 *         description: comment
 *         in: formData
 *         required: false
 *       - name: photo
 *         description: photo
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Successfully updated
 *       404:
 *         description: Requested Data not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/addReward',adminController.addReward)
router.put('/editReward',auth.verifyToken,adminController.editReward)
router.get('/viewReward/:rewardId',auth.verifyToken,adminController.viewReward)
/**
 * @swagger
 * /api/v1/admin/giveReward:
 *   post:
 *     tags:
 *       - SITE
 *     description: edit site setting  by admin
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: adminId
 *         description: adminId
 *         in: formData
 *         required: true
 *       - name: userId
 *         description: userId
 *         in: formData
 *         required: true
 *       - name: reward
 *         description: reward
 *         in: formData
 *         required: false
 *       - name: rewardAmount
 *         description: rewardAmount
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Successfully updated
 *       404:
 *         description: Requested Data not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/giveReward',adminController.giveReward)
router.post('/rewardList',adminController.userListForReward)
/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     tags:
 *       - ADMIN
 *     description: edit site setting  by admin
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully updated
 *       404:
 *         description: Requested Data not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/dashboard',adminController.dashboard)
router.post('/reportList',adminController.reportList)
router.post('/viewReport',adminController.viewReport)
router.post('/deleteReport',adminController.deleteReport)
router.post('/removePost',adminController.deletePost)
router.post('/addFaq',auth.verifyToken,adminController.addFaq)

router.post('/editFaq',auth.verifyToken,adminController.editFaq)

router.get('/faqList',auth.verifyToken,adminController.faqList)

router.post('/viewFaq',auth.verifyToken,adminController.viewFaq)

router.post('/addOfflineCountry',auth.verifyToken,adminController.addOfflineCountry)

router.post('/editOfflineEvent',auth.verifyToken,adminController.editOfflineEvent)

router.get('/getOfflineEvent',auth.verifyToken,adminController.getOfflineEvent)

router.post('/editOfflineCountry',auth.verifyToken,adminController.editOfflineCountry)

router.post('/deleteOfflineCountry',auth.verifyToken,adminController.deleteOfflineCountry)



router.post('/addOnlineCountry',auth.verifyToken,adminController.addOnlineCountry)

router.post('/editOnlineEvent',auth.verifyToken,adminController.editOnlineEvent)

router.get('/getOnlineEvent',auth.verifyToken,adminController.getOnlineEvent)

router.post('/editOnlineCountry',auth.verifyToken,adminController.editOnlineCountry)

router.post('/deleteOnlineCountry',auth.verifyToken,adminController.deleteOnlineCountry)

router.post('/deleteOfflineCategory',auth.verifyToken,adminController.deleteOfflineCategory)

router.post('/addOfflineEvent',auth.verifyToken,adminController.addOfflineEvent)


router.post('/addOnlineEvent',auth.verifyToken,adminController.addOnlineEvent)

router.post('/deleteEventType',auth.verifyToken,adminController.deleteEventType)

router.post('/viewOfflineCountry',auth.verifyToken,adminController.viewOfflineCountry)

router.post('/viewOnlineCountry',auth.verifyToken,adminController.viewOnlineCountry)

router.post('/deleteOnlineCategory',auth.verifyToken,adminController.deleteOnlineCategory)


router.post('/addRole',auth.verifyToken,adminController.addRole)

router.post('/viewRole',auth.verifyToken,adminController.viewRole)

router.post('/editRole',auth.verifyToken,adminController.editRole)

router.post('/roleList',auth.verifyToken,adminController.roleList)

router.post('/deleteRole',auth.verifyToken,adminController.deleteRole)












module.exports = router;   
