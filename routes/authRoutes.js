const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const isLoggedIn = require('../middleware/isLoggedIn');

// renders sign up page
router.get('/signup', (req, res) => {
    res.render('signup');
});

// sandles sign up form submission
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

// render log in page
router.get('/login', (req, res) => {
    res.render('login');
});

// handle log in form submission
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

// handles the log out
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'You have logged out.');
        res.redirect('/');
    });
});

// delete user profile
router.delete('/profile/delete', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;

        // find and delete the user from the database
        await User.findByIdAndDelete(userId);

        req.logout(function(err) {
            if (err) { return next(err); }
            req.flash('success', 'Your account has been deleted.');
            res.redirect('/');
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;


