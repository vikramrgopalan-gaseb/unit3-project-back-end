require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const crudRoutes = require('./routes/crud'); // Example protected routes

const app = express();

// --- MIDDLEWARE ---
app.use(cors()); // Allow cross-origin requests from your React app
app.use(express.json()); // Parse incoming JSON request bodies

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/items', crudRoutes); // CRUD routes usually go here

// --- GLOBAL ERROR HANDLING ---
// This catches any errors passed to next(err)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));
