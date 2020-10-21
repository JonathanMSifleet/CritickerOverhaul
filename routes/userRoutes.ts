import express from 'express';
import cors = require('cors');
const authController = require('./../controllers/authController');

const router = express.Router();

router.options('/signup', cors());
router.post('/signup', cors(), authController.signup);

router.options('/login', cors());
router.post('/login', cors(), authController.login);

router.options('/signOut', cors());
router.patch('/signOut',  cors(), authController.protect, authController.signOut);

router.options('/deleteAccount', cors());
router.delete(
  '/deleteAccount', cors(),
  authController.protect,
  authController.deleteAccount
);

module.exports = router;
