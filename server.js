const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.static('api/info'));

app.get('/api/info', (req, res) => {
  console.log("Get request op /api/info")
  
  const info = {
    Studentnaam: 'David Dierckx',
    Studentnummer: '2179946',
    Beschrijving: 'Avans hogeschool',
    SonarqubeURL: ''
  }
  res.status(200).json(info)
})

app.listen(port, () => {
  console.log(`Example app listening at :${port}`)
})