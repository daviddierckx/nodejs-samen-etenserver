const express = require('express')
const app = express()
const database = require('./database')

var logger = require('tracer').console()

console.log(database.db)

const port = process.env.PORT || 3000

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

app.listen(port, () => {
  logger.log(`Example app listening at :${port}`)
})