// IMPORTS

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const verifyToken = require('./middleware/verify-token');

// UNPROTECTED HOME ROUTE

const homepageRoute = require('./routes/homepage');

// PROTECTED ROUTES

const authRoute = require('./routes/auth');
const classesRoute = require('./routes/Classes');
const topicsRoute = require('./routes/topics');

// EXPRESS

const app = express();

// --- MIDDLEWARE ---

app.use(cors());
app.use(express.json());
// app.use(verifyToken())

// --- APP ROUTES ---

app.use('/', homepageRoute); 

app.use('/auth', authRoute);
app.use('/topics', topicsRoute);
app.use('/classes', classesRoute);

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
    
app.listen(process.env.PORT, () => {

console.log(`Server running on port ${process.env.PORT}`);

        });

mongoose.connection.on('error', err => {
    console.log(err);
});