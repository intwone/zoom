const http = require('http')
const socketIO = require('socket.io')

const server = http.createServer((request, response) => {
  response.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  }) 

  response.end('server online!')
})

const io = socketIO(server, {
  cors: {
    origin: '*',
    credentials: false
  }
}) 

io.on('connection', socket => {
  console.log('connection', socket.id)
  socket.on('join-room', (roomID, userID) => {
    socket.join(roomID)
    socket.to(roomID).broadcast.emit('user-connected', userID)
    socket.on('disconect', () => {
      console.log('disconnected!', roomID, userID)
      socket.to(roomID).broadcast.emit('user-disconnected', userID)
    })
  })
})

const startServer = () => {
  const { address, port } = server.address()
  console.info(`app running at ${address}:${port}`)
}

server.listen(process.env.PORT || 3000, startServer)