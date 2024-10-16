const express = require('express')
const app = express()

// socket.io setup
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io')
const io = new Server(server)

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const players = {
  sdjhfkjdshfkjdshf: {
    x: 100,
    y: 100,
    color: 'yellow'
  },
  dsfdsfsdfdsffdffe: {
    x: 200,
    y: 200,
    color: 'red'
  }
}


io.on('connection', (socket) => {
  console.log('a user connected')
  players[socket.id] = {
    x: 100,
    y: 100
  }

  console.log(players)
  io.emit('updatePlayers', players)
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})