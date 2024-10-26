const Auth = require('../models/authModel');
const { generateToken, verifyToken } = require('../utils/jwtUtils');
const { hashPassword, sendVerificationEmail, generateVerificationToken, sendPasswordResetEmail } = require('../utils/userUtils');
const disposableDomains = require('disposable-email-domains');

// Helper function to check if email is disposable
const isDisposableEmail = (email) => {
    const domain = email.split('@')[1];
    return disposableDomains.includes(domain);
};

// Signup function
const signUp = async (req, res, next) => {
    try {
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (isDisposableEmail(email)) {
            return res.status(400).json({ message: 'Disposable email addresses are not allowed' });
        }

        const userExists = await Auth.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);
        const verificationToken = generateVerificationToken(email);

        const user = await Auth.create({
            userName,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,  // 1-day expiration
        });

        await sendVerificationEmail(userName, email, verificationToken);

        res.status(201).json({
            success: true,
            message: 'Signup successful. Check your email to verify your account.',
            data: {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                token: generateToken({ userId: user._id })
            }
        });
    } catch (error) {
        next(error);
    }
};

// Email verification function
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;
        const decoded = verifyToken(token);
        const email = decoded.email;

        const user = await Auth.findOne({ email, verificationToken: token });

        if (!user || user.verificationTokenExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired verification link.' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully.' });
    } catch (error) {
        next(error);
    }
};

// Sign-in function
const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password' });
        }

        const user = await Auth.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password)) || !user.isVerified) {
            return res.status(401).json({ message: 'Invalid credentials or unverified account' });
        }

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                token: generateToken({ userId: user._id })
            }
        });
    } catch (err) {
        next(err);
    }
};

// Password reset request
const requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOTP = otp;
        user.resetOTPExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendPasswordResetEmail(email, otp);

        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (err) {
        next(err);
    }
};

// OTP verification
// OTP verification
const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        // Find User By Email
        const user = await Auth.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if OTP is correct and not expired
        if (user.resetOTP !== otp || user.resetOTPExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Clear OTP and expiration date after successful verification
        user.resetOTP = undefined;
        user.resetOTPExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (err) {
        next(err);
    }
};


// Password reset function
const resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;

        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = await hashPassword(newPassword);
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        next(err);
    }
};

module.exports = { signUp, verifyEmail, signIn, requestPasswordReset, verifyOtp, resetPassword };
