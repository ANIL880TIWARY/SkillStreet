const mongoose = require('mongoose');
const authorModel = require("../Models/AuthorModel")
const notesModel = require('../Models/notesModel')

//------------- ISVALID FUNCTION
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
//---------------------ISVALIDREQUESTBODY FUNCTION
const isValidRequestBody = function (requestBody) {
    if (Object.keys(requestBody).length > 0) {
        return true
    } else {
        return false
    }
    // return Object.keys(requestBody).length > 0
}
//------------------ISVALIDOBJECTID FUNCTION
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const createNotes = async function (req, res) {

    try {
        const requestBody = req.body;


        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid Data. Please provide notes details' })
            return
        }
        // EXTRACT PARAMS
        const { authorId, title, content } = requestBody;

        // VALIDATION STARTS
        if (!isValid(authorId)) {
            res.status(400).send({ status: false, message: 'authorId is required' })
            return
        }
        if (!isValidObjectId(authorId.trim())) {
            res.status(400).send({ status: false, message: `${authorId} is not a valid author id` })
            return
        }
        if (!isValid(title)) {
            res.status(400).send({ status: false, message: 'title body is required' })
            return
        }
        let duplicateTitle = await notesModel.findOne({ title: title.trim() })
        if (duplicateTitle) {
            return res.status(400).send({ status: false, msg: "title cannot be duplicate" })
        }
        if (!isValid(content)) {
            res.status(400).send({ status: false, message: 'content body is required' })
            return
        }
        // FIND AUTHOR BY AUTHORID
        const author = await authorModel.findById(authorId.trim());
        // NOT VALID AUTHOR ID
        if (!author) {
            res.status(400).send({ status: false, message: `Author does not exit` })
            return
        }
        // VALIDATION ENDS 

        // CREATE BLOG
        const newNotes = await notesModel.create(requestBody)
        res.status(201).send({ status: true, message: 'New note created successfully', data: newNotes })
        return
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message });
    }
}


const getNotes = async function (req, res) {
    try {

        // const notes = await notesModel.find({ isDeleted: false }).select({"authorId":1,"title":1,"content":1).sort({title:1})
        const notes = await notesModel.find({ isDeleted: false }).select("authorId title content").sort("title")
        if (notes.length === 0) {
            return res.status(404).send({ status: false, message: "No notes found according to your search" })
        }
        return res.status(200).send({ status: true, TotalNotes: notes.length, data: notes })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const getNotesById = async function (req, res) {
    try {
        let notesId = req.params.notesId;
        console.log(notesId)
        if (!isValidObjectId(notesId)) {
            res.status(400).send({ status: false, message: " NotesId is not Valid" })
            return
        }
        let notes = await notesModel.findOne({ _id: notesId, isDeleted: false }).select("authorId title content");
        if (!notes) {
            return res.status(404).send({ status: false, message: "No notes found fot thid ID" })
        }
        return res.status(200).send({ status: true, message: ' Your Notes', data: notes });
    }
    catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}


const updateNotes = async (req, res) => {
    try {
        let decodeId = req.authorId
        // console.log(req.authorId)

        let notesId = req.params.notesId;
        let data = req.body
        if (!isValidRequestBody(data)) {
            res.status(400).send({ status: false, message: 'Provide data for update notes' })
            return
        }
        if (!isValidObjectId(notesId)) {
            res.status(400).send({ status: false, message: " Invalid NotesId" })
            return
        }


        let isNotes = await notesModel.findById(notesId)

        if (!isNotes) {
            return res.status(400).send({ status: false, msg: "No Notes found with this id, Check your id." })
        }

        if (isNotes.isDeleted === true) {
            return res.status(400).send({ status: false, msg: "Cannot update, Notes has been deleted." })
        }
        if (isNotes.authorId.toString() != decodeId) {
            res.status(401).send({ status: false, message: `Unauthorized access!Cannot update other's Notes` });
            return
        }

        let duplicateTitle = await notesModel.findOne({ title: data.title })
        if (duplicateTitle) { return res.status(400).send({ status: false, msg: "title cannot be duplicate" }) }

        let updatedNotes = await notesModel.findOneAndUpdate({ _id: notesId },
            { $set: { title: data.title, content: data.content, createdAt: isNotes.createdAt, lastUpdated: new Date() } }, { new: true })
        return res.status(201).send({ status: true, msg: "Updated Notes", data: updatedNotes })
    }
    catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}


let deleteNotes = async function (req, res) {
    try {
        let notesId = req.params.notesId;
        let decodeId = req.authorId

        if (!isValidObjectId(notesId)) {
            res.status(400).send({ status: false, message: " Invalid NotesId" })
            return
        }

        let note = await notesModel.findById(notesId)
        if (!note) {
            res.status(404).send({ status: false, message: "Notes not found" })
            return
        }
        if (note.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "Notes has already been deleted" })
        }
        if (note.authorId != decodeId) {
            res.status(401).send({ status: false, message: `Unauthorized access! Cannot delet this note` });
            return
        }
        await notesModel.findOneAndUpdate({ _id: notesId },
            { $set: { isDeleted: true } }, { new: true })
        return res.status(202).send({ status: true, msg: "Notes Deleted Successfully" })
    }
    catch (err) { return res.status(500).send({ status: false, message: err.message }) }
}


module.exports = { createNotes, getNotes, getNotesById, updateNotes, deleteNotes }