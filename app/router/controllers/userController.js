const users_dao = require('./../../dao/users_dao');
const request_utils = require('./../../utils/requestUtils');
const logger = require('tracer').console()


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
        return res.status(201).send({ "success": true, "token": res2.token, "user_id": res2.user_id });
    })
};

exports.login = function (req, res) {
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
        return res.status(201).send({ "success": true, "token": res2.token, "user_id": res2.user_id });
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
        return res.status(200).send({ "success": true, "user": res2 });
    });
};

exports.get_single_user = function (req, res) {
    logger.log("Received request to get details about a user");


    users_dao.getUserById(req.params.id, (err, res2) => {
        if (err) {
            logger.log("Error in details:", err);
            return res.status(404).send({ "success": false, "error": err });
        }
        logger.log("Returning user details:", JSON.stringify(res2));
        return res.status(200).send({ "success": true, "user": res2 });
    });
};

exports.user_update_put = function (req, res) {


    users_dao.update(req.params.id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        isActive: req.body.isActive,
        emailAdress: req.body.emailAdress,
        phoneNumber: req.body.phoneNumber,
        roles: req.body.roles,
        street: req.body.street,
        city: req.body.city,
    }, (err, res2) => {
        if (err) {
            logger.log("Error in details:", err);
            return res.status(404).send({ "success": false, "error": err });
        }
        logger.log("Returning user details:", JSON.stringify(res2));
        return res.status(200).send({ "success": true, "user": res2 });
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

        users_dao.remove(req.params.id, (err, res2) => {
            if (err) {
                logger.log("Error in removing:", err);
                return res.status(400).send({ "success": false, "error": err });
            }
            logger.log("User removed");
            return res.status(202).send({ "success": true, "id": res2 });
        });
    });

};