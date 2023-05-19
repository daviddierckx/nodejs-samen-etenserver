const users_dao = require('./../../dao/users_dao');
const request_utils = require('./../../utils/requestUtils');
const logger = require('tracer').console()
const meals_participants_dao = require('./../../dao/meals_participants_dao');

const regexTests = require('./../../utils/regexTests');
const util = require('util');

exports.register = function (req, res) {

    logger.log("Received request to register user");
    let check = request_utils.verifyBody(req, res, 'firstname', 'string');
    check = check && request_utils.verifyBody(req, res, 'lastname', 'string');
    check = check && request_utils.verifyBody(req, res, 'emailAddress', 'email');
    check = check && request_utils.verifyBody(req, res, 'password', 'password');
    if (!check) {
        logger.log("Request cancelled because of an invalid param");
        return;
    }

    users_dao.add({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        isActive: req.body.isActive,
        emailAddress: req.body.emailAddress,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        roles: req.body.roles,
        street: req.body.street,
        city: req.body.city
    }, (err2, res2) => {
        if (err2) {
            logger.log("Error in register:", err2);
            return res.status(400).send({ "success": false, "error": err2 });
        }
        logger.log("User created with token", res2);
        return res.status(201).send({ "success": true, "message": "User successfully registerd", "token": res2.token, "user_id": res2.user_id });
    })

};

exports.login = function (req, res, next) {

    logger.log("Received request to log user in");
    let check = request_utils.verifyBody(req, res, 'email_address', 'email');
    check = check && request_utils.verifyBody(req, res, 'password', 'password');
    if (!check) {
        logger.log("Request cancelled because of an invalid param");
        return;
    }
    users_dao.login(req.body.email_address, req.body.password, (err2, res2) => {
        if (err2) {
            logger.log("Error in login:", err2);
            return res.status(400).send({ "success": false, "error": err2 });
        }


        logger.log("User logged in with token", res2);
        return res.status(201).send({ "success": true, "message": "User successfully logged in", "token": res2.token, "user_id": res2.user_id });
    })

};

exports.get_personal_details = function (req, res) {
    logger.log("Received request to get details about a user");


    users_dao.getPersonalInfo(req.params.mealId, (err, res2) => {
        if (err) {
            logger.log("Error in details:", err);
            return res.status(404).send({ "success": false, "error": err });
        }
        logger.log("Returning user details:", JSON.stringify(res2));
        return res.status(200).send({ "success": true, "message": "Personal info successfully returned", "user": res2 });
    });
};

exports.get_single_user = function (req, res) {
    logger.log("Received request to get details about a user");


    users_dao.getUserById(req.params.id, (err, res2) => {
        if (err) {
            logger.log("Error in details:", err);
            return res.status(404).send({ "success": false, "error": err });
        }

        meals_participants_dao.getAllMealsByUserId(req.params.id, (err, res3) => {
            if (err) {
                logger.log("Error in retrieving user meals:", err);
                return res.status(500).send({ "success": false, "error": "Failed to retrieve user meals" });
            }
            //Het systeem stuurt een antwoordbericht terug, met daarin de details van de gebruiker en bijbehorende maaltijden
            const userDetails = {
                user: res2,
                meals: res3
            };

            logger.log("Returning user details:", JSON.stringify(userDetails));
            return res.status(200).send({ "success": true, "message": "User successfully Returned", "userDetails": userDetails });
        })
    });
};

exports.users_all_get = function (req, res) {
    logger.log("Received request to get all users");
    users_dao.getAll(req.query.name, req.query.city, (err, res2) => {
        if (err) {
            logger.log("Error in listing:", err);
            return res.status(404).send({ "success": false, "error": err });
        }
        logger.log("Returning user list:", JSON.stringify(res2));
        return res.status(200).send({ "success": true, "message": "Users successfully returned", "Users": res2 });
    })
};



exports.user_update_put = function (req, res) {
    const {
        firstName,
        lastName,
        isActive,
        emailAdress,
        phoneNumber,
        roles,
        street,
        city
    } = req.body;

    // Validate email address
    if (!regexTests.regexTestEmailAddress(emailAdress)) {
        return res.status(400).send({ "success": false, "error": "Invalid email address" });
    }



    // Validate phone number
    if (!regexTests.regexTestPhonenumber(phoneNumber)) {
        return res.status(400).send({ "success": false, "error": "Invalid phone number" });
    }

    // Compare the user ID in the request params with the authenticated user's ID
    if (req.params.id.toString() !== req.user_id.toString()) {
        return res.status(403).send({ "success": false, "error": "You are only authorized to update your own user data, not that of others" });
    }

    users_dao.update(req.params.id, {
        firstName,
        lastName,
        isActive,
        emailAdress,
        phoneNumber,
        roles,
        street,
        city
    }, (err, res2) => {
        if (err) {
            logger.log("Error in details:", err);
            return res.status(404).send({ "success": false, "error": err });
        }
        logger.log("Returning user details:", JSON.stringify(res2));
        return res.status(200).send({ "success": true, "message": "User successfully Updated", "user": res2 });
    });

};


exports.user_delete = function (req, res) {
    logger.log("Received request to delete a user ");
    let check = request_utils.verifyParam(req, res, 'id', 'string');
    if (!check) {
        logger.log("Request cancelled because of an invalid param");
        return;
    }
    console.log("param id ", req.params.id);

    users_dao.get(req.params.id, (err, res2) => {
        if (err) {
            logger.log("Error in user removal:", err);
            return res.status(404).send({ "success": false, "error": err });
        }

        // Compare the user ID in the request params with the authenticated user's ID
        if (req.params.id.toString() !== req.user_id.toString()) {
            return res.status(403).send({ "success": false, "error": "You are only authorized to delete your own user data, not that of others" });
        }

        users_dao.remove(req.params.id, (err, res2) => {
            if (err) {
                logger.log("Error in removing:", err);
                return res.status(400).send({ "success": false, "error": err });
            }
            logger.log("User removed");
            return res.status(202).send({ "success": true, "message": `User met ID ${res2} is verwijderd` });
        });
    });

};