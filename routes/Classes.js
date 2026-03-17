const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verify-token')
const Class = require('../models/Class')

router.post('/create-class', verifyToken, async (req, res) => {
    try {
        const classInDatabase = await Class.findOne({ title: req.body.title })
        if(classInDatabase) {
            return res.status(409).json({ error: 'A class with that title already exists' })
        }

        const createdClass = await Class.create(req.body)
        res.status(201).json(createdClass)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const foundClass = await Class.find()
        res.status(201).json(foundClass)
    } catch (error) {
        res.status(500).json({ error: error.message })        
    }
})

router.put('/:classId', verifyToken, async (req, res) => {
    try {
        const updatedClass = await Class.findByIdAndUpdate(req.params.classId, req.body, {new: true})
        if(!updatedClass) {
            res.status(404)
            throw new Error('Class not found')
        }
        res.status(200).json(updatedClass)
    } catch (error) {
        if(res.statusCode === 404){
            res.json({ error: error.message })
        } else {
            res.status(500).json({ error: error.message })
        }        
    }
})

router.delete('/:classId', verifyToken, async (req, res) => {
    try {
        const deletedClass = await Class.findByIdAndDelete(req.params.classId)
         if(!deletedClass) {
            res.status(404)
            throw new Error('Class not found')
        }
        res.status(200).json(deletedClass)
    } catch (error) {
        if(res.statusCode === 404){
            res.json({ error: error.message })
        } else {
            res.status(500).json({ error: error.message })
        }        
    }
})

module.exports = router;