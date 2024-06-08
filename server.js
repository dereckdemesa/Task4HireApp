require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/passport-config');
const isLoggedIn = require('./middleware/isLoggedIn');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;
const SECRET_SESSION = process.env.SECRET_SESSION;

// Initialize app
const app = express();

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));
app.use(flash());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// middleware for tracking users and alerts
app.use((req, res, next) => {
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next();
});


// Define routes
app.get('/', (req, res) => {
    res.render('home', { siteTitle: 'Task4Hire', user: req.user });
});

app.get('/profile', isLoggedIn, async (req, res) => {
    try {
        console.log('req.user:', req.user); 
        if (!req.user) {
            console.error('User is not defined');
            return res.redirect('/auth/login');
        }
        const user = await User.findById(req.user._id);
        const bookings = await Task.find({ userId: req.user._id });

       
        const latestBooking = bookings.length > 0 ? bookings[bookings.length - 1] : {};
        const address = latestBooking.address || '';

        res.render('profile', { user, bookings, address });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/services', (req, res) => {
    const services = [
        { name: 'Indoor Painting', description: 'Professional indoor painting services.' },
        { name: 'Furniture Assembly', description: 'Expert furniture assembly.' },
        { name: 'General Mounting', description: 'Mounting services for TVs, frames, etc.' },
        { name: 'Help Moving', description: 'Assistance with moving and relocation.' },
        { name: 'Cleaning', description: 'Professional cleaning services.' },
        { name: 'Door, Cabinet, & Furniture Repair', description: 'Repair services for doors, cabinets, and furniture.' }
         // add more services as needed...
];
       
    
    res.render('services', { services, user: req.user });
});

// Import auth routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const taskRoutes = require('./routes/taskRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const methodOverride = require('method-override');

app.use('/auth', authRoutes);
app.use('/services', serviceRoutes);
app.use('/booking', bookingRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payment', paymentRoutes);
app.use(methodOverride('_method'));

// Error handling for 404
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🏎️ You are listening on PORT ${PORT}`);
});

module.exports = server;

