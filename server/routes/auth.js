const express = require('express');
const router = express.Router();
const { register, login, verifyOTP, resendOTP, getProfile, updateProfile } = require('../controllers/authController');
const { validate, registerSchema, loginSchema } = require('../middleware/validate');
const { protect } = require('../middleware/auth');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
