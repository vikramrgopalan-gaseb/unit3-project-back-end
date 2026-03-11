const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verify-token')
const Class = require('../models/Class')

router.post('/create-class', verifyToken, async (req, res) => {
    try {
        const classInDatabase = await Class.findOne({ title: req.body.title })
        if(classInDatabase) {
            return res.status(409).json({ error: 'A class with that title already exists'})
        }

        await Class.create(req.body)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})