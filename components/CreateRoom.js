import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import "../styles/Home.module.css"
export default function CreateRoom({ socket, onRoomCreated }) {
  const [name, setName] = useState('')

  const createRoom = () => {
    const newRoomId = uuidv4()
    socket.emit('create-room', { roomId: newRoomId, userName: name })
    onRoomCreated(newRoomId)
  }

  return (
    <div>
      <input
      className="create-input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Your Name"
      />
      <button className='button-1 marginLeft' onClick={createRoom}>Create Room</button>
    </div>
  )
}