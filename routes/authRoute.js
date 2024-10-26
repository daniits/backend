const express = require('express');
const { signUp, verifyEmail, signIn, requestPasswordReset, verifyOtp, resetPassword } = require('../controllers/authController');

const router = express.Router();

// User authentication routes
router.post('/signup', signUp);                 
router.get('/verify/:token', verifyEmail);      
router.post('/signin', signIn);                
router.post('/forgot-password', requestPasswordReset); 
router.post('/verify-otp', verifyOtp);          
router.post('/reset-password', resetPassword); 

module.exports = router;
