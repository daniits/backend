
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
        html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f6f6f6; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
                        <tr>
                            <td align="center" style="padding: 10px 0;">
                                <h1 style="color: #4CAF50;">Welcome to Our Service, ${userName}!</h1>
                                <p style="font-size: 16px; color: #555;">We're excited to have you onboard.</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px; text-align: center;">
                                <p style="font-size: 18px; line-height: 1.6;">
                                    Please confirm your email address by clicking the button below.
                                </p>
                                <a href="${verificationUrl}" style="display: inline-block; padding: 12px 25px; margin: 20px 0; font-size: 18px; color: #ffffff; background-color: #4CAF50; text-decoration: none; border-radius: 4px;">
                                    Verify Email
                                </a>
                                <p style="font-size: 14px; color: #888;">
                                    If the button above doesn't work, copy and paste this URL into your browser:
                                    <br>
                                    <a href="${verificationUrl}" style="color: #4CAF50;">${verificationUrl}</a>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 20px; color: #888;">
                                <p style="font-size: 12px;">
                                    If you did not create an account, please ignore this email. This link will expire in 24 hours.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>`
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
