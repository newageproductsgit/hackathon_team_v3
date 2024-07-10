import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "../styles/Home.module.css";
export default function CreateRoom({ socket, onRoomCreated}) {
  const [roomCreated,setRoomCreated] =useState(false)
  const [roomName, setRoomName] = useState('')

  const createRoom = (e) => {
    e.preventDefault();
    const newRoomId = uuidv4();
    socket.emit("create-room", { roomId: newRoomId,roomName:roomName});
    onRoomCreated(newRoomId);
    setRoomCreated(newRoomId ? true : false) 
  };

  return (
    <form onSubmit={createRoom}>
      <input
        className="create-input"
        type="text"
        value={roomName}
        onChange={(e) =>setRoomName(e.target.value)}
        placeholder="Enter Room Name"
        disabled={roomCreated}
      />
      <button className="button-1 marginLeft" type='submit'>
        Create Room
      </button>
    </form>
  );
}
