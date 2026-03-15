const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token')
const Topic = require('../models/Topic');

// CREATE

router.post('/create-topic', async (req, res) => {
  try {
    const newTopic = new Topic({...req.body, author: req.user._id });

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