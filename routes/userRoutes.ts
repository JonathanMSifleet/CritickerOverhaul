const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

/* router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword); */

// all middleware after this point are protected
//router.use(authController.protect);

//router.route('/').post(authController.createUser);

module.exports = router;
