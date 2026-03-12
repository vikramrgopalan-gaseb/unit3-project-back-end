const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const Class = require('../models/Class');

// GET /home - Fetch all data needed for the public landing page

router.get('/', async (req, res) => {
    try {
        
        // list the topics in order with the newest created topic first

        const topics = await Topic.find().populate('originator', 'username').sort({ createdAt: -1 });

        // list the classes in order with the newest created class first

        const classes = await Class.find().populate('originator', 'username').sort({ createdAt: -1 });

        res.status(200).json({ topics, classes });

    } catch (error) {

        res.status(500).json({ error: error.message });
    }
});

module.exports = router;