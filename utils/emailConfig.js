const nodemailer = require('nodemailer');


console.log({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD ? 'Loaded' : 'Not Loaded'
});
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    logger: true,
    debug: true,
    connectionTimeout: 60000, // 60 seconds
    socketTimeout: 60000, // 60 seconds
    greetingTimeout: 30000 // 30 seconds
});


module.exports = transporter;