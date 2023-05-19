const meals_dao = require('./../../dao/meals_dao');
const studenthouse_dao = require('./../../dao/studenthouse_dao');
const request_utils = require('./../../utils/requestUtils');
const logger = require('tracer').console()


exports.create_post = function (req, res) {
    logger.log("Received request to create meal");
    let check = request_utils.verifyBody(req, res, 'name', 'string');
    check = check && request_utils.verifyBody(req, res, 'description', 'string');
    check = check && request_utils.verifyBody(req, res, 'price', 'float');
    check = check && request_utils.verifyBody(req, res, 'allergenes', 'string');

    if (!check) {
        logger.log("Request cancelled because of an invalid param");
        return;
    }


    meals_dao.add({
        isActive: req.body.isActive,
        isVega: req.body.isVega,
        isVegan: req.body.isVegan,
        isToTakeHome: req.body.isToTakeHome,
        dateTime: new Date(req.body.dateTime),
        maxAmountOfParticipants: req.body.maxAmountOfParticipants,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        cookId: req.user_id,
        createDate: new Date(),
        updateDate: new Date(req.body.updateDate),
        name: req.body.name,
        description: req.body.description,
        allergenes: req.body.allergenes
    }, (err2, res2) => {
        if (err2) {
            logger.log("Error in creating meal:", err2);
            return res.status(400).send({ "success": false, "error": err2 });
        }
        logger.log("Meal created:", JSON.stringify(res2));
        return res.status(201).send({ "success": true, "message": "Meal successfully Created", "meal": res2 });
    });

};

exports.update_put = function (req, res) {
    logger.log("Received request to update meal");
    let check = request_utils.verifyBody(req, res, 'name', 'string');
    check = check && request_utils.verifyBody(req, res, 'description', 'string');
    check = check && request_utils.verifyBody(req, res, 'price', 'float');
    check = check && request_utils.verifyBody(req, res, 'allergenes', 'string');
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

        // Compare the cook ID in the request with the authenticated user's ID
        if (res2.cookId.toString() !== req.user_id.toString()) {
            return res.status(403).send({ "success": false, "error": "You are only authorized to update your own meal data, not that of others" });
        }

        meals_dao.update(req.params.mealId, {
            isActive: req.body.isActive,
            isVega: req.body.isVega,
            isVegan: req.body.isVegan,
            isToTakeHome: req.body.isToTakeHome,
            dateTime: new Date(req.body.dateTime),
            maxAmountOfParticipants: req.body.maxAmountOfParticipants,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            cookId: req.body.cookId,
            createDate: new Date(req.body.createDate),
            updateDate: new Date(req.body.updateDate),
            name: req.body.name,
            description: req.body.description,
            allergenes: req.body.allergenes,
        }, (err, res2) => {
            if (err) {
                logger.log("Error in update:", err);
                return res.status(400).send({ "success": false, "error": err });
            }



            logger.log("Updated meal successfully with data", JSON.stringify(res2));
            return res.status(202).send({ "success": true, "message": "Meal successfully Updated", "meal": res2 });
        });
    });

};

exports.delete = function (req, res) {
    logger.log("Received request to delete meal");
    let check = request_utils.verifyParam(req, res, 'mealId', 'string');
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

        // Compare the cook ID in the request with the authenticated user's ID
        if (res2.cookId.toString() !== req.user_id.toString()) {
            return res.status(403).send({ "success": false, "error": "You are only authorized to delete your own meal data, not that of others" });
        }

        meals_dao.remove(req.params.mealId, (err, res2) => {
            if (err) {
                logger.log("Error in removal:", err);
                return res.status(400).send({ "success": false, "error": err });
            }
            logger.log("Removed meal successfully");
            return res.status(202).send({ "success": true, "message": "Meal successfully deleted. Deletion confirmed.", "id": res2 });
        });
    });

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
        return res.status(200).send({ "success": true, "message": "Meal details successfully returned", "meal": res2 });
    });
};