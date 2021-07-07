const express = require('express')
const controller = require('../controllers/studenthome.controller')




const app = express()
//
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//Read ALL UC202 +
app.get('/studenthome', controller.house_all_get)

// //Read One UC203 +
app.get('/studenthome/:homeId', controller.house_details_get)
//Create one UC201 +
app.post('/studenthome', controller.house_create_post)
// //Update one UC204 +
app.put('/studenthome/:homeId', controller.house_update_put)
// //Delete one UC205 +
app.delete('/studenthome/:homeId', controller.house_delete_delete)
// //Add user UC206 -
app.put('/studenthome/:homeId/user', controller.house_add_user_put)

module.exports = app;