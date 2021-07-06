const express = require('express')
const controller = require('../controllers/meal.controller')
const { checkToken } = require("../../auth/token_validation")


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Maaltijd aanmaken UC-301
app.post('/studenthome/:homeId/meal', controller.create_post)
// //Maaltijd wijziggen UC-302 
app.put('/studenthome/:homeId/meal/:mealId', controller.update_put)
// //Lijst van maaltijden opvragen
app.get('/studenthome/:homeId/meal', controller.get_all_get)
// //Details maaltijd opvragen
app.get('/studenthome/:homeId/meal/:mealId', controller.get_meal_details_get)
// //Maaltijd verwijderen
app.delete('/studenthome/:homeId/meal/:mealId', controller.delete)

module.exports = app;