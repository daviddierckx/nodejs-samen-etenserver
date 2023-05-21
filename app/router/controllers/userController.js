const users_dao = require('./../../dao/users_dao');
const request_utils = require('./../../utils/requestUtils');
const logger = require('tracer').console()
const meals_participants_dao = require('./../../dao/meals_participants_dao');

const regexTests = require('./../../utils/regexTests');
const util = require('util');

exports.register = function (req, res) {

    logger.log("Received request to register user");

    if (req.body.emailAddress === undefined || req.body.password === undefined || req.body.firstname === undefined || req.body.lastname === undefined || req.body.isActive === undefined || req.body.phoneNumber === undefined || req.body.roles === undefined || req.body.street === undefined || req.body.city === undefined) {
        return res.status(400).send({ "status": 400, "success": false, "message": "Verplicht veld ontbreekt", "data": {} });
    }
    if (!regexTests.regexTestEmailAddress(req.body.emailAddress)) {
        return res.status(400).send({ "status": 400, "success": false, "message": "Niet-valide emailadres", "data": {} });
    }
    if (!regexTests.passwordRegex(req.body.password)) {
        return res.status(400).send({ "status": 400, "success": false, "message": "Niet-valide wachtwoord", "data": {} });
    }
    users_dao.getUserByEmail(req.body.emailAddress, (err3, res3) => {
        if (res3) {
            return res.status(404).send({ "status": 403, "success": false, "message": "Gebruiker bestaat al", "data": {} });
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
            return res.status(201).send({ "status": 201, "success": true, "message": "Gebruiker succesvol geregistreerd", "data": { "token": res2.token, "user_id": res2.user_id } });
        })
    })
};

exports.login = function (req, res, next) {
    logger.log("Received request to log user in");

    if (req.body.email_address === undefined || req.body.password === undefined) {
        return res.status(400).send({ "status": 400, "success": false, "message": "Verplicht veld ontbreekt", "data": {} });
    }

    if (!regexTests.passwordRegex(req.body.password)) {
        return res.status(400).send({ "status": 400, "success": false, "message": "Niet-valide wachtwoord", "data": {} });
    }

    users_dao.getUserByEmail(req.body.email_address, (err3, res3) => {
        if (err3) {
            return res.status(404).send({ "status": 404, "success": false, "message": "Gebruiker bestaat niet", "data": {} });
        }

        logger.log("User logged in with token", res3);

        users_dao.login(req.body.email_address, req.body.password, (err2, res2) => {
            if (err2) {
                logger.log("Error in login:", err2);
                return res.status(400).send({ "status": 400, "success": false, "message": err2, "data": {} });
            }

            logger.log("User logged in with token", res2);
            return res.status(200).send({ "status": 200, "success": true, "message": "Gebruiker succesvol ingelogd", "token": res2.token, "user_id": res2.user_id });
        });
    });
};


exports.get_personal_details = function (req, res) {
    logger.log("Received request to get details about a user");


    users_dao.getPersonalInfo(req.params.mealId, (err, res2) => {
        if (err) {
            logger.log("Error in details:", err);
            return res.status(404).send({ "success": false, "error": err });
        }
        logger.log("Returning user details:", JSON.stringify(res2));
        return res.status(200).send({ "status": 200, "success": true, "message": "Personal info successfully returned", "data": res2 });
    });
};

exports.get_single_user = function (req, res) {
    logger.log("Received request to get details about a user");


    users_dao.getUserById(req.params.id, (err, res2) => {
        if (err) {
            logger.log("Error in details:", err);
            return res.status(404).send({ "status": 404, "message": "Gebruiker-ID bestaat niet", "success": false, "data": {} });
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
            return res.status(200).send({ "status": 200, "success": true, "message": "User successfully Returned", "data": userDetails });
        })
    });
};

exports.users_all_get = function (req, res) {
    logger.log("Received request to get all users");
    users_dao.getAll(req.query.name, req.query.city, req.query.isActive, (err, res2) => {
        if (err) {
            logger.log("Error in listing:", err);
            return res.status(404).send({ "success": false, "error": err });
        }
        logger.log("Returning user list:", JSON.stringify(res2));
        return res.status(200).send({ "status": 200, "success": true, "message": "Users successfully returned", "data": res2 || [] });
    })
};



exports.user_update_put = function (req, res) {
    if (req.user_id === undefined) {
        return res.status(400).send({ "status": 400, "success": false, "message": "Niet ingelogd", "data": {} });
    }
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


    if (!regexTests.regexTestEmailAddress(req.body.emailAddress)) {
        return res.status(400).send({ "status": 400, "success": false, "message": `Verplicht veld "emailAddress" ontbreekt`, "data": {} });
    }
    if (!regexTests.passwordRegex(req.body.password)) {
        return res.status(400).send({ "status": 400, "success": false, "message": "Niet-valide wachtwoord", "data": {} });
    }


    // Validate phone number
    if (!regexTests.regexTestPhonenumber(phoneNumber)) {
        return res.status(400).send({ "status": 400, "success": false, "message": "Niet-valide telefoonnummer", "data": {} });
    }

    // Compare the user ID in the request params with the authenticated user's ID
    if (req.params.id.toString() !== req.user_id.toString()) {
        return res.status(403).send({ "status": 403, "success": false, "message": "De gebruiker is niet de eigenaar van de data", "data": {} });
    }

    users_dao.getUserByEmail(req.body.emailAddress, (err3, res3) => {
        if (err3) {
            return res.status(404).send({ "status": 404, "success": false, "message": "Gebruiker bestaat niet", "data": {} });
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
            return res.status(200).send({
                "status": 200, "success": true, "message": "Gebruiker succesvol gewijzigd", "data": res2
            });
        });
    })
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
            return res.status(404).send({ "status": 404, "success": false, "message": "Gebruiker bestaat niet", "data": {} });
        }

        // Compare the user ID in the request params with the authenticated user's ID
        if (req.params.id.toString() !== req.user_id.toString()) {
            return res.status(403).send({ "status": 403, "success": false, "message": "De gebruiker is niet de eigenaar van de data", "data": {} });
        }

        users_dao.remove(req.params.id, (err, res2) => {
            if (err) {
                logger.log("Error in removing:", err);
                return res.status(400).send({ "success": false, "error": err });
            }
            logger.log("User removed");
            return res.status(200).send({ "status": 200, "success": true, "message": `User met ID ${res2} is verwijderd` });
        });
    });

};