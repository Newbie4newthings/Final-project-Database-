// controllers/transactionsController.js
const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Record a transaction
router.post('/', (req, res) => {
    const { loan_id, amount_paid, remaining_balance, remarks } = req.body;
    const sql = 'INSERT INTO TransactionHistories (loan_id, amount_paid, remaining_balance, remarks) VALUES (?, ?, ?, ?)';
    db.query(sql, [loan_id, amount_paid, remaining_balance, remarks], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Transaction recorded!' });
    });
});

router.get('/transactions_details', (req, res) => {
    const userId = req.session.userId;  // Assuming user ID is stored in req.session

    // Debug log the user ID
    console.log("User ID from session:", userId);

    if (!userId) {
        console.log("User ID is not set in session!");
        return res.status(400).json({ error: 'User not authenticated' });
    }

    const sql = `
        SELECT transaction_date, amount_paid, remaining_balance, remarks
        FROM transactionhistories as th
        join loanamounts as l on l.loan_id = th.loan_id
        WHERE user_id = ?
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).json({ error: 'An error occurred while fetching transaction history.' });
        }
        // If no transactions are found
        if (results.length === 0) {
            return res.status(404).json({ message: 'No transaction history found for this loan.' });
        }

        // Return the list of transactions
        res.status(200).json({ transactions: results });
    });
});

module.exports = router;
