const express = require('express')
const router = express.Router()
const logger = require('tracer').console()
const studenthome_controller = require('./controllers/studenthomeController.js');
const meal_controller = require('./controllers/mealController.js');
const meal_participants_controller = require('./controllers/mealParticipantsController.js');

// router.post('/', studenthome_controller.house_create_post);
// router.get('/', studenthome_controller.house_all_get);
// router.get('/:homeId', studenthome_controller.house_details_get);
// router.put('/:homeId', studenthome_controller.house_update_put);
// router.delete('/:homeId', studenthome_controller.house_delete_delete);
// router.put('/:homeId/user', studenthome_controller.house_add_user_put);


router.post('/meal/', meal_controller.create_post);
// router.put('/:homeId/meal/:mealId', meal_controller.update_put);
router.get('/meal', meal_controller.get_all_get);
router.get('/meal/:mealId', meal_controller.get_meal_details_get);
router.delete('/meal/:mealId', meal_controller.delete);

router.post('/:homeId/meal/:mealId/signup', meal_participants_controller.signup_post);
router.put('/:homeId/meal/:mealId/signoff', meal_participants_controller.signoff_put);

module.exports = router