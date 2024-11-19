// controllers/repaymentController.js
const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Helper function to parse and validate date
const parseDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
};

// Create a new repayment schedule
router.post('/', (req, res) => {
    const { loan_id, due_date, amount_due, status } = req.body;

    // Log received loan_id to help with debugging
    console.log("Received loan_id:", loan_id);

    // Validate loan_id
    if (!loan_id || typeof loan_id !== 'number') {
        console.error("Loan ID Error:", loan_id);
        return res.status(400).json({ error: "Invalid or missing loan_id" });
    }

    // Validate and parse due_date
    const parsedDueDate = parseDate(due_date);
    if (!parsedDueDate) {
        return res.status(400).json({ error: "Invalid due_date format. Use 'YYYY-MM-DD'" });
    }

    // Validate amount_due
    if (!amount_due || typeof amount_due !== 'number' || amount_due <= 0) {
        return res.status(400).json({ error: "Invalid or missing amount_due. Must be a positive number." });
    }

    // Validate status (optional, defaults to 'unpaid' if not provided)
    const allowedStatuses = ['paid', 'unpaid', 'overdue'];
    const repaymentStatus = status && allowedStatuses.includes(status) ? status : 'unpaid';

    // SQL query to insert repayment schedule
    const sql = 'INSERT INTO RepaymentSchedules (loan_id, due_date, amount_due, status) VALUES (?, ?, ?, ?)';
    db.query(sql, [loan_id, parsedDueDate, amount_due, repaymentStatus], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database error occurred." });
        }
        res.status(201).json({ message: 'Repayment schedule created successfully!' });
    });
});

router.post('/getLatestLoanInfo', (req, res) => {
    const userId = req.session.userId;  // Assuming user ID is stored in req.session

    // Debug log the user ID
    console.log("User ID from session:", userId);

    if (!userId) {
        console.log("User ID is not set in session!");
        return res.status(400).json({ error: 'User not authenticated' });
    }

    const query = `
        SELECT l.loan_id, rs.due_date, rs.term_days, th.remaining_balance,th.transaction_id
        FROM LoanAmounts AS l
        JOIN RepaymentSchedules AS rs ON l.loan_id = rs.loan_id
        JOIN TransactionHistories AS th ON l.loan_id = th.loan_id
        WHERE l.user_id = ?
        ORDER BY transaction_id DESC
        limit 1
    `;

    // Log the query and parameters to verify they are correct
    console.log("Executing query:", query, "with user ID:", userId);

    db.query(query, [userId], (err, results) => {
        if (err) {
            // Log the error for debugging
            console.error("Database error:", err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            console.log("No loans found for user ID:", userId);
            return res.status(404).json({ message: "No loans found for this user." });
        }

        // Log the results to verify
        console.log("Database query results:", results);

        // Send the latest loan information
        const latestLoan = results[0];
        res.json({
            loanId: latestLoan.loan_id,
            due_date: latestLoan.due_date,
            term_days: latestLoan.term_days,
            remaining_balance: latestLoan.remaining_balance
        });
    });
});


// controllers/repaymentsController.js

exports.updateRepayment = async (req, res) => {
    const { loan_id, due_date, amount_due, status } = req.body;

    try {
        // Step 2: Update the RepaymentSchedules table
        await db.query(`
            UPDATE RepaymentSchedules 
            SET due_date = ?, amount_due = ?, status = ?
            WHERE loan_id = ?
        `, [due_date, amount_due, status, loan_id]);

        // Step 3: Insert into TransactionHistories table
        await db.query(`
            INSERT INTO TransactionHistories (loan_id, transaction_date, amount_paid, remaining_balance, remarks)
            VALUES (?, NOW(), ?, ?, ?)
        `, [loan_id, amount_due, remaining_balance, remarks]);

        res.send("Repayment processed successfully.");
    } catch (error) {
        console.error("Error processing repayment:", error);
        res.status(500).send("Internal Server Error");
    }
};



module.exports = router;
