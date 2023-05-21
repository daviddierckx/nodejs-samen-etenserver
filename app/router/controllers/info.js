const express = require('express')
const router = express.Router()
const logger = require('tracer').console()

router.get('/', (req, res) => {
    logger.log("server info");
    res.set('Content-Type', 'application/json');
    res.status(200).send({
        "status": 200, "message": "Server info-endpoint", "data": {
            "studentName": "David Dierckx",
            "studentNumber": 2179446,
            "description": "Welkom bij de share-a-meal API."
        }
    });
});

module.exports = router

