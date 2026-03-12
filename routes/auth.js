const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt')

// Signup user
router.post('/sign-up', async (req, res) => {
    try {
        const userInDatabase = await User.findOne({ username: req.body.username})
        if(userInDatabase) {
            return res.status(409).json({ error: 'Username already taken' })
        }

        const user = await User.create({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10)
        })

        const payload = { username: user.username, _id: user._id }
        const token = jwt.sign({ payload }, process.env.JWT_SECRET)

        res.status(201).json({ token })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

// Signin user
router.post('/sign-in', async (req, res) => {
    try {
        // Check if user exists
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Check if password is correct
        const isMatch = bcrypt.compareSync(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Create the payload
        const payload = { username: user.username, _id: user._id };

        // Sign and send the token
        const token = jwt.sign({ payload }, process.env.JWT_SECRET);
        res.status(200).json({ token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;