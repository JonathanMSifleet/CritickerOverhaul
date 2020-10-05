const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

/* router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword); */

//router.use(authController.protect);

router.delete(
  '/deleteAccount',
  authController.protect,
  authController.deleteAccount
);

module.exports = router;
