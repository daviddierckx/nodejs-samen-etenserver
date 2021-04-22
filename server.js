const http = require('http')

const hostname = '127.0.0.1'
const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
    let result = {
        'response': 'Hello World!',
        'status': 'Alles OK!'
    }
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  res.end(JSON.stringify(result))
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})