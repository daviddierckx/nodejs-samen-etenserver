const meals_dao = require('./../../dao/meals_dao');
const studenthouse_dao = require('./../../dao/studenthouse_dao');
const users_dao = require('./../../dao/users_dao');
const request_utils = require('./../../utils/requestUtils');
const logger = require('tracer').console()


exports.house_create_post = function (req, res) {
    logger.log("Received request to create a studenthome");
    let check = request_utils.verifyBody(req, res, 'name', 'string');
    check = check && request_utils.verifyBody(req, res, 'street', 'string');
    check = check && request_utils.verifyBody(req, res, 'housenumber', 'int');
    check = check && request_utils.verifyBody(req, res, 'postalcode', 'postalcode');
    check = check && request_utils.verifyBody(req, res, 'city', 'string');
    check = check && request_utils.verifyBody(req, res, 'phonenumber', 'phonenumber');
    if (!check) {
        logger.log("Request cancelled because of an invalid param");
        return;
    }

    studenthouse_dao.add({
        name: req.body.name,
        street: req.body.street,
        housenumber: req.body.housenumber,
        postalcode: req.body.postalcode,
        city: req.body.city,
        phonenumber: req.body.phonenumber,
        user_id: req.user_id
    }, (err2, res2) => {
        if (err2) {
            logger.log("Error in creation:", err2);
            return res.status(400).send({ "success": false, "error": err2 });
        }
        logger.log("Studenthouse created with data", res2);
        return res.status(201).send({ "success": true, "house": res2, });
        // "Student ID": res2.userId 
    })
};

exports.house_all_get = function (req, res) {
    logger.log("Received request to get all studenthouses");
    studenthouse_dao.getAll(req.query.name, req.query.city, (err, res2) => {
        if (err) {
            logger.log("Error in listing:", err);
            return res.status(404).send({ "success": false, "error": err });
        }
        logger.log("Returning houses list:", JSON.stringify(res2));
        return res.status(200).send({ "success": true, "houses": res2 });
    })
};

exports.house_details_get = function (req, res) {
    logger.log("Received request for house details");
    let check = request_utils.verifyParam(req, res, 'homeId', 'string');
    if (!check) {
        logger.log("Request cancelled because of an invalid param");
        return;
    }

    studenthouse_dao.get(req.params.homeId, (err, res2) => {
        if (err) {
            logger.log("Error in house details:", err);
            return res.status(404).send({ "success": false, "error": err });
        }
        meals_dao.getAllMealsForHouse(req.params.homeId, (err3, res3) => {
            if (err3) {
                logger.log("Error in meal details:", err3);
                return res.status(404).send({ "success": false, "error": err });
            }
            logger.log("Returning house details:", JSON.stringify(res2));
            return res.status(200).send({ "success": true, "house": res2, "meals": res3 });
        });
    });
};

exports.house_update_put = function (req, res) {
    logger.log("Received request to update a student house");
    let check = request_utils.verifyBody(req, res, 'name', 'string');
    check = check && request_utils.verifyBody(req, res, 'street', 'string');
    check = check && request_utils.verifyBody(req, res, 'housenumber', 'int');
    check = check && request_utils.verifyBody(req, res, 'postalcode', 'postalcode');
    check = check && request_utils.verifyBody(req, res, 'city', 'string');
    check = check && request_utils.verifyBody(req, res, 'phonenumber', 'phonenumber');
    check = check && request_utils.verifyParam(req, res, 'homeId', 'string');
    if (!check) {
        logger.log("Request cancelled because of an invalid param");
        return;
    }

    logger.log("Studenthouse update with id", req.params.homeId);
    studenthouse_dao.checkIfUserIsAdmin(req.params.homeId, req.user_id, (err, user_verified) => {
        if (err) {
            logger.log("Error in update:", err);
            return res.status(401).send({ "success": false, "error": err });
        }
        studenthouse_dao.update(req.params.homeId, {
            id: req.params.homeId,
            name: req.body.name,
            street: req.body.street,
            housenumber: req.body.housenumber,
            postalcode: req.body.postalcode,
            city: req.body.city,
            phonenumber: req.body.phonenumber,
        }, (err, res2) => {
            if (err) {
                logger.log("Error in update:", err);
                return res.status(400).send({ "success": false, "error": err });
            }
            logger.log("Update house successfully");
            return res.status(202).send({ "success": true, "house": res2 });
        });
    });
};

exports.house_delete_delete = function (req, res) {
    logger.log("Received request to delete a user house");
    let check = request_utils.verifyParam(req, res, 'homeId', 'string');
    if (!check) {
        logger.log("Request cancelled because of an invalid param");
        return;
    }

    studenthouse_dao.get(req.params.homeId, (err, res2) => {
        if (err) {
            logger.log("Error in house removal:", err);
            return res.status(404).send({ "success": false, "error": err });
        }
        studenthouse_dao.checkIfUserIsAdmin(req.params.homeId, req.user_id, (err, user_verified) => {
            if (err) {
                logger.log("Error in update:", err);
                return res.status(401).send({ "success": false, "error": err });
            }
            studenthouse_dao.remove(req.params.homeId, (err, res2) => {
                if (err) {
                    logger.log("Error in removing:", err);
                    return res.status(400).send({ "success": false, "error": err });
                }
                logger.log("House removed");
                return res.status(202).send({ "success": true, "id": res2 });
            });
        });
    });
};

exports.house_add_user_put = function (req, res) {
    logger.log("Received request to add a user to the student house");
    let check = request_utils.verifyBody(req, res, 'userId', 'string');
    if (!check) {
        logger.log("Request cancelled because of an invalid param");
        return;
    }

    logger.log("Studenthouse adding user with id", req.params.homeId);
    studenthouse_dao.get(req.params.homeId, (err, res2) => {
        if (err) {
            logger.log("Error in adding user1:", err);
            return res.status(404).send({ "success": false, "error": err });
        }
        users_dao.get(req.body.userId, (err, user_verified) => {
            if (err) {
                logger.log("Error in adding user2:", err);
                return res.status(404).send({ "success": false, "error": err });
            }
            studenthouse_dao.addUserToHouse(req.params.homeId, req.body.userId, (err4, user_verified) => {
                if (err4) {
                    logger.log("Error in adding user3:", err4);
                    return res.status(401).send({ "success": false, "error": err4 });
                }
                logger.log("Update house successfully");
                return res.status(202).send({ "success": true, "house": res2 });
            });
        });
    });
};

