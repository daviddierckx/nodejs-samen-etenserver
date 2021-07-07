const express = require('express')
const app = express()
const database = require('./src/dao/database')
const studenthome = require('./src/routes/studenthome.routes')
const meals = require('./src/routes/meal.routes')
const user = require('./src/routes/user.routes')
const participants = require('./src/routes/participants.routes')
const pool = require('./src/dao/database')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
var cookies = require("cookie-parser");
const jwt = require("jsonwebtoken");


const config = require('./src/utils/configuration');

require("dotenv").config()

var logger = require('tracer').console()

//verander naar 3000
const port = process.env.PORT || 3000
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieParser());
app.use(cookies());
//middleware logger
app.use(function timeLog(req, res, next) {
  logger.log(req.originalUrl, "Time:", Date.now(), "data:", JSON.stringify(req.body), "query:", JSON.stringify(req.query), "params:", JSON.stringify(req.params));
  next();
});

// User Authentication
app.use(function timeLog(req, res, next) {
  if (
    req._parsedUrl.pathname === "/register" ||
    req._parsedUrl.pathname === "/login" ||
    req._parsedUrl.pathname === "/studenthome" ||
    req._parsedUrl.pathname.startsWith("/studenthome")
  ) {
    return next();
  }

  // If you want to skip out add this to your .env file: "SKIP_AUTH=1"
  if (process.env.SKIP_AUTH === 1) {
    logger.log("Skipping auth because of ENV SKIP_AUTH")
    return next();
  }

  // Check if auth cookie exists
  if (req.cookies.home_auth === undefined) {
    return res.status(401).send(" auth cookie don't exists");
  }

  logger.log("User authentication started");
  const token = req.cookies.home_auth;
  jwt.verify(token, config.auth.secret, {}, function (err, decoded) {
    if (err) {
      return res.status(401).send("res.status(401)");
    }
    req.user_email = decoded.user_email;
    req.user_id = decoded.user_id;
    logger.log("User authorization success:", JSON.stringify(decoded));
    next();
  });
});

//Instal the routes
app.use(express.json())
app.use("/api", studenthome)
app.use("/api", meals)
app.use("/api", user)
app.use("/api", participants)

app.get('/api/info', (req, res) => {
  logger.log("Get request op /api/info")

  const info = {
    Studentnaam: 'David Dierckx',
    Studentnummer: '2179946',
    Beschrijving: 'Avans hogeschool',
    SonarqubeURL: 'https://sonarqube.avans-informatica-breda.nl/dashboard?id=nodejs-sameneten'
  }
  res.status(200).json(info)
})
// Catch-all route
app.all("*", (req, res, next) => {
  console.log("Catch-all endpoint aangeroepen");
  next({ message: "Endpoint '" + req.url + "' does not exist", errCode: 404 });
});
app.use((error, req, res, next) => {
  console.log("Errorhandler called! ", error);
  res.status(error.errCode).json({
    error: "Some error occurred",
    message: error.message,
  });
});

app.listen(port, () => {
  logger.log(`Example app listening at :${port}`)
})

module.exports = app;