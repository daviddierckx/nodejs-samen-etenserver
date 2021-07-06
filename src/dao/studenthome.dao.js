const database = require("./database");

exports.add = function (data, callback) {
    database.con.query('INSERT INTO `studenthome` (`Name`, `Address`, `House_Nr`, `Postal_Code`, `City`, `Telephone`, `UserID`) VALUES (?,?,?,?,?,?,?)',
        [data.name, data.street, data.housenumber, data.postalcode, data.city, data.phonenumber, data.user_id], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
            exports.get(results.insertId, callback);
        });
}

exports.remove = function (id, callback) {
    id = parseInt(id);
    database.con.query('DELETE FROM `studenthome` WHERE id=?',
        [id], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
            callback(undefined, id);
        });
}

exports.get = function (id, callback) {
    database.con.query('SELECT * FROM studenthome WHERE studenthome.ID = ?', [id], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        if (results.length === 0) {
            return callback("house-not-found", undefined);
        }
        callback(undefined, results[0]);
    });
}

exports.checkIfUserIsAdmin = function (id, user_id, callback) {
    database.con.query('SELECT studenthome.*, user.Email AS user_email, CONCAT(user.First_Name, user.Last_Name) AS user_fullname FROM studenthome LEFT JOIN user ON studenthome.UserID = user.ID WHERE studenthome.ID = ? AND studenthome.UserID = ?', [id, user_id], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        if (results.length === 0) {
            database.con.query('SELECT * FROM home_administrators WHERE home_administrators.StudenthomeID = ? AND home_administrators.UserID = ?', [id, user_id], function (error, results, fields) {
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
    database.con.query('UPDATE `studenthome` SET `Name`=?, `Address`=?, `House_Nr`=?, `Postal_Code`=?, `City`=?, `Telephone`=? WHERE id=?',
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
    database.con.query('SELECT * FROM studenthome WHERE studenthome.city LIKE ? AND studenthome.name LIKE ?',
        [query_city, query_name], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.length === 0 && (name || city)) {
                return callback("no-houses-matched-criteria", undefined);
            }
            callback(undefined, results);
        });
}

exports.addUserToHouse = function (id, user_id, callback) {
    database.con.query('INSERT INTO `home_administrators` (`StudenthomeID`, `UserID`) VALUES (?,?)',
        [id, user_id], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
            exports.get(id, callback);
        });
}

