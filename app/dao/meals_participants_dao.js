const database = require("./database");
const users = require("./users_dao")

exports.getAll = function (mealId, callback) {
    database.con.query('SELECT meal_participants_user.*, user.emailAdress AS user_email, CONCAT(user.firstName, user.lastName) AS user_fullname FROM meal_participants_user LEFT JOIN user ON meal_participants_user.userId = user.id WHERE mealId= ?', [mealId], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        callback(undefined, results);
    });
}

exports.getAllMealsByUserId = function (userId, callback) {
    database.con.query('SELECT meal.* FROM meal JOIN meal_participants_user ON meal.id = meal_participants_user.mealId WHERE meal_participants_user.userId = ? AND meal.dateTime >= CURDATE()', [userId], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        callback(undefined, results);
    });
}

exports.checkMealExists = function (mealId, callback) {
    const query = 'SELECT COUNT(*) AS mealCount FROM `meal` WHERE `id` = ?';
    database.con.query(query, [mealId], function (error, results, fields) {
        if (error) {
            return callback(error.sqlMessage, undefined);
        }

        const mealCount = results[0].mealCount;
        const exists = mealCount > 0;

        callback(null, exists);
    });
};

exports.checkMaximumSignupsReached = function (mealId, callback) {
    const getSignupCountQuery = 'SELECT COUNT(*) AS signupCount FROM `meal_participants_user` WHERE `mealId` = ?';
    database.con.query(getSignupCountQuery, [mealId], function (error, results, fields) {
        if (error) {
            return callback(error.sqlMessage, undefined);
        }

        const signupCount = results[0].signupCount;
        const maxParticipantsQuery = 'SELECT `maxAmountOfParticipants` FROM `meal` WHERE `id` = ?';
        database.con.query(maxParticipantsQuery, [mealId], function (error, results, fields) {
            if (error) {
                return callback(error.sqlMessage, undefined);
            }

            const maxParticipants = results[0].maxAmountOfParticipants;
            const isMaximumReached = signupCount >= maxParticipants;

            callback(null, isMaximumReached);
        });
    });
};
exports.checkParticipantExists = function (mealId, userId, callback) {
    const checkParticipantQuery = 'SELECT COUNT(*) AS participantCount FROM `meal_participants_user` WHERE `mealId` = ? AND `userId` = ?';
    database.con.query(checkParticipantQuery, [mealId, userId], function (error, results, fields) {
        if (error) {
            console.error("An error occurred:", error);
            return callback(error.sqlMessage, undefined);
        }

        const participantCount = results[0].participantCount;
        const participantExists = participantCount > 0;

        callback(null, participantExists);
    });
};