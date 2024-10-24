const jwt = require('jsonwebtoken');

// Helper function to create a JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Export the function to make it reusable
module.exports = { generateToken };