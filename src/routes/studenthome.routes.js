const express = require('express')
const controller = require('../controllers/studenthome.controller')




const app  = express()
//
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//Read ALL UC202 +
app.get('/studenthome',controller.getAll)

// //Read One UC203 +
app.get('/studenthome/:homeId', controller.getOne)
//Create one UC201 +
app.post('/studenthome',controller.createOne)
// //Update one UC204 +
app.put('/studenthome/:homeId',controller.updateOne)
// //Delete one UC205 +
app.delete('/studenthome/:homeId',controller.delete)
// //Add user UC206 +
app.post('/studenthome/:homeId/user',controller.addUser)

module.exports = app;