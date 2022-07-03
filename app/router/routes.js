const express = require('express');
const router = express.Router();
const config = require('./../config');
const jwt = require('jsonwebtoken');
const logger = require('tracer').console()
const user_controller = require('./controllers/userController');
const meal_participants_controller = require('./controllers/mealParticipantsController.js');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    logger.log(req.originalUrl, 'Time:', Date.now(), 'data:', JSON.stringify(req.body), 'query:', JSON.stringify(req.query), 'params:', JSON.stringify(req.params))
    next()
});

router.use(function timeLog(req, res, next) {
    if (req._parsedUrl.pathname === "/info" || req._parsedUrl.pathname === "/register" || req._parsedUrl.pathname === "/login") {
        return next();
    }

    if ((req._parsedUrl.pathname === "/studenthome" || (req._parsedUrl.pathname.startsWith("/studenthome") && parseInt(req._parsedUrl.pathname.replace("/studenthome/", '')) >= 1)) && req.method === "GET") {
        return next();
    }

    logger.log("User authentication started");
    const token = (req.header("authorization") ?? "").replace('Bearer ', '');
    console.log("token: ", token);

    jwt.verify(token, config.auth.secret, {}, function (err, decoded) {
        if (err) return res.status(401).send({ "success": false, "error": "Unauthorized" });
        req.user_email = decoded.user_email;
        req.user_id = decoded.user_id;
        logger.log("User authorization success:", JSON.stringify(decoded));
        next();
    });
});

router.use('/info', require('./controllers/info.js'));
router.use('/', require('./studenthome.js'));

router.post('/register', user_controller.register);
router.post('/login', user_controller.login);

router.get('/user/profile', user_controller.get_personal_details);
router.get('/user/:id', user_controller.get_single_user);
router.put('/user/:id', user_controller.user_update_put);
router.delete('/user/:id', user_controller.user_delete);

router.get('/:mealId/participants', meal_participants_controller.get_participants_get);
router.get('/:mealId/participants/:participantId', meal_participants_controller.get_participant_details_get);

module.exports = router