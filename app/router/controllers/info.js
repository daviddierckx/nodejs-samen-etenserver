const express = require('express')
const router = express.Router()
const logger = require('tracer').console()

router.get('/', (req, res) => {
    logger.log("server info");
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({
        "Studentnaam": "David Dierckx",
        "Student nummer": "2179446",
        "description": "Lets share a meal :)",
    }));
});

module.exports = router

