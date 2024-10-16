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

io.on('connection', (socket) => {
  console.log('a user connected')

  backEndPlayers[socket.id] = {
    x: 1024 * Math.random(),
    y: 576 * Math.random(),
    color: `hsl(${360 * Math.random()}, 100%, 50%)`
  }
  
  console.log(backEndPlayers)
  console.log('backEndPlayer color: ' + backEndPlayers[socket.id].color)

  io.emit('updatePlayers', backEndPlayers)
  socket.on('keydown', (keycode) => {
    switch(keycode) {
      case 'KeyW':
        backEndPlayers[socket.id].y -= 5
        break
  
      case 'KeyA':
        backEndPlayers[socket.id].x -= 5
        break
  
      case 'KeyS':
        backEndPlayers[socket.id].y += 5
        break
        
      case 'KeyD':
        backEndPlayers[socket.id].x += 5
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