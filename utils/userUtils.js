
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('./emailConfig'); // Import email transporter configuration

// Function to hash the password
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Function to send a verification email
const sendVerificationEmail = async (userName, email, verificationToken) => {
    const verificationUrl = `http://localhost:${process.env.PORT}/api/user/verify/${verificationToken}`;

    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Verify Your Email',
        html: `<p>Hi ${userName},</p><p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`
    });
};

const sendPasswordResetEmail = async (email, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Password Reset OTP',
        html: `<p>Your OTP for password reset is <b>${otp}</b>. It is valid for 10 minutes.</p>`
    });
};

// Generate a JWT token for verification
const generateVerificationToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

module.exports = {
    hashPassword,
    sendVerificationEmail,
    generateVerificationToken,
    sendPasswordResetEmail
};
