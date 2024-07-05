import { useState } from 'react'

export default function JoinRoom({ socket, onRoomJoined }) {
  const [roomId, setRoomId] = useState('')
  const [name, setName] = useState('')

  const handleJoin = (e) => {
    e.preventDefault()
    socket.emit('join-room', { roomId, userName: name })
    onRoomJoined(roomId)
  }

  return (
    <form onSubmit={handleJoin}>
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter Room ID"
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Your Name"
      />
      <button type="submit">Join Room</button>
    </form>
  )
}