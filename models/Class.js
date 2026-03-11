const mongoose = require('mongoose')

const classSchema = mongoose.Schema({
    originator: {
        type: String,
        required: true
    },
    Title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },

})

const Class = mongoose.model("Class", classSchema)

module.exports = Class