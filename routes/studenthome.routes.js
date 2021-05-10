const e = require('express')
const express = require('express')
const controller = require('../controllers/studenthome.controller')


const app  = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
//Read ALL +
app.get('/',controller.getAll)

//Read One UC203 +
app.get('/studenthome/:homeId',controller.getOne)
//Create one UC201 +
app.post('/studenthome',controller.createOne)
//Update one UC204 +
app.put('/studenthome/:homeId',controller.updateOne)
//Delete one
app.delete('/studenthome/:homeId',controller.delete)
//Add user
app.put('/studenthome/:homeId/user',controller.addUser)

module.exports = app;