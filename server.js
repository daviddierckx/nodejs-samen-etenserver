const express = require('express')
const app = express()
<<<<<<< Updated upstream
const database = require('./src/dao/database')
const studenthome = require('./src/routes/studenthome.routes')
const meals = require('./src/routes/meal.routes')
=======
<<<<<<< Updated upstream
const database = require('./database')
=======
const database = require('./src/dao/database')
const studenthome = require('./src/routes/studenthome.routes')
const meals = require('./src/routes/meal.routes')
const pool = require('./src/dao/database')
>>>>>>> Stashed changes
>>>>>>> Stashed changes

var logger = require('tracer').console()

const port = process.env.PORT || 3000

//Instal the routes
app.use("/api",studenthome)
app.use("/api",meals)

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