const express = require('express')
const app = express()

const http = require('http');
const server = http.createServer(app);

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})