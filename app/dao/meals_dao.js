const database = require("./database");


exports.add = function (data, callback) {
    database.con.query('INSERT INTO `meal` (`isActive`, `isVega`, `isVegan`, `isToTakeHome`, `dateTime`, `maxAmountOfParticipants`, `price`, `imageUrl`, `cookId `, `createDate`, `updateDate`, `name`, `description`, `allergenes`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [data.name, data.description, data.price, data.allergies, data.ingredients, data.studenthouse_id, data.offered_since, data.user_id], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
            exports.get(results.insertId, callback);
        });
}

exports.get = function (id, callback) {
    database.con.query('SELECT meals.*, user.email_address AS user_email, CONCAT(user.firstname, \' \', user.lastname) AS user_fullname FROM meals LEFT JOIN user ON meals.user_id = user.id WHERE meals.id = ?', [id], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        if (results.length === 0) {
            return callback("meal-not-found", undefined);
        }
        callback(undefined, results[0]);
    });
}

exports.remove = function (id, callback) {
    id = parseInt(id);
    database.con.query('DELETE FROM `meals` WHERE id=?',
        [id], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
            callback(undefined, id);
        });
}

exports.update = function (id, data, callback) {
    database.con.query('UPDATE `meals` SET `name`=?, `description`=?, `price`=?, `allergies`=?, `ingredients`=?, `offered_since`=? WHERE id=?',
        [data.name, data.description, data.price, data.allergies, data.ingredients, data.offered_since, id], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
            //Return updated house
            exports.get(id, callback);
        });
}

exports.checkIfUserIsAdmin = function (id, user_id, callback) {
    database.con.query('SELECT meals.*, user.email_address AS user_email, CONCAT(user.firstname, \' \', user.lastname) AS user_fullname FROM meals LEFT JOIN user ON meals.user_id = user.id WHERE meals.id = ? AND meals.user_id = ?', [id, user_id], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        if (results.length === 0) {
            return callback("meal-not-owned-by-user", undefined);
        }
        callback(undefined, results[0]);
    });
}

exports.getAll = function (callback) {
    database.con.query('SELECT meals.*, users.email_address AS user_email, CONCAT(users.firstname, \' \', users.lastname) AS user_fullname FROM meals LEFT JOIN users ON meals.user_id = users.id', [], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        callback(undefined, results);
    });
}


exports.getAllMealsForHouse = function (houseId, callback) {
    database.con.query('SELECT meals.*, users.email_address AS user_email, CONCAT(users.firstname, \' \', users.lastname) AS user_fullname FROM meals LEFT JOIN users ON meals.user_id = users.id WHERE meals.studenthouse_id = ?', [houseId], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        callback(undefined, results);
    });
}
