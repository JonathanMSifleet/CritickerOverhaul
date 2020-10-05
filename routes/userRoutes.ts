const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

/* router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword); */

// all routes after this are protected:
router.use(authController.protect);

router.delete('/deleteAccount', authController.deleteAccount);

router.get('/signOut', authController.signOut);

module.exports = router;
