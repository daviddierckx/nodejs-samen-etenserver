const meals_participants_dao = require('./../../dao/meals_participants_dao');
const request_utils = require('./../../utils/requestUtils');
const logger = require('tracer').console()
const users = require('./../../dao/users_dao');


exports.signup_post = function (req, res) {
    users.addUserToMeal(req.params.mealId, (err2, res2) => {
        if (err2) {
            logger.log("Error in creating participant:", err2);
            return res.status(400).send({ "success": false, "error": err2 });
        }
        logger.log("Added to Meal created:", JSON.stringify(res2));
        return res.status(201).send({ "success": true, "participant": res2 });
    });
};

exports.signoff_put = function (req, res) {
    logger.log("Received request to signoff a meal");
    return res.status(500).send({ "success": false, "error": "not implemented yet" });
};

exports.get_participants_get = function (req, res) {
    logger.log("Received request to get participants of a meal");
    return res.status(500).send({ "success": false, "error": "not implemented yet" });
};

exports.get_participant_details_get = function (req, res) {
    logger.log("Received request to get meal participant details");
    return res.status(500).send({ "success": false, "error": "not implemented yet" });
};