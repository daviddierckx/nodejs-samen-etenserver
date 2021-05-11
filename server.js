const express = require('express')
const app = express()
const database = require('./dao/database')
const studenthome = require('./routes/studenthome.routes')
const meals = require('./routes/meal.routes')

var logger = require('tracer').console()

console.log(database.db)

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
    SonarqubeURL: ''
  }
  res.status(200).json(info)
})
// Catch-all route
app.all("*", (req, res, next) => {
  console.log("Catch-all endpoint aangeroepen");
  next({ message: "Endpoint '" + req.url + "' does not exist", errCode: 401 });
});
app.listen(port, () => {
  logger.log(`Example app listening at :${port}`)
})

module.exports = app;