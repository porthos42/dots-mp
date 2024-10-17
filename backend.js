const express = require('express')
const app = express()

// socket.io setup
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io')
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 })

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const backEndPlayers = {}
const backEndProjectiles = {}

const SPEED = 10
let projectileId = 0

io.on('connection', (socket) => {
  console.log('a user connected')

  backEndPlayers[socket.id] = {
    x: 1024 * Math.random(),
    y: 576 * Math.random(),
    color: `hsl(${360 * Math.random()}, 100%, 50%)`,
    sequenceNumber: 0
  }
  
  console.log(backEndPlayers)
  console.log('backEndPlayer color: ' + backEndPlayers[socket.id].color)

  io.emit('updatePlayers', backEndPlayers)

  socket.on('shoot', ({x, y, angle}) => {
    projectileId++

    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5
    }

    backEndProjectiles[projectileId] = {
      x, 
      y, 
      velocity,
      playerId: socket.id
    }
  })


  socket.on('keydown', ({ keycode, sequenceNumber }) => {
    const backEndPlayer = backEndPlayers[socket.id]

    if (!backEndPlayers[socket.id]) return

    backEndPlayers[socket.id].sequenceNumber = sequenceNumber
    switch(keycode) {
      case 'KeyW':
        backEndPlayers[socket.id].y -= SPEED
        break
  
      case 'KeyA':
        backEndPlayers[socket.id].x -= SPEED
        break
  
      case 'KeyS':
        backEndPlayers[socket.id].y += SPEED
        break
        
      case 'KeyD':
        backEndPlayers[socket.id].x += SPEED
        break
    }
  })  

  socket.on('disconnect', (reason) => {
    console.log(reason)
    delete backEndPlayers[socket.id]
    io.emit('updatePlayers', backEndPlayers)
  })
})

// backend ticker
setInterval(() => {
  io.emit('updatePlayers', backEndPlayers)
}, 15)

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})