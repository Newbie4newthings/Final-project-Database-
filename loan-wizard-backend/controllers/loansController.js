// controllers/loansController.js
const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Create a new loan
router.post('/', (req, res) => {
    const { coin_amount } = req.body;
    const sql = 'INSERT INTO LoanAmounts (user_id, coin_amount) VALUES (?, ?)';
    
    db.query(sql, [req.session.userId, coin_amount], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Retrieve the last inserted loan_id
        const loanId = results.insertId;

        // Return the loan_id in the response
        res.status(201).json({ message: 'Loan created successfully!', loan_id: loanId });
    });
});


// Get loans for the logged-in user
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM LoanAmounts WHERE user_id = ?';
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


router.get('/latest-balance', (req, res) => {
    const userId = req.session.userId;  // Assuming user ID is stored in req.session

    // Debug log the user ID
    console.log("User ID from session:", userId);

    if (!userId) {
        console.log("User ID is not set in session!");
        return res.status(400).json({ error: 'User not authenticated' });
    }

    const query = `
        SELECT th.remaining_balance 
        FROM transactionhistories th 
        JOIN loanamounts as la ON th.loan_id = la.loan_id 
        WHERE la.user_id = ? 
        ORDER BY th.transaction_date DESC 
        LIMIT 1
    `;

    // Log the query and parameters to verify they are correct
    console.log("Executing query:", query, "with user ID:", userId);

    db.query(query, [userId], (err, results) => {
        if (err) {
            // Log the error for debugging
            console.error("Database error:", err);
            return res.status(500).json({ error: 'Database error', details: err });
        }

        if (results.length === 0) {
            console.log("No transactions found for user ID:", userId);
            return res.status(404).json({ message: 'No transactions found for this user' });
        }

        // Log the results to verify
        console.log("Database query results:", results);

        // Send the latest remaining balance
        res.json({ remaining_balance: results[0].remaining_balance });
    });
});

// Define the endpoint to retrieve only the name
router.get('/get_user_name', async (req, res) => {
    // Extract user_id from the session
    const userId  = req.session.userId ;

    // Check if user_id is in the session
    if (!userId ) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    try {
        // SQL query to get the name from the Users table
        const sql = 'SELECT name FROM Users WHERE user_id = ?';
        
        db.query(sql, [userId ], (err, results) => {
            if (err) {
                console.error('Error fetching user data:', err);
                return res.status(500).json({ error: 'An error occurred while fetching user data' });
            }

            // Check if the user was found
            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Return only the user's name
            res.status(200).json({
                name: results[0].name
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});

module.exports = router;
