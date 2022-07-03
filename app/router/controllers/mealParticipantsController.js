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
        logger.log("Added to participant reated:", JSON.stringify(res2));
        return res.status(201).send({ "success": true, "participant": res2 });
    });
};

exports.signoff_put = function (req, res) {
    users.RemoveUserToMeal(req.params.mealId, (err2, res2) => {
        if (err2) {
            logger.log("Error in creating participant:", err2);
            return res.status(400).send({ "success": false, "error": err2 });
        }
        logger.log("Signed off participant:", JSON.stringify(res2));
        return res.status(201).send({ "success": true, "participant": res2 });
    });;
};

exports.get_participants_get = function (req, res) {
    logger.log("Received request to get participants of a meal");


    meals_participants_dao.getAll(req.params.mealId, (err, res2) => {
        if (err) {
            logger.log("Error in details:", err);
            return res.status(404).send({ "success": false, "error": err });
        }
        logger.log("Returning all meal participants details:", JSON.stringify(res2));
        return res.status(200).send({ "success": true, "meal": res2 });
    });
};

exports.get_participant_details_get = function (req, res) {
    logger.log("Received request to get meal participant details");
    users.getDetailsParticipant(req.params.mealId, req.params.participantId, (err, res2) => {
        if (err) {
            logger.log("Error in details:", err);
            return res.status(404).send({ "success": false, "error": err });
        }
        logger.log("Returning meal participants details:", JSON.stringify(res2));
        return res.status(200).send({ "success": true, "meal": res2 });
    });
};