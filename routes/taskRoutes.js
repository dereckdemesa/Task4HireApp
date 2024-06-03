// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { isAuthenticated } = require('../middleware/auth');

// GET /tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /tasks
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const task = new Task({ ...req.body, userId: req.user._id });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /tasks/:id
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        Object.assign(task, req.body);
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /tasks/:id
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await task.remove();
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
