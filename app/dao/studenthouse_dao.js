const database = require("./database");

exports.add = function (data, callback) {
    database.con.query('INSERT INTO `studenthouses` (`name`, `street`, `housenumber`, `postalcode`, `city`, `phonenumber`, `user_id`) VALUES (?,?,?,?,?,?,?)',
        [data.name, data.street, data.housenumber, data.postalcode, data.city, data.phonenumber, data.user_id], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
            exports.get(results.insertId, callback);
        });
}

exports.remove = function (id, callback) {
    id = parseInt(id);
    database.con.query('DELETE FROM `studenthouses` WHERE id=?',
        [id], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
            callback(undefined, id);
        });
}

exports.get = function (id, callback) {
    database.con.query('SELECT studenthouses.*, user.emailAdress AS user_email, CONCAT(user.firstName, \' \', user.lastName) AS user_fullname FROM studenthouses LEFT JOIN user ON studenthouses.user_id = user.id WHERE studenthouses.id = ?', [id], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        if (results.length === 0) {
            return callback("house-not-found", undefined);
        }
        callback(undefined, results[0]);
    });
}

exports.checkIfUserIsAdmin = function (id, user_id, callback) {
    database.con.query('SELECT studenthouses.*, user.emailAdress AS user_email, CONCAT(user.firstName, \' \', user.lastName) AS user_fullname FROM studenthouses LEFT JOIN user ON studenthouses.user_id = user.id WHERE studenthouses.id = ? AND studenthouses.user_id = ?', [id, user_id], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        if (results.length === 0) {
            database.con.query('SELECT * FROM users_studenthouses WHERE users_studenthouses.studenthouseId = ? AND users_studenthouses.userId = ?', [id, user_id], function (error, results, fields) {
                if (error) return callback(error.sqlMessage, undefined);
                if (results.length === 0) {
                    return callback("house-not-owned-by-user", undefined);
                }
                callback(undefined, results[0]);
            });
            return;
        }
        callback(undefined, results[0]);
    });
}

exports.update = function (id, data, callback) {
    database.con.query('UPDATE `studenthouses` SET `name`=?, `street`=?, `housenumber`=?, `postalcode`=?, `city`=?, `phonenumber`=? WHERE id=?',
        [data.name, data.street, data.housenumber, data.postalcode, data.city, data.phonenumber, id], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
            //Return updated house
            exports.get(id, callback);
        });
}

exports.getAll = function (name, city, callback) {
    const query_name = `${name ?? ""}%`;
    const query_city = `${city ?? ""}%`;
    database.con.query('SELECT studenthouses.*, user.emailAdress AS user_email, CONCAT(user.firstName, \' \', user.lastName) AS user_fullname FROM studenthouses LEFT JOIN user ON studenthouses.user_id = user.id WHERE studenthouses.city LIKE ? AND studenthouses.name LIKE ?',
        [query_city, query_name], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.length === 0 && (name || city)) {
                return callback("no-houses-matched-criteria", undefined);
            }
            callback(undefined, results);
        });
}

exports.addUserToHouse = function (id, user_id, callback) {
    database.con.query('INSERT INTO `users_studenthouses` (`studenthouseId`, `userId`) VALUES (?,?)',
        [id, user_id], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
            exports.get(id, callback);
        });
}

