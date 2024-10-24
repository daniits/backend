const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Auth = require('../models/authModel');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtUtils');
const dns = require('dns');

// Set up your mail transport (Gmail, SMTP, etc.)
const transporter = nodemailer.createTransport({
    service: 'Gmail',  // You can use other services or SMTP
    auth: {
        user: process.env.EMAIL,  // Your email
        pass: process.env.EMAIL_PASSWORD  // Your email password
    }
});

// Generate a verification token
const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');  // Generate a random string as the token
};

// Utility function to validate email format
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Utility function to check if a domain has MX records
const hasMXRecord = (email) => {
    const domain = email.split('@')[1];
    return new Promise((resolve, reject) => {
        dns.resolveMx(domain, (err, addresses) => {
            if (err || addresses.length === 0) {
                resolve(false); // No MX records found or error in DNS lookup
            } else {
                resolve(true); // MX records exist
            }
        });
    });
};

// SignUp Controller 
const signUp = async (req, res, next) => {
    const { userName, email, password } = req.body;
    try {
        // Check if all fields are provided
        if (!userName || !email || !password) {
            return next(new Error('Please provide all fields'));
        }

        // Validate email format
        if (!validateEmail(email)) {
            return next(new Error('Please provide a valid email address'));
        }

        // Check for MX record
        const emailHasMx = await hasMXRecord(email);
        if (!emailHasMx) {
            return next(new Error('Email domain does not have valid MX records'));
        }

        // Check if user already exists
        const userExists = await Auth.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create verification token
        const verificationToken = generateVerificationToken();

        // Create a new user with the hashed password and verification token
        const user = await Auth.create({
            userName,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpires: Date.now() + 3600000  // Token expires in 1 hour
        });

        // Send verification email
        const verificationUrl = `http://localhost:5000/api/auth/emailverfication?token=${verificationToken}`;
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Email Verification',
            html: `<p>Hi ${userName},</p>
                   <p>Please click the following link to verify your email:</p>
                   <a href="${verificationUrl}">Verify Email</a>`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            success: true,
            message: 'Verification email sent. Please check your inbox.',
            data: {
                _id: user._id,
                username: user.userName,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};



// Email verification controller
const emailVerfication = async (req, res, next) => {
    const { token } = req.query;  // Get the token from the query string

    try {
        // Find the user by the verification token and check if it's not expired
        const user = await Auth.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }  // Check if the token is still valid
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Mark the user as verified and clear the token fields
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;

        await user.save();

        res.status(200).json({ success: true, message: 'Email verified successfully!' });
    } catch (error) {
        next(error);
    }
};
// OTP Controlller 
const OTP = async (req, res, next) => {
    const { name, price, description } = req.body;
    try {
        const newItem = new Item({ name, price, description });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error });
    }
}

// SignIn Controlller 
const signIn = async (req, res, next) => {
    const { name, price, description } = req.body;
    try {
        const newItem = new Item({ name, price, description });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error });
    }
}

// Forgot Controlller 
const forgot = async (req, res, next) => {
    const { name, price, description } = req.body;
    try {
        const newItem = new Item({ name, price, description });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error });
    }
}

// New Password Controlller 
const newPassword = async (req, res, next) => {
    const { name, price, description } = req.body;
    try {
        const newItem = new Item({ name, price, description });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error });
    }
}


module.exports = { signUp, emailVerfication, OTP, signIn, forgot, newPassword };