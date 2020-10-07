import express from 'express';
import cors = require('cors');

const authController = require('./../controllers/authController');

const router = express.Router();

router.options('/signup', cors());
router.post('/signup', cors(), authController.signup);

router.options('/login', cors());
router.post('/login', authController.login);

/* router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword); */

router.patch('/signOut', authController.protect, authController.signOut);

router.delete(
  '/deleteAccount',
  authController.protect,
  authController.deleteAccount
);

module.exports = router;
