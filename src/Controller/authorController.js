const AuthorModel = require("../Models/AuthorModel")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const accessKey = "someverysecuredprivatekey"

//------------- ISVALID FUNCTION
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
//---------------------ISVALIDREQUESTBODY FUNCTION
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}


const createAuthor = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Please provide details for create auothor' })
            return

        }
        const { firstName, lastName, email, password } = requestBody
        if (!isValid(firstName)) {
            res.status(400).send({ status: false, message: 'Please provide First Name' })
            return
        }
        if (!isValid(lastName)) {
            res.status(400).send({ status: false, message: 'Please provide Last Name' })
            return
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, message: 'Please provide Email-id' })
            return
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }
        const isemail = await AuthorModel.findOne({ email })
        if (isemail) {
            res.status(400).send({ status: false, message: 'email already used' })
            return
        }
        if (!isValid(password)) {
            res.status(400).send({ status: false, message: 'Please provide Password' })
            return
        }
        const hashPass = await bcrypt.hash(password, 10)

        const author = { firstName, lastName, email, password: hashPass }
        let authorCreated = await AuthorModel.create(author)
        res.status(201).send({ status:true, msg: "Author created successfully" ,data: authorCreated})
    }
    catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

const loginAuthor = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide login details' })
            return
        }
        // EXTRACT PARAMS
        const email = requestBody.email
        const password = requestBody.password
        // VALIDATION STARTS
        if (!isValid(email)) {
            res.status(400).send({ status: false, message: `Email is required` })
            return
        }
        
        if (!isValid(password.trim())) {
            res.status(400).send({ status: false, message: `Password is required` })
            return
        }
        // FIND AUTHOR DETAIL
        const authEmail = await AuthorModel.find({ email: email })
        if (!authEmail) {
            res.status(401).send({ status: false, message: `Invalid Email` });
            return
        }
        // console.log(authEmail[0].password)
        const isAuth = await bcrypt.compare(password.trim(), authEmail[0].password)
        if (!isAuth) {
            res.status(401).send({ status: false, message: `Invalid Password` });
            return
        }

        // GENERATE JWT TOKEN
        const token = await jwt.sign({
            authorId: authEmail[0]._id
        }, accessKey)

        res.header('x-api-key', token);
        res.status(200).send({ status: true, message: `Author login successfull`, data: token });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { createAuthor, loginAuthor }