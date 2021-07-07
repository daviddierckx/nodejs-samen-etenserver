const database = require("./database");


exports.add = function (data, callback) {
    database.con.query('INSERT INTO `meal` (`Name`, `Description`, `Price`, `Allergies`, `Ingredients`, `StudenthomeID`, `OfferedOn`, `UserID`,`MaxParticipants`,`CreatedOn`) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [data.name, data.description, data.price, data.allergies, data.ingredients, data.studenthouse_id, data.offered_since, data.user_id, data.MaxParticipants, data.CreatedOn], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
            exports.get(results.insertId, callback);
        });
}

exports.get = function (id, callback) {
    database.con.query('SELECT meal.*, user.Email AS user_email, CONCAT(user.First_Name, user.Last_Name) AS user_fullname FROM meal LEFT JOIN user ON meal.UserID = user.ID WHERE meal.id = ?', [id], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        if (results.length === 0) {
            return callback("meal-not-found", undefined);
        }
        callback(undefined, results[0]);
    });
}

exports.remove = function (id, callback) {
    id = parseInt(id);
    database.con.query('DELETE FROM `meal` WHERE id=?',
        [id], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
            callback(undefined, id);
        });
}

exports.update = function (id, data, callback) {
    database.con.query('UPDATE `meal` SET `Name`=?, `Description`=?, `Price`=?, `Allergies`=?, `Ingredients`=?, `OfferedOn`=?,`MaxParticipants`=?, `CreatedOn`=? WHERE id=?',
        [data.name, data.description, data.price, data.allergies, data.ingredients, data.offered_since, data.MaxParticipants, data.CreatedOn, id], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
            //Return updated house
            exports.get(id, callback);
        });
}

exports.checkIfUserIsAdmin = function (id, user_id, callback) {
    database.con.query('SELECT meal.*, user.Email AS user_email, CONCAT(user.First_Name, user.Last_Name) AS user_fullname FROM meal LEFT JOIN user ON meal.UserID = user.ID WHERE meal.ID = ? AND meal.UserID = ?', [id, user_id], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        if (results.length === 0) {
            return callback("meal-not-owned-by-user", undefined);
        }
        callback(undefined, results[0]);
    });
}

exports.getAll = function (callback) {
    database.con.query('SELECT meal.*, user.Email AS user_email, CONCAT(user.First_Name, user.Last_Name) AS user_fullname FROM meal LEFT JOIN user ON meal.UserID = user.ID', [], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        callback(undefined, results);
    });
}


exports.getAllMealsForHouse = function (houseId, callback) {
    database.con.query('SELECT meal.*, user.Email AS user_email, CONCAT(user.First_Name, user.Last_Name) AS user_fullname FROM meal LEFT JOIN user ON meal.UserID = user.ID WHERE meal.StudenthomeID = ?', [houseId], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        callback(undefined, results);
    });
}
