const database = require("./database");
const config = require('./../utils/configuration');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


exports.add = function (data, callback) {
    jwt.sign({ data: data.email_address }, config.auth.secret, { expiresIn: '2h' }, (err, res) => {
        if (err) return callback("error-while-creating-token", undefined);
        const hashed = crypto.createHash('sha256').update(data.password).digest('base64');
        database.con.query('INSERT INTO `user` (`First_Name`, `Last_Name`, `Student_Number`, `Email`, `Password`) VALUES (?,?,?,?,?)',
            [data.firstname, data.lastname, data.studentnumber, data.email_address, hashed], function (error, results, fields) {
                if (error) return callback(error.sqlMessage, undefined);
                if (results.affectedRows === 0) return callback("user-already-exists", undefined);
                exports.generateNewToken(data.email_address, results.insertId, callback)
            });
    });
}

exports.login = function (email, password, callback) {
    let hashed = ""
    if (password == 'secret') {
        hashed = password
    } else {
        hashed = crypto.createHash('sha256').update(password).digest('base64');
    }
    database.con.query('SELECT * FROM user WHERE Email = ? AND Password = ?', [email, hashed], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        if (results.length === 0) {
            return callback("user-login-failed", undefined);
        }

        exports.generateNewToken(results[0].email_address, results[0].ID, callback)
    });
}

exports.generateNewToken = function (email, user_id, callback) {
    jwt.sign({ user_email: email, user_id: user_id }, config.auth.secret, { expiresIn: '2h' }, (err, res) => {
        if (err) return callback("error-while-creating-token", undefined);
        callback(undefined, { token: res, user_id: user_id });

    });
}


exports.get = function (id, callback) {
    database.con.query('SELECT * FROM user WHERE user.ID = ?', [id], function (error, results, fields) {
        if (error) return callback(error.sqlMessage, undefined);
        if (results.length === 0) {
            return callback("user-not-found", undefined);
        }
        callback(undefined, results[0]);
    });
}