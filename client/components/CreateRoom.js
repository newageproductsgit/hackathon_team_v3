import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "../styles/Home.module.css";
import { useRouter } from "next/router";

export default function CreateRoom({ socket, roomUsers }) {
  const [roomName, setRoomName] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const createRoom = (e) => {
    e.preventDefault();
    window?.localStorage.setItem("kbc_name", name);
    socket.emit("join-room", {
      room: roomName,
      username: name,
      source: "createRoom",
    });
    router.push(`/lobby?roomid=${roomName}`);
  };

  return (
    <form onSubmit={createRoom}>
      <input
        className="create-input"
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Enter Room Name"
      />
      <input
        type="text"
        className="create-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Your Name"
      />
      <button
        className="button-1 marginLeft"
        type="submit"
        style={{ marginTop: "20px" }}
      >
        Create/Join Room
      </button>
    </form>
  );
}
