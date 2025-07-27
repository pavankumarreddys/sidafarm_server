const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateToken = require('../middlewares/validateToken');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;
