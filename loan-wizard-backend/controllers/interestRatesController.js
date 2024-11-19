// controllers/interestRatesController.js
const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Add interest rate to a loan
router.post('/', (req, res) => {
    const { loan_id, interest_rate_percent } = req.body;
    const sql = 'INSERT INTO InterestRates (loan_id, interest_rate_percent) VALUES (?, ?)';
    db.query(sql, [loan_id, interest_rate_percent], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Interest rate added!' });
    });
});

module.exports = router;
