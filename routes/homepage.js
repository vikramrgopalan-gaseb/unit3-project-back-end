const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const Class = require('../models/Class');
const verifyToken = require('../middleware/verify-token');

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



module.exports = router;