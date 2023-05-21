const express = require('express')
const router = express.Router()
const config = require('../config');

const logger = require('tracer').console()
const jwt = require('jsonwebtoken');
const meal_controller = require('./controllers/mealController.js');
const meal_participants_controller = require('./controllers/mealParticipantsController.js');




router.post('/meal/', meal_controller.create_post);
router.put('/meal/:mealId', meal_controller.update_put);
router.get('/meal', meal_controller.get_all_get);
router.get('/meal/:mealId', meal_controller.get_meal_details_get);
router.delete('/meal/:mealId', meal_controller.delete);

router.post('/meal/:mealId/participate', meal_participants_controller.signup_post);
router.delete('/meal/:mealId/participate', meal_participants_controller.signoff_put);
router.get('/meal/:mealId/participants', meal_participants_controller.get_participants_get);
router.get('/meal/:mealId/participants/:participantId', meal_participants_controller.get_participant_details_get);

module.exports = router