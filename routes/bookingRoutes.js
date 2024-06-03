const express = require('express');
const router = express.Router();
const Task = require('../models/Task');  // Ensure Task model is correctly imported
const isLoggedIn = require('../middleware/isLoggedIn');  // Ensure isLoggedIn middleware is imported

// Step 1: Select Service
router.get('/service', isLoggedIn, (req, res) => {
    res.render('bookingService');
});

router.post('/service', isLoggedIn, (req, res) => {
    req.session.booking = { service: req.body.service };
    res.redirect('/booking/date');
});

// Step 2: Select Date and Time
router.get('/date', isLoggedIn, (req, res) => {
    res.render('bookingDate');
});

router.post('/date', isLoggedIn, (req, res) => {
    req.session.booking.date = req.body.date;
    req.session.booking.time = req.body.time;
    res.redirect('/booking/address');
});

// Step 3: Enter Address
router.get('/address', isLoggedIn, (req, res) => {
    res.render('bookingAddress');
});

router.post('/address', isLoggedIn, async (req, res) => {
    req.session.booking.address = req.body.address;

    // Save booking to the database
    const task = new Task({
        title: req.session.booking.service,
        description: `Booking for ${req.session.booking.service} on ${req.session.booking.date} at ${req.session.booking.time}`,
        location: req.session.booking.address,
        category: req.session.booking.service,  // Assuming each service is a category
        userId: req.user._id  // Assuming the user is logged in
    });

    await task.save();
    req.flash('success', 'Booking successful!');
    res.redirect('/services');  // Redirect to services page after booking
});

module.exports = router;

