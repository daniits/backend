require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorMiddleware');
const itemRoutes = require('./routes/itemRoute');
const authRoutes = require('./routes/authRoute');
const cors = require('cors');


const app = express();


// CROS Error Resolve 
app.use(cors());

// Middleware
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/item', itemRoutes);
app.use("/api/user", authRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Set port from environment or default to 4000
const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
