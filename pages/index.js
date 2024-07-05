import { useState } from 'react'
import CreateRoom from '../components/CreateRoom'
import JoinRoom from '../components/JoinRoom'
import { useRouter } from 'next/router'

export default function Home({ socket }) {
  const [roomId, setRoomId] = useState('')
  const router = useRouter()

  const handleRoomCreated = (newRoomId) => {
    setRoomId(newRoomId)
    router.push(`/room/${newRoomId}`)
  }

  const handleRoomJoined = (joinedRoomId) => {
    router.push(`/room/${joinedRoomId}`)
  }

  return (
    <div>
      <h1>Welcome to Room Creator</h1>
      <CreateRoom socket={socket} onRoomCreated={handleRoomCreated} />
      {roomId && <p>Room created! ID: {roomId}</p>}
      <hr />
      <h2>Join a Room</h2>
      <JoinRoom socket={socket} onRoomJoined={handleRoomJoined} />
    </div>
  )
}