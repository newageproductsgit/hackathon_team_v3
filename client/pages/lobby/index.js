import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import styles from "../play/question.module.css";

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketID] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState(null);
  const [username, setUsername] = useState(null);
  const [roomUsers, setRoomUsers] = useState([]);

  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const router = useRouter();
  const { roomid } = router.query;
  async function checkRoom(room) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/check-room/${room}`
      );
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("Error checking room:", error);
      return false;
    }
  }
  useEffect(() => {
    const fetchRoomStatus = async () => {
      const exists = await checkRoom(roomid);
      if (!exists) {
        setShowInvalidModal(true);
      } else {
        console.log("setting room as", roomid);
        setRoomName(roomid);
      }
    };

    fetchRoomStatus();
    const newSocket = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      transports: ["websocket"],
      reconnection: false,
    });
    // const newSocket = initSocket();
    setSocket(newSocket);
    newSocket.on("connect", () => {
      setSocketID(newSocket.id);
      console.log("connected", newSocket.id);
    });

    newSocket.on("receive-message", (data) => {
      console.log("someine");
      setMessages((prev) => [...prev, data]);
    });
    newSocket.on("receive-ff-winner", (data) => {
      console.log("we got winner!", data.username);
    });
    newSocket.on("room-users", (users) => {
      setRoomUsers(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);
  useEffect(() => {
    let user_name = window?.localStorage.getItem("kbc_name");
    if (user_name) {
      setUsername(user_name);
      if (room != null && username !== null) {
        socket.emit("join-room", { room: roomName, username });
      }
    } else {
      setShowInvalidModal(true);
      setDisableTimer(true);
    }
  }, [room, username]);
  const joinRoomHandler = (e) => {
    e.preventDefault();
    window?.localStorage.setItem("kbc_name", username);
    if (roomName && username) {
      socket.emit("join-room", { room: roomName, username });
      setRoom(roomName);
    }
  };
  const handleRestart = () => {
    router.replace("/");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message && room && username) {
      socket.emit("message", { message, room, username });
      setMessage("");
    }
  };

  return (
    <>
      {showInvalidModal ? (
        <div aria-hidden="true" className={styles.overlay}>
          <div className={styles.centeredDiv}>
            <div className={styles.modalHeader}>
              <p className={styles.p1}>Invalid Link!</p>
            </div>
            <button onClick={handleRestart} className="button-1">
              Main Page
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h1>Game Lobby</h1>
          <div>Socket ID: {socketID}</div>

          <form onSubmit={joinRoomHandler}>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
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
      )}
      ;
    </>
  );
}
