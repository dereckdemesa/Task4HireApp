const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('./models/User');
const bcrypt = require('bcrypt');

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
        res.redirect('/auth/login');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Render log in page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle log in form submission
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

// Handle log out
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'You have logged out.');
        res.redirect('/');
    });
});

module.exports = router;
