const controller = require('../controllers/user.controller')


const express = require('express')
const { registerUser, getUsersByUserId, getUsers, login } = require('../controllers/user.controller')

const { checkToken } = require("../../auth/token_validation")




const app = express()
//
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/register', registerUser)
// app.get('/register', checkToken, getUsers)
// app.get('/register/:id', checkToken, getUsersByUserId)
app.post('/login', login)


module.exports = app;