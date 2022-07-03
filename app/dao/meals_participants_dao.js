const database = require("./database");
const users = require("./users_dao")

exports.getAll = function (mealId, callback) {
    database.con.query('SELECT meal_participants_user.*, user.emailAdress AS user_email, CONCAT(user.firstName, user.lastName) AS user_fullname FROM meal_participants_user LEFT JOIN user ON meal_participants_user.userId = user.id WHERE mealId= ?', [mealId], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        callback(undefined, results);
    });
}

