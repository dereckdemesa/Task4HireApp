const express = require('express');
const router = express.Router();

// Render services page
router.get('/', (req, res) => {
    res.render('services');
});

module.exports = router;
