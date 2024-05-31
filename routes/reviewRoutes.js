// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const Review = require('./models/Review');
const { isAuthenticated } = require('../middleware/auth');

// GET /reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /reviews
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const review = new Review({ ...req.body, reviewerId: req.user._id });
        await review.save();
        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /reviews/:id
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        if (review.reviewerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        Object.assign(review, req.body);
        await review.save();
        res.json(review);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /reviews/:id
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        if (review.reviewerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await review.remove();
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
