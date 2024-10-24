const express = require('express');

const {
    signUp,
    emailVerfication,
    OTP,
    signIn,
    forgot,
    newPassword
} = require ("../controllers/authController")


const router = express.Router();

// Item Routes 

router.post('/signup', signUp);
router.get('/emailverfication', emailVerfication);
router.put('/otp', OTP);
router.delete('/signin', signIn);
router.delete('/forgot', forgot);
router.delete('/newpassword', newPassword);

module.exports = router;