const meals_dao = require('../dao/meal.dao');
const participant_dao = require('../dao/participants.dao');

const studenthouse_dao = require('../dao/studenthome.dao');
const users_dao = require('../dao/user.dao');
const request_utils = require('../utils/verifyUtils');
const logger = require('tracer').console()

// module.exports = {
//     getParticipantByID: (req, res, next) => {
//         console.log("participants.controller.getParticipantsByID called");
//         mysqlConnection.query("SELECT * FROM participants WHERE UserID = " + req.params.participantId, (err, rows, fields) => {
//             if (!err && rows.length > 0) {
//                 res.status(200).json({
//                     status: 'succes',
//                     result: rows
//                 })
//             }
//             else {
//                 res.status(404).send("The participant with the provided ID does not exist")
//             }
//         })
//     },
//     getAllParticipants: (req, res, next) => {
//         mysqlConnection.query("SELECT * FROM participants", (err, rows, fields) => {
//             if (!err) {
//                 res.status(200).json({
//                     status: 'succes',
//                     result: rows
//                 })
//             }
//             else {
//                 console.log(err)
//                 next(err)
//             }
//         })
//     }

// }

exports.get_all_get = function (req, res) {
    logger.log("Received request to get all participant");
    participant_dao.getAll((err, res2) => {
        if (err) {
            logger.log("Error in listing:", err);
            return res.status(400).send({ "success": false, "error": err });
        }
        logger.log("Returning participant list:", JSON.stringify(res2));
        return res.status(200).send({ "success": true, "meals": res2 });
    })
};

exports.get_participant_details_get = function (req, res) {
    logger.log("Received request to get details about a participant");
    let check = request_utils.verifyParam(req, res, 'mealId', 'string');
    if (!check) {
        logger.log("Request cancelled because of an invalid param");
        return;
    }

    participant_dao.get(req.params.mealId, (err, res2) => {
        if (err) {
            logger.log("Error in details:", err);
            return res.status(404).send({ "success": false, "error": err });
        }
        logger.log("Returning participant details:", JSON.stringify(res2));
        return res.status(200).send({ "success": true, "meal": res2 });
    });
};