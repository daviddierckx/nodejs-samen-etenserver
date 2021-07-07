const logger = require('tracer').console()
const mysql = require('mysql');
const config = require('./../utils/configuration')
exports.con = mysql.createConnection({

    host: config.database.address,
    user: config.database.username,
    password: config.database.password,
    database: config.database.database
});

exports.con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    logger.log("Database connected with id:", exports.con.threadId);
});
