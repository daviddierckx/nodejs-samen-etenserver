const meals_participants_dao = require('./../../dao/meals_participants_dao');
const request_utils = require('./../../utils/requestUtils');
const logger = require('tracer').console()
const users = require('./../../dao/users_dao');


exports.signup_post = function (req, res) {
    const mealId = req.params.mealId;
    const userId = req.user_id;

    meals_participants_dao.checkMaximumSignupsReached(mealId, function (error, isMaximumReached) {
        if (error) {
            logger.log("Error in checking maximum signups:", error);
            return res.status(500).send({ "success": false, "error": "Internal server error" });
        }

        if (isMaximumReached) {
            return res.status(403).send({ "success": false, "error": "Maximum signups reached for this meal" });
        }

        users.addUserToMeal(mealId, userId, function (err2, res2) {
            if (err2) {
                logger.log("Error in creating participant:", err2);
                return res.status(400).send({ "success": false, "error": err2 });
            }
            logger.log("Added to participant reated:", JSON.stringify(res2));
            return res.status(201).send({ "success": true, "message": "Participant  successfully added", "participant": res2 });
        });
    });
};

exports.signoff_put = function (req, res) {
    users.RemoveUserToMeal(req.params.mealId, req.user_id, (err2, res2) => {
        if (err2) {
            logger.log("Error in creating participant:", err2);
            return res.status(400).send({ "success": false, "message": "Error in deleting participant:", "error": err2 });
        }
        logger.log("Signed off participant:", JSON.stringify(res2));
        users.get(res2, (err, res3) => {
            if (err) {
                logger.log("Error in user removal:", err);
                return res.status(404).send({ "success": false, "error": err });
            }
            return res.status(201).send({ "success": true, "message": "Participant  successfully signed off", "mealId": req.params.mealId, "participant": res3 });
        })
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