const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const isLoggedIn = require('../middleware/isLoggedIn');

// render profile page
router.get('/', isLoggedIn, async (req, res) => {
    try {
        const bookings = await Task.find({ userId: req.user._id });
        res.render('profile', { user: req.user, bookings: bookings });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
