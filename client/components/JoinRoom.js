import { useState } from "react";

export default function JoinRoom({ socket, onRoomJoined }) {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");

  const handleJoin = (e) => {
    e.preventDefault();
    socket.emit("join-room", { roomId, userName: name });
    onRoomJoined(roomId);
  };

  return (
    <form onSubmit={handleJoin}>
      <div className="inputs">
        <input
          className="create-input"
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
        />
        <input
          type="text"
          className="create-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Your Name"
        />
      </div>
      <button className="button-1 margin" type="submit">
        Join Room
      </button>
    </form>
  );
}
