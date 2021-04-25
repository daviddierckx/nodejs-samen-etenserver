const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  console.log("Get request op /api/info")
  
  const info = {
    servername: 'My nodejs server',
    name: 'David'
  }
  res.status(200).json(info)
})

app.listen(port, () => {
  console.log(`Example app listening at :${port}`)
})