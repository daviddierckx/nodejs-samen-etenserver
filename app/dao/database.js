const logger = require('tracer').console()
const mysql = require('mysql');
const config = require('./../config');

exports.con = mysql.createConnection({
    host: config.database.address,
    port: config.database.port,
    user: config.database.username,
    password: config.database.password,
    database: config.database.database,
});

exports.con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    logger.log("Database connected with id:", exports.con.threadId);
});
