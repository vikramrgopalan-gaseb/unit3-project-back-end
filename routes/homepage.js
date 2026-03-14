const express = require('express');
const router = express.Router();
const User = require('../models/User')
const Topic = require('../models/Topic');
const Class = require('../models/Class');
const verifyToken = require('../middleware/verify-token');

// GET /home - Fetch all data needed for the public landing page

router.get('/', async (req, res) => {
    try {

        // list all users
        const allUsers = await User.find()
        
        // list the topics in order with the newest created topic first

        const topics = await Topic.find().sort({ createdAt: -1 });

        // list the classes in order with the newest created class first

        const classes = await Class.find().sort({ createdAt: -1 });

        res.status(200).json({ topics, classes, allUsers });

    } catch (error) {

        res.status(500).json({ error: error.message });
    }
});

router.put('/:classId/enroll', verifyToken, async (req, res) => {
    try {
        const enrolledClass = await Class.findById(req.params.classId)
        if(!enrolledClass) {
            res.status(404)
            throw new Error('Class not found')
        }

        const studentInClass = enrolledClass.enrollment.findOne({ _id: req.body._id })
        if(studentInClass) {
            return res.status(409).json({ error: 'User already enrolled in class'})
        }

        enrolledClass.enrollment.push(req.body)
        await enrolledClass.save()
        res.status(200).json(enrolledClass)
    } catch (error) {
        if(res.statusCode === 404){
            res.json({ error: error.message })
        } else {
            res.status(500).json({ error: error.message })
        }        
    }
})

router.put('/:classId/disenroll', verifyToken, async (req, res) => {
    try {
        const disenrolledClass = await Class.findById(req.params.classId)
        if(!disenrolledClass) {
            res.status(404)
            throw new Error('Class not found')
        }

        const indexOfStudent = disenrolledClass.enrollment.findIndex((student) => student._id === req.body._id)
        if(!indexOfStudent) {
            res.status(404)
            throw new Error('Student not found')
        }
        
        disenrolledClass.enrollment.splice(indexOfStudent, 1)
        await disenrolledClass.save()
        res.status(200).json(disenrolledClass)
    } catch (error) {
        if(res.statusCode === 404){
            res.json({ error: error.message })
        } else {
            res.status(500).json({ error: error.message })
        }        
    }
})

// UPVOTE

router.post('/:id/upvote', verifyToken, async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        const userId = req.body._id;

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
        const userId = req.body._id;

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

module.exports = router;