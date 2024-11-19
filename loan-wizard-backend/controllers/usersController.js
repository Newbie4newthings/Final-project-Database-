// controllers/usersController.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { name, magic_email, password, role } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // SQL to insert user into the Users table
    const sql = 'INSERT INTO Users (name, magic_email, password, role) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [name, magic_email, hashedPassword, role || 'user'], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const userId = results.insertId;  // Get the user ID from the results of the insert
        console.log('User ID:', userId);  // Log the user ID for debugging

        // Insert the loan record into the loanamounts table
        const loanAmountSql = `
            INSERT INTO loanamounts (user_id, coin_amount, loan_start_date, loan_status) 
            VALUES (?, ?, NOW(), ?)
        `;
        
        db.query(loanAmountSql, [userId, 0, 'closed'], (err, loanResults) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to create loan record: ' + err.message });
            }

            const loanId = loanResults.insertId;  // Get the loan ID from the insert
            console.log('Loan ID:', loanId);  // Log the loan ID for debugging

            // Now insert into the transaction history table
            const transactionSql = `
                INSERT INTO TransactionHistories (loan_id, transaction_date, amount_paid, remaining_balance, remarks)
                VALUES (?, NOW(), ?, ?, ?)
            `;

            db.query(transactionSql, [loanId, 0, 0, 'Initial registration balance'], (err, transactionResults) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create transaction history: ' + err.message });
                }

                // Return the userId, loanId, and success message
                res.status(201).json({
                    message: 'User registered successfully, loan created, and transaction history recorded!',
                    userId: userId,  // Return the userId
                    loanId: loanId   // Return the loanId
                });
            });
        });
    });
});


// Login
router.post('/login', (req, res) => {
    const { magic_email, password } = req.body;
    const sql = 'SELECT * FROM Users WHERE magic_email = ?';
    
    db.query(sql, [magic_email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

        req.session.userId = user.user_id;
        req.session.role = user.role;
        res.json({ message: 'Login successful' });
    });
});


// Logout

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ error: 'Failed to log out' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
    });
});

module.exports = router;
