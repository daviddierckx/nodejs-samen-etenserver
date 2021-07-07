const express = require('express')
const controller = require('../controllers/participants.controller')
const { checkToken } = require("../../auth/token_validation")



const app = express()
//
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.post('/studenthome/:homeId/meal/:mealId/signup',checkToken, createUser)
// app.delete('/studenthome/:homeId/meal/:mealId/signoff',checkToken, getUsers)
app.get('/meal/:mealId/participants', controller.getAllParticipants)
app.get('/meal/:mealId/participants/:participantId', controller.getParticipantByID)

module.exports = app;