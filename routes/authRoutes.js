const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Render sign up page
router.get('/signup', (req, res) => {
    res.render('signup');
});

// Handle sign up form submission
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ username, email, passwordHash, firstName, lastName });
        await user.save();
        req.flash('success', 'You have successfully signed up!');
        res.redirect('/');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Render log in page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle log in form submission
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set the token as a cookie
        res.cookie('token', token, { httpOnly: true });

        // Redirect to home page
        res.redirect('/');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

