const meals_participants_dao = require('./../../dao/meals_participants_dao');
const request_utils = require('./../../utils/requestUtils');
const logger = require('tracer').console()


exports.signup_post = function (req, res) {
    logger.log("Received request to signup for a meal");
    return res.status(500).send({"success": false, "error": "not implemented yet"});
};

exports.signoff_put = function (req, res) {
    logger.log("Received request to signoff a meal");
    return res.status(500).send({"success": false, "error": "not implemented yet"});
};

exports.get_participants_get = function (req, res) {
    logger.log("Received request to get participants of a meal");
    return res.status(500).send({"success": false, "error": "not implemented yet"});
};

exports.get_participant_details_get = function (req, res) {
    logger.log("Received request to get meal participant details");
    return res.status(500).send({"success": false, "error": "not implemented yet"});
};