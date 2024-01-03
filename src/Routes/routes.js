const express = require('express');
const router = express.Router();

const authorContro = require("../Controller/authorController")
const notesContro = require("../Controller/notesCotroller")

const middleaware = require('../Auth/auth')


router.post("/register", authorContro.createAuthor)
router.post("/login", authorContro.loginAuthor)

router.post("/createNotes", middleaware.authorAuth, notesContro.createNotes)
router.get("/getNotes", middleaware.authorAuth, notesContro.getNotes)
router.get("/getNotesById/:notesId", middleaware.authorAuth, notesContro.getNotesById)
router.put("/updateNotes/:notesId", middleaware.authorAuth, notesContro.updateNotes)
router.delete("/deleteNotes/:notesId", middleaware.authorAuth, notesContro.deleteNotes)
module.exports = router; 