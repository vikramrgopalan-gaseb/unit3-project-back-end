const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Topic = require('../models/Topic');

// UPVOTE

router.post('/:id/upvote', verifyToken, async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        const userId = req.user._id;

        // Remove user from downvotes if they are there
        // Create a new array without the current user's ID
        topic.downvotes = topic.downvotes.filter(id => !id.equals(userId));

        // Add to upvotes ONLY if they aren't already in the list
        // Use .some() to check if the ID exists in the array
        const alreadyUpvoted = topic.upvotes.some(id => id.equals(userId));
        
        if (!alreadyUpvoted) {
            topic.upvotes.push(userId);
        }

        // Manually save the document back to MongoDB
        await topic.save();
        res.json(topic);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DOWNVOTE

router.post('/:id/downvote', verifyToken, async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        const userId = req.user._id;

        // Remove user from upvotes
        topic.upvotes = topic.upvotes.filter(id => !id.equals(userId));

        // Add to downvotes if not already there
        const alreadyDownvoted = topic.downvotes.some(id => id.equals(userId));
        
        if (!alreadyDownvoted) {
            topic.downvotes.push(userId);
        }

        // Save changes
        await topic.save();
        res.json(topic);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE

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

// READ

router.get('/', async (req, res) => {
    try {
        const foundTopic = await Topic.find()
        res.status(201).json(foundTopic)
    } catch (error) {
        res.status(500).json({ error: error.message })        
    }
})

// UPDATE

router.put('/:topicId', verifyToken, async (req, res) => {
    try {
        const updatedTopic = await Topic.findByIdAndUpdate(req.params.topicId, req.body, {new: true})
        if(!updatedTopic) {
            res.status(404)
            throw new Error('Topic not found')
        }
        res.status(200).json(updatedTopic)
    } catch (error) {
        if(res.statusCode === 404){
            res.json({ error: error.message })
        } else {
            res.status(500).json({ error: error.message })
        }        
    }
})

// DELETE

router.delete('/:topicId', verifyToken, async (req, res) => {
    try {
        const deletedTopic = await Topic.findByIdAndDelete(req.params.topicId)
         if(!deletedTopic) {
            res.status(404)
            throw new Error('Topic not found')
        }
        res.status(200).json(deletedTopic)
    } catch (error) {
        if(res.statusCode === 404){
            res.json({ error: error.message })
        } else {
            res.status(500).json({ error: error.message })
        }        
    }
})

module.exports = router;