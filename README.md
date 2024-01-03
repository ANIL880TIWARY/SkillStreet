# SkillStreet


Models
Author Model
{ fname: { mandatory}, lname: {mandatory}, email: {mandatory, valid email, unique,lowercase}, password: {mandatory} }

Notes Model
{ title: {mandatory,unique}, content: {mandatory}, authorId: {mandatory, refs to author model}, createdAt:{date,default:current date}, lastupdated:{date,default:current date}, isDeleted: {boolean, default: false}
}

 Author APIs /authors
Created an author
Created a author document from request body. Endpoint: BASE_URL/register
login author .Endpoint: BASE_URL/login


POST / Notes
Created a note from request body. AuthorId from request body ref to author.
Make sure the authorId is a valid authorId by checking the author exist in the authors collection.
Endpoint: BASE_URL/createNotes
Return HTTP status 201 on a succesful note creation. Also return the note document. The response should be a JSON object like this

Successful Response structure
{
  status: true,
  msg:" " ,
  data:{
  }
}
Return HTTP status 400 for an invalid request with a response body like this
Error Response structure
{
  status: false,
  msg: " "
}


GET /notes
Returns all notes in the collection that aren't deleted .
Endpoint: BASE_URL/getNotes
Return the HTTP status 200 if any documents are found. The response structure should be like this
Successful Response structure
{
  status: true,
  msg: " ",
  data:{
  }
}
If no documents are found then return an HTTP status 404 with a response like this
Error Response structure
{
  status: false,
  msg: ""
}

Get  notes by notesId
return notes by notesId which is not deleted
Endpoint: BASE_URL/getNotesById/:notesId

Updated notes by notesId
Updates a note by changing the its title(should not be duplicate), content.
lastUpdate field will be updated.
Endpoint: BASE_URL/updateNotes/:notesId
In the response it  return the updated notes document.

DELETE notes by notesId
Check if the notesId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
If the note document doesn't exist then return an HTTP status of 404 with a body like this
{
  status: false,
  msg: ""
}

Authentication  feature
POST /login
Allow an author to login with their email and password. On a successful login attempt return a JWT token contatining the authorId


Authorisation
Implement authorisation for update notes and delete notes.
This is done in controller part instead of create a new middleware
Authorisation
Make sure that only the owner of the blogs is able to edit or delete the blog.
In case of unauthorized access return an appropirate error message.



Testing
Refer below sample
A Postman collection and request sample
Collections

Authors
{
    "status": true,
    "msg": "Author created successfully",
    "data": {
        "firstName": "Rakesh",
        "lastName": "Kumar",
        "email": "rakesh@gmail.com",
        "password": "$2b$10$1CsSCtxfPGQ6tdH14wKPSuA8ti0pYYdXScY1bFRn1SiTr2JBDhWp2",
        "_id": "65958f38c6f8c651c180647f",
        "createdAt": "2024-01-03T16:45:44.808Z",
        "updatedAt": "2024-01-03T16:45:44.808Z",
        "__v": 0
    }
}


notes
{
    "status": true,
    "message": "New note created successfully",
    "data": {
        "authorId": "65958ea49c14ee617cb9547f",
        "title": "Tech",
        "content": "Tech is magic.",
        "isDeleted": false,
        "_id": "6595b50716fcc05a14a2f7f0",
        "createdAt": "2024-01-03T19:27:03.186Z",
        "lastUpdated": "2024-01-03T19:27:03.186Z",
        "__v": 0
    }
}






