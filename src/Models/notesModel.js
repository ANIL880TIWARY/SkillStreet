const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const NotesSchema = new mongoose.Schema({
    authorId: {
        type: ObjectId,
        ref: "authors"
    },
    title: {
        type: String,
        required: true,
        unique:true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },

    isDeleted:{
        type:Boolean,
        default:false
    }


})


module.exports = mongoose.model('notes', NotesSchema)