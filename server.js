require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// UNPROTECTED HOME ROUTE

const homeRouter = require('./routes/home');

// PROTECTED ROUTES

const topicRoutes = require('./routes/topics');
const classesRoutes = require('./routes/Classes')
const authRoutes = require('./routes/auth');
// const crudRoutes = require('./routes/crud');

const app = express();

// --- MIDDLEWARE ---

app.use(cors());
app.use(express.json());

// --- APP ROUTES ---

app.use('/home', homeRouter); 

app.use('/topics', topicRoutes);
app.use('/classes', classesRoutes)
app.use('/auth', authRoutes);
// app.use('/api/items', crudRoutes);

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