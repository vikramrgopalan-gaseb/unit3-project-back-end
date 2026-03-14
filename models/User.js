const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },
   
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    }

});

// Hash password before saving to database
UserSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare passwords during login - build this out more, if not remove this (VIK)
UserSchema.methods.comparePassword = async function(typedPassword) {
    return await bcrypt.compare(typedPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);