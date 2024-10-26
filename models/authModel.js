const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define schema for user authentication
const AuthSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,  
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetOTP: String,
    resetOTPExpires: Date,
}, {
    timestamps: true  
});

// Compare input password with hashed password
AuthSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Auth', AuthSchema);
