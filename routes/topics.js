const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Topic = require('../models/Topic');

router.post('/create-topic', async (req, res) => {
  try {
    const topicData = { ...req.body, author: req.user._id };
    const newTopic = new Topic(req.body);
    const savedTopic = await newTopic.save();
    res.status(201).json(savedTopic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;