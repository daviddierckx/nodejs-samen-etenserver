const database = require("./database");
const config = require('./../config');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

let userId = 0;


exports.add = function (data, callback) {
    jwt.sign({ data: data.email_address }, config.auth.secret, { expiresIn: '1h' }, (err, res) => {
        if (err) return callback("error-while-creating-token", undefined);
        const hashed = crypto.createHash('sha256').update(data.password).digest('base64');
        database.con.query('INSERT INTO `user` (`firstName`, `lastName`, `isActive`, `emailAdress`, `password`,`phoneNumber`,`roles`,`street`,`city`) VALUES (?,?,?,?,?,?,?,?,?)',
            [data.firstname, data.lastname, data.isActive, data.emailAddress, hashed, data.phoneNumber, data.roles, data.street, data.city], function (error, results, fields) {
                if (error) return callback(error.sqlMessage, undefined);
                if (results.affectedRows === 0) return callback("user-already-exists", undefined);
                exports.generateNewToken(data.email_address, results.insertId, callback)
            });
    });
}

exports.login = function (email, password, callback) {
    const hashed = crypto.createHash('sha256').update(password).digest('base64');
    database.con.query('SELECT * FROM user WHERE emailAdress = ? AND password = ?', [email, hashed], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        if (results.length === 0) {
            return callback("user-login-failed", undefined);
        }
        exports.generateNewToken(results[0].email_address, results[0].id, callback)
    });
}

exports.generateNewToken = function (email, user_id, callback) {
    jwt.sign({ user_email: email, user_id: user_id }, config.auth.secret, { expiresIn: '1h' }, (err, res) => {
        if (err) return callback("error-while-creating-token", undefined);
        database.con.query('SELECT * FROM user WHERE emailAdress = ? AND password = ?',
            [res, email, user_id], function (error, results, fields) {
                if (error) return callback(error.sqlMessage, undefined);
                if (results.affectedRows === 0) return callback("failed to update token", undefined);
                userId = user_id
                callback(undefined, { token: res, user_id: user_id });
            });
    });
}
exports.getPersonalInfo = function (id, callback) {
    database.con.query('SELECT * FROM user WHERE user.id = ?', userId, function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        if (results.length === 0) {
            return callback("user-not-found", undefined);
        }
        callback(undefined, results[0]);
    });
}

exports.get = function (id, callback) {
    database.con.query('SELECT * FROM user WHERE user.id = ?', id, function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        if (results.length === 0) {
            return callback("user-not-found", undefined);
        }
        callback(undefined, results[0]);
    });
}

exports.getAll = function (name, city, callback) {
    const query_name = `${name || ""}%`;
    const query_city = `${city || ""}%`;
    database.con.query('SELECT * FROM user WHERE city LIKE ? AND lastName LIKE ?',
        [query_city, query_name], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.length === 0 && (name || city)) {
                return callback("no-user-matched-criteria", undefined);
            }
            callback(undefined, results);
        });
}

exports.getUserById = function (id, callback) {
    database.con.query('SELECT * FROM user WHERE user.id = ?', [id], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        if (results.length === 0) {
            return callback("user-not-found", undefined);
        }
        callback(undefined, results[0]);
    });
}

exports.update = function (id, data, callback) {
    id = parseInt(id);
    database.con.query('UPDATE `user` SET `firstName`=?, `lastName`=?, `isActive`=?, `emailAdress`=?, `phoneNumber`=?, `roles`=?, `street`=?, `city`=? WHERE user.id=?',
        [data.firstName, data.lastName, data.isActive, data.emailAdress, data.phoneNumber, data.roles, data.street, data.city, id], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
            exports.get(id, callback);
        });
}

exports.remove = function (id, callback) {
    database.con.query('DELETE FROM `user` WHERE id=?',
        [id], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
            callback(undefined, id);
        });
}

exports.addUserToMeal = function (id, myUserId, callback) {

    database.con.query('INSERT INTO `meal_participants_user` (`mealId`, `userId`) VALUES (?,?)',
        [id, myUserId], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
            exports.get(myUserId, callback);
        });
}

exports.RemoveUserToMeal = function (id, myUserId, callback) {

    database.con.query('DELETE FROM `meal_participants_user` WHERE userId=? AND mealId=?',
        [myUserId, id], function (error, results, fields) {
            if (error) return callback(error.sqlMessage, undefined);
            if (results.affectedRows === 0) return callback("no-rows-affected", undefined);
            callback(undefined, myUserId);
        });
}

exports.getDetailsParticipant = function (mealId, participantId, callback) {
    database.con.query('SELECT meal_participants_user.*, user.emailAdress AS user_email, CONCAT(user.firstName, user.lastName) AS user_fullname FROM meal_participants_user LEFT JOIN user ON meal_participants_user.userId = user.id WHERE mealId= ? AND userId = ?', [mealId, participantId], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        callback(undefined, results);
    });
}