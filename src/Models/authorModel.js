const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,

    },
    password: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true })


module.exports = mongoose.model('authors', AuthorSchema)