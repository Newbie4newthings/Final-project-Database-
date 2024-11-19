//server.js
const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const db = require('./config/db');
const path = require('path');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');

// Initialize dotenv
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure session
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true if using HTTPS in production
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 600000 
    }
}));

// Parse JSON bodies
app.use(express.json());
app.use(cors());
// Load controllers
const usersController = require('./controllers/usersController');
const loansController = require('./controllers/loansController');
const interestRatesController = require('./controllers/interestRatesController');
const repaymentController = require('./controllers/repaymentController');
const transactionsController = require('./controllers/transactionsController');

// Define Routes
app.use('/api/users', usersController);                // Public routes
app.use('/api/loans', authMiddleware, loansController); // Protected routes
app.use('/api/interest-rates', authMiddleware, interestRatesController);
app.use('/api/repayments', authMiddleware, repaymentController);
app.use('/api/transactions', authMiddleware, transactionsController);

// Catch-all route to serve the main index.html file for single-page apps
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
