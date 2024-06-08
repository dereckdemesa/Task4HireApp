const express = require('express');
const router = express.Router();


const services = [
    { name: 'Indoor Painting', description: 'Painting services for indoor spaces.' },
    { name: 'Furniture Assembly', description: 'Assembly services for various furniture.' },
    { name: 'General Mounting', description: 'Mounting services for TVs, frames, etc.' },
    { name: 'Help Moving', description: 'Assistance with moving and relocation.' },
    { name: 'Cleaning', description: 'Professional cleaning services.' },
    { name: 'Door, Cabinet, & Furniture Repair', description: 'Repair services for doors, cabinets, and furniture.' }
];

// render services page
router.get('/', (req, res) => {
    res.render('services', { user: req.user, services });
});

module.exports = router;

