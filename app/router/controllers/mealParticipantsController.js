const meals_participants_dao = require('./../../dao/meals_participants_dao');
const meals_dao = require('./../../dao/meals_dao');
const request_utils = require('./../../utils/requestUtils');
const logger = require('tracer').console()
const users = require('./../../dao/users_dao');


exports.signup_post = function (req, res) {
    const mealId = req.params.mealId;
    const userId = req.user_id;
    meals_participants_dao.checkMealExists(mealId, (error, exists) => {
        if (error) {
            console.error("An error occurred:", error);
            return;
        }

        if (exists) {
            console.log("Meal exists!");
        } else {
            return res.status(404).send({ "status": 404, "message": "Maaltijd bestaat niet", "data": {}, "success": false, "error": error });
        }
    });
    meals_participants_dao.checkMaximumSignupsReached(mealId, function (error, isMaximumReached) {
        if (error) {
            logger.log("Error in checking maximum signups:", error);
            return res.status(500).send({ "success": false, "error": "Internal server error" });
        }

        if (isMaximumReached) {
            return res.status(200).send({ "status": 200, "success": false, "error": "Maximum signups reached for this meal" });
        }

        users.addUserToMeal(mealId, userId, function (err2, res2) {
            if (err2) {
                logger.log("Error in creating participant:", err2);
                return res.status(400).send({ "success": false, "error": err2 });
            }
            logger.log("Added to participant reated:", JSON.stringify(res2));
            return res.status(200).send({ "status": 200, "success": true, "message": `User met ID ${userId} is aangemeld voor maaltijd met ID ${mealId}`, "participant": res2.firstName + " " + res2.lastName });
        });
    });
};

exports.signoff_put = function (req, res) {
    meals_participants_dao.checkMealExists(req.params.mealId, (error, exists) => {
        if (error) {
            console.error("An error occurred:", error);
            return res.status(500).send({ "success": false, "error": error });
        }

        if (exists) {
            console.log("Meal exists!");

            meals_participants_dao.checkParticipantExists(req.params.mealId, req.user_id, (participantError, participantExists) => {
                if (participantError) {
                    console.error("An error occurred while checking participant:", participantError);
                    return res.status(404).send({ "success": false, "error": participantError });
                }

                if (participantExists) {
                    users.RemoveUserToMeal(req.params.mealId, req.user_id, (err2, res2) => {
                        if (err2) {
                            logger.log("Error in deleting participant:", err2);
                            return res.status(400).send({ "success": false, "message": "Error in deleting participant:", "error": err2 });
                        }
                        logger.log("Signed off participant:", JSON.stringify(res2));
                        users.get(res2, (err, res3) => {
                            if (err) {
                                logger.log("Error in user removal:", err);
                                return res.status(404).send({ "success": false, "error": err });
                            }
                            return res.status(200).send({ "status": 200, "success": true, "message": `User met ID ${req.user_id} is afgemeld voor maaltijd met ID ${req.params.mealId}`, "participant": res3.firstName + " " + res3.lastName });
                        });
                    });
                } else {
                    return res.status(404).send({ "status": 404, "message": "Deelnemer bestaat niet voor deze maaltijd", "data": {}, "success": false });
                }
            });
        } else {
            return res.status(404).send({ "status": 404, "message": "Maaltijd bestaat niet", "data": {}, "success": false, "error": error });
        }
    });
};


exports.get_participants_get = function (req, res) {
    logger.log("Received request to get participants of a meal");

    meals_participants_dao.getAll(req.params.mealId, (err, res2) => {

        meals_dao.get(req.params.mealId, (err, res3) => {

            if (err) {
                logger.log("Error in details:", err);
                return res.status(404).send({ "success": false, "error": err });
            }




            if (res3.cookId.toString() !== req.user_id.toString()) {
                return res.status(403).send({ "success": false, "error": "You are only authorized to view your own meal data, not that of others" });
            }



            logger.log("Returning all meal participants details:", JSON.stringify(res2));
            return res.status(200).send({ "success": true, "message": "Returning all meal participants details", "cookId": res3.cookId, "participants": res2 });
        })
    });
};

exports.get_participant_details_get = function (req, res) {
    logger.log("Received request to get meal participant details");
    users.getDetailsParticipant(req.params.mealId, req.params.participantId, (err, res2) => {


        meals_dao.get(req.params.mealId, (err, res3) => {

            if (err) {
                logger.log("Error in details:", err);
                return res.status(404).send({ "success": false, "error": err });
            }




            if (res3.cookId.toString() !== req.user_id.toString()) {
                return res.status(403).send({ "success": false, "error": "You are only authorized to view your own meal data, not that of others" });
            }



            logger.log("Returning meal participants details:", JSON.stringify(res2));
            return res.status(200).send({ "success": true, "message": "Returning meal participant details", "cookId": res3.cookId, "participant": res2 });
        })
    });
};