import express from 'express';
import cors = require('cors');
const authController = require('./../controllers/authController');

const router = express.Router();

router.options('/signOut', cors());
router.patch('/signOut',  cors(), authController.protect, authController.signOut);

module.exports = router;
