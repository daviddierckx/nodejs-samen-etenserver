const meals_dao = require('../dao/meal.dao');
const studenthouse_dao = require('../dao/studenthome.dao');
const users_dao = require('../dao/user.dao');
const request_utils = require('../utils/verifyUtils');
const logger = require('tracer').console()


exports.create_post = function (req, res) {
    logger.log("Received request to create meal");
    let check = request_utils.verifyBody(req, res, 'name', 'string');
    check = check && request_utils.verifyBody(req, res, 'description', 'string');
    check = check && request_utils.verifyBody(req, res, 'price', 'float');
    check = check && request_utils.verifyBody(req, res, 'allergies', 'string');
    check = check && request_utils.verifyBody(req, res, 'ingredients', 'string');
    if (!check) {
        logger.log("Request cancelled because of an invalid param");
        return;
    }

    studenthouse_dao.checkIfUserIsAdmin(req.params.homeId, req.body.user_id, (err, user_verified) => {
        if (err) {
            logger.log("Error in update:", err);
            return res.status(401).send({ "success": false, "error": err });
        }
        meals_dao.add({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            allergies: req.body.allergies,
            ingredients: req.body.ingredients,
            studenthouse_id: req.params.homeId,
            offered_since: new Date(req.body.offered_since),
            user_id: req.body.user_id,
            MaxParticipants: req.body.MaxParticipants,
            CreatedOn: new Date(req.body.CreatedOn)
        }, (err2, res2) => {
            if (err2) {
                logger.log("Error in creating meal:", err2);
                return res.status(400).send({ "success": false, "error": err2 });
            }
            logger.log("Meal created:", JSON.stringify(res2));
            return res.status(201).send({ "success": true, "meal": res2 });
        });
    });
};

exports.update_put = function (req, res) {
    logger.log("Received request to update meal");
    let check = request_utils.verifyBody(req, res, 'name', 'string');
    check = check && request_utils.verifyBody(req, res, 'description', 'string');
    check = check && request_utils.verifyBody(req, res, 'price', 'float');
    check = check && request_utils.verifyBody(req, res, 'allergies', 'string');
    check = check && request_utils.verifyBody(req, res, 'ingredients', 'string');
    if (!check) {
        logger.log("Request cancelled because of an invalid param");
        return;
    }

    logger.log("meal update with id", req.params.mealId);
    meals_dao.get(req.params.mealId, (err, res2) => {
        if (err) {
            logger.log("Error in update:", err);
            return res.status(404).send({ "success": false, "error": err });
        }

        meals_dao.update(req.params.mealId, {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            allergies: req.body.allergies,
            ingredients: req.body.ingredients,
            offered_since: new Date(req.body.offered_since),
            MaxParticipants: req.body.MaxParticipants,
            CreatedOn: new Date(req.body.CreatedOn)
        }, (err, res2) => {
            if (err) {
                logger.log("Error in update:", err);
                return res.status(400).send({ "success": false, "error": err });
            }
            logger.log("Updated meal successfully with data", JSON.stringify(res2));
            return res.status(202).send({ "success": true, "meal": res2 });
        });
    });
};

exports.delete = function (req, res) {
    logger.log("Received request to delete meal");
    let check = request_utils.verifyParam(req, res, 'homeId', 'string');
    if (!check) {
        logger.log("Request cancelled because of an invalid param");
        return;
    }
    logger.log("meal removing with id", req.params.mealId);
    meals_dao.get(req.params.mealId, (err, res2) => {
        if (err) {
            logger.log("Error in update:", err);
            return res.status(404).send({ "success": false, "error": err });
        }
        //meals_dao.checkIfUserIsAdmin(req.params.mealId, req.user_id, (err, user_verified) => {
        // if (err) {
        //   logger.log("Error in removal:", err);
        // return res.status(401).send({ "success": false, "error": err });
        // }
        meals_dao.remove(req.params.mealId, (err, res2) => {
            if (err) {
                logger.log("Error in removal:", err);
                return res.status(400).send({ "success": false, "error": err });
            }
            logger.log("Removed meal successfully");
            return res.status(202).send({ "success": true, "id": res2 });
        });
    });
    // });
};

exports.get_all_get = function (req, res) {
    logger.log("Received request to get all meals");
    meals_dao.getAll((err, res2) => {
        if (err) {
            logger.log("Error in listing:", err);
            return res.status(400).send({ "success": false, "error": err });
        }
        logger.log("Returning meals list:", JSON.stringify(res2));
        return res.status(200).send({ "success": true, "meals": res2 });
    })
};

exports.get_meal_details_get = function (req, res) {
    logger.log("Received request to get details about a meal");
    let check = request_utils.verifyParam(req, res, 'mealId', 'string');
    if (!check) {
        logger.log("Request cancelled because of an invalid param");
        return;
    }

    meals_dao.get(req.params.mealId, (err, res2) => {
        if (err) {
            logger.log("Error in details:", err);
            return res.status(404).send({ "success": false, "error": err });
        }
        logger.log("Returning meal details:", JSON.stringify(res2));
        return res.status(200).send({ "success": true, "meal": res2 });
    });
};