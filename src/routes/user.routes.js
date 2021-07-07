const controller = require('../controllers/user.controller')


const express = require('express')
const { registerUser, getUsersByUserId, getUsers, login } = require('../controllers/user.controller')

const router = express.Router();
const config = require('../utils/configuration');
const jwt = require('jsonwebtoken');
const logger = require('tracer').console()


const app = express()
//
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/register', registerUser)
// app.get('/register', checkToken, getUsers)
// app.get('/register/:id', checkToken, getUsersByUserId)
app.post('/login', login)


module.exports = app;