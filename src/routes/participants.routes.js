const express = require('express')
const controller = require('../controllers/participants.controller')



const app = express()
//
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.post('/studenthome/:homeId/meal/:mealId/signup',checkToken, createUser)
// app.delete('/studenthome/:homeId/meal/:mealId/signoff',checkToken, getUsers)
app.get('/meal/:mealId/participants', controller.get_all_get)
app.get('/meal/:mealId/participants/:participantId', controller.get_participant_details_get)

module.exports = app;