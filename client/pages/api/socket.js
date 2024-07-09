// pages/api/socket.js
import { Server } from 'socket.io'

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    const rooms = new Map()

    io.on('connection', (socket) => {
      console.log('A user connected')

      socket.on('create-room', ({ roomId, userName }) => {
        rooms.set(roomId, { users: [{ id: socket.id, name: userName }] })
        socket.join(roomId)
        io.to(roomId).emit('room-update', rooms.get(roomId))
      })

      socket.on('join-room', ({ roomId, userName }) => {
        const room = rooms.get(roomId)
        if (room) {
          room.users.push({ id: socket.id, name: userName })
          socket.join(roomId)
          io.to(roomId).emit('room-update', room)
        } else {
          socket.emit('error', 'Room not found')
        }
      })

      socket.on('disconnect', () => {
        rooms.forEach((room, roomId) => {
          const index = room.users.findIndex(user => user.id === socket.id)
          if (index !== -1) {
            room.users.splice(index, 1)
            io.to(roomId).emit('room-update', room)
            if (room.users.length === 0) {
              rooms.delete(roomId)
            }
          }
        })
      })
    })
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default ioHandler