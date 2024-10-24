const mongoose = require('mongoose');

const AuthSchema  = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const Auth = mongoose.model('Auth', AuthSchema);

module.exports = Auth;