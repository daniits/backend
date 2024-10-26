const Auth = require('../models/authModel');
const { generateToken, verifyToken } = require('../utils/jwtUtils');
const { hashPassword, sendVerificationEmail, generateVerificationToken } = require('../utils/userUtils');
const disposableDomains = require('disposable-email-domains');

// Helper function to check if the email is disposable
const isDisposableEmail = (email) => {
    const domain = email.split('@')[1];
    return disposableDomains.includes(domain);
};

// Signup Function
const signUp = async (req, res, next) => {
    try {
        const { userName, email, password } = req.body;

        // Validate input fields
        if (!userName || !email || !password) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        // Check if the email is from a disposable domain
        if (isDisposableEmail(email)) {
            return res.status(400).json({ message: 'Disposable email addresses are not allowed.' });
        }

        // Check if user already exists
        const userExists = await Auth.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password using utility function
        const hashedPassword = await hashPassword(password);

        // Generate verification token using utility function
        const verificationToken = generateVerificationToken(email);

        // Create new user with verification status
        const user = await Auth.create({
            userName,
            email,
            password: hashedPassword,
            isVerified: false,
            verificationToken,
            verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000  // 1 day expiration
        });

        // Send verification email using utility function
        await sendVerificationEmail(userName, email, verificationToken);

        res.status(201).json({
            success: true,
            message: 'Signup successful. Please check your email to verify your account.',
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

// Verify Email Function
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;

        // Verify token and extract email
        const decoded = verifyToken(token);
        const email = decoded.email;

        // Find user by email and verification token
        const user = await Auth.findOne({ email, verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification link.' });
        }

        // Check if token has expired
        if (user.verificationTokenExpires < Date.now()) {
            return res.status(400).json({ message: 'Verification link has expired.' });
        }

        // Update user to verified
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully.' });
    } catch (error) {
        next(error);
    }
};

module.exports = { signUp, verifyEmail };
