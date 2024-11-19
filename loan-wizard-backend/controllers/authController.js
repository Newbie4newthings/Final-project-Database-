// controllers/authController.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const saltRounds = 10; // Number of salt rounds for bcryptjs

require('dotenv').config();

// Register a new user
router.post('/register', (req, res) => {
    const { name, hero_level, magic_email, password } = req.body;

    // Check if email already exists
    db.query('SELECT * FROM Users WHERE magic_email = ?', [magic_email], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already registered!' });
        }

        // If email is not registered, proceed to hash password and insert user
        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            db.query(
                'INSERT INTO Users (name, hero_level, magic_email, password) VALUES (?, ?, ?, ?)',
                [name, hero_level, magic_email, hashedPassword],
                (err, results) => {
                    if (err) return res.status(500).json(err);
                    res.json({ message: 'User registered!' });
                }
            );
        } catch (err) {
            res.status(500).json({ message: 'Error registering user.' });
        }
    });
});

// Login user and return JWT in a cookie
router.post('/login', (req, res) => {
    const { magic_email, password } = req.body;

    db.query('SELECT * FROM Users WHERE magic_email = ?', [magic_email], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(400).json({ message: 'User not found.' });

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password.' });

        // Generate a token
        const token = jwt.sign({ userId: user.user_id, email: user.magic_email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Set the token in a cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour
        res.json({ message: 'Login successful' });
    });
});

// Logout route to clear the cookie
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
