const express = require('express')
const controller = require('../controllers/meal.controller')


const app  = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Maaltijd aanmaken UC-301
app.post('/studenthome/:homeId/meal',controller.createMeal)
// //Maaltijd wijziggen UC-302 
app.put('/studenthome/:homeId/meal/:mealId',controller.updateMeal)
// //Lijst van maaltijden opvragen
app.get('/studenthome/:homeId/meal',controller.mealList)
// //Details maaltijd opvragen
app.get('/studenthome/:homeId/meal/:mealId',controller.mealDetails)
// //Maaltijd verwijderen
app.delete('/studenthome/:homeId/meal/:mealId',controller.mealDelete)

module.exports = app;