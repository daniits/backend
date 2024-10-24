const mongoose = require('mongoose');

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
    },
    isVerified: {
        type: Boolean,
        default: false, 
    },
    verificationToken: {
        type: String,
    },
    verificationTokenExpires: {
        type: Date,
    },
}, {
    timestamps: true 
});

const Auth = mongoose.model('Auth', AuthSchema);

module.exports = Auth;
