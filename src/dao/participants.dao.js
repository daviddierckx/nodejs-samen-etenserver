const database = require("./database");

exports.getAll = function (callback) {
    database.con.query('SELECT participants.*, user.Email AS user_email, CONCAT(user.First_Name," ", user.Last_Name) AS user_fullname FROM participants LEFT JOIN user ON participants.UserID = user.ID', [], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        callback(undefined, results);
    });
}

exports.get = function (id, callback) {
    database.con.query('SELECT participants.*, user.Email AS user_email, CONCAT(user.First_Name," ",user.Last_Name) AS user_fullname FROM participants LEFT JOIN user ON participants.UserID = user.ID WHERE UserID = ?', [id], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        if (results.length === 0) {
            return callback("meal-not-found", undefined);
        }
        callback(undefined, results[0]);
    });
}

exports.removeSignOff = function (id, callback) {
    id = parseInt(id);
    database.con.query('DELETE FROM `meal` WHERE id=?',
        [id], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
            callback(undefined, id);
        });
}

