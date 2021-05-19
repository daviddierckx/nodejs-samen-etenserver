const express = require('express')
const controller = require('../controllers/studenthome.controller')
const { checkToken } = require("../../auth/token_validation")




const app  = express()
//
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//Read ALL UC202 +
app.get('/studenthome',checkToken,controller.getAll)

// //Read One UC203 +
app.get('/studenthome/:homeId',checkToken, controller.getOne)
//Create one UC201 +
app.post('/studenthome',checkToken,controller.createOne)
// //Update one UC204 +
app.put('/studenthome/:homeId',checkToken,controller.updateOne)
// //Delete one UC205 +
app.delete('/studenthome/:homeId',checkToken,controller.delete)
// //Add user UC206 +
app.post('/studenthome/:homeId/user',checkToken,controller.addUser)

module.exports = app;