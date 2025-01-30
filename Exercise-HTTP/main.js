//start with npm run start

/* api: 

GET /users -> returns all users
GET /users/:id -> returns user with id
POST /users -> creates a new user
PUT /users/:id -> replaces user with id
PATCH /users/:id -> changes user with id
DELETE /users/:id -> deletes user with id

*/
var express = require("express");
var app = express();
app.listen(8080, () => {
  console.log("Listening on http://localhost:8080");
});

app.use( express.json() )
let users = []

const idTaken = (id) => {
  return users.some(user => user.id === id)
}

const isValidUserFormat = (user) => {
  if (
    typeof user.id !== "number" ||
    typeof user.userName !== "string" ||
    typeof user.officialName !== "string" ||
    typeof user.dateOfBirth !== "string"
  ) return false
  return true
}

const getUser = (req, res) => {
  const id = parseInt(req.params.id)
  const user = users.find(user => user.id === id)
  if (!user) {
    res.status(404).send({ err: "User not found" })
    return null
  }
  return user
} 

const getUserIndex = (req, res) => {
  const userIndex = users.findIndex(user => user.id === parseInt(req.params.id))
  if (userIndex === -1) {
    res.status(404).send({ err: "User not found" })
    return null
  }
  return userIndex
}


//add demo users
users.push(
{
  id : 1, 
  userName : "demoUser", 
  officialName : "Cedric Briot", 
  dateOfBirth : "04.07.2005"
})
users.push(
{
  id : 2,
  userName : "demoUser2",
  officialName : "Timon Erben",
  dateOfBirth : "14.6.2004"
})



app.get("/users", (req,res) => {
  if (users.length == 0) {
    return res.status(404).send({
      err: "No users found"
    })
  }

  return res.status(200).send(users)
})

app.get("/users/:id", (req,res) => {
  const user = getUser(req, res)
  if (!user) return
  res.status(200).send(user)
})

app.post("/users", (req, res) => {
  const newUser = req.body

  if ( !newUser.id || !newUser.userName || !newUser.officialName || !newUser.dateOfBirth ) {
    return res.status(422).send({
      err: "Missing user data -> valid format:",
      id: "number",
      userName: "String",
      officialName: "String",
      dateOfBirth: "DD.MM.YYYY"
    })
  }
  if (idTaken(newUser.id)) {
    return res.status(409).send({
      err: "User id already taken"
    })
  }
  if (!isValidUserFormat(newUser)){
    return res.status(422).send({
      err: "Invalid user data -> valid format:",
      id: "number",
      userName: "String",
      officialName: "String",
      dateOfBirth: "DD.MM.YYYY"
    })
  }
  users.push(newUser)
  return res.status(201).send({ msg: "User created successfully", createdUser: newUser })
})

app.put("/users/:id", (req, res) => {
  const userIndex = getUserIndex(req, res)
  if (userIndex === null) return

  const updatedUser = req.body

  if ( !updatedUser.id || !updatedUser.userName || !updatedUser.officialName || !updatedUser.dateOfBirth ) {
    return res.status(422).send({
      err: "Missing user data -> valid format:",
      id: "number",
      userName: "String",
      officialName: "String",
      dateOfBirth: "DD.MM.YYYY"
    })
  }
  if (!isValidUserFormat(updatedUser)){
    return res.status(422).send({
      err: "Invalid user data -> valid format:",
      id: "number",
      userName: "String",
      officialName: "String",
      dateOfBirth: "DD.MM.YYYY"
    })
  }
  users[userIndex] = updatedUser
  return res.status(201).send({ msg: "User replaced successfully", replacedUser: updatedUser })
})

app.patch("/users/:id", (req, res) => {
  const changes = req.body
  const userIndex = getUserIndex(req, res)
  if (userIndex === null) return

  const allowedFields = ["userName", "officialName", "dateOfBirth"]
  
  Object.keys(changes).forEach(key => {
    if (allowedFields.includes(key)) updatedUser[key] = changes[key]
    users[userIndex][key] = changes[key]
  })

  return res.status(200).send({ msg: "User changed successfully", user: users[userIndex] })
})

app.delete("/users/:id", (req, res) => {
  const user = getUser(req, res)
  if (!user) return

  users = users.filter(u => u.id !== user.id)

  return res.status(204).send()
})