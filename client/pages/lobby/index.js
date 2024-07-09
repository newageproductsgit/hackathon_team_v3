import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketID] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [username, setUsername] = useState("");
  const [roomUsers, setRoomUsers] = useState([]);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      transports: ["websocket"],
      reconnection: false,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      setSocketID(newSocket.id);
      console.log("connected", newSocket.id);
    });

    newSocket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    newSocket.on("room-users", (users) => {
      setRoomUsers(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinRoomHandler = (e) => {
    e.preventDefault();
    if (roomName && username) {
      socket.emit("join-room", { room: roomName, username });
      setRoom(roomName);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message && room && username) {
      socket.emit("message", { message, room, username });
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Game Lobby</h1>
      <div>Socket ID: {socketID}</div>

      <form onSubmit={joinRoomHandler}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button type="submit">Join Room</button>
      </form>

      {room && (
        <div>
          <h2>Room: {room}</h2>
          <h3>Users in this room:</h3>
          <ul>
            {roomUsers.map((user, index) => (
              <li key={index}>
                {user.username}
                {user.role === "admin" && <span> (admin)</span>}
                {user.role === "joinee" && <span> (joinee)</span>}
              </li>
            ))}
          </ul>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
          <div>
            {messages.map((msg, index) => (
              <p key={index}>
                {msg.username}: {msg.message}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
