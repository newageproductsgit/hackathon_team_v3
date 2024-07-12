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
  const [isadmin, setIsAdmin] = useState(false);
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
    // const fetchRoomStatus = async () => {
    //   const exists = await checkRoom(roomid);
    //   if (!exists) {
    //     setShowInvalidModal(true);
    //   } else {
    //     console.log("setting room as", roomid);
    //     setRoomName(roomid);
    //   }
    // };

    // fetchRoomStatus();
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
    newSocket.on("start-notification", (data) => {
      console.log("game started --", data.room);
      router.push(`/play/room/fastest-finger/${roomid}`);
    });
    newSocket.on("room-users", (users) => {
      setRoomUsers(users);
      const btnValue = window?.localStorage.getItem("kbc_name");
      if (btnValue) {
        users.map((item) => {
          if (item.username == btnValue && item.role == "admin") {
            setIsAdmin(true);
          }
        });
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);
  useEffect(() => {
    let user_name = window?.localStorage.getItem("kbc_name");
    if (user_name) {
      setUsername(user_name);
      if (roomid != null && username !== null) {
        setRoom(roomid);
        socket.emit("join-room", {
          room: roomid,
          username: username,
          source: "lobby",
        });
      }
    } else {
      setShowInvalidModal(true);
    }
  }, [room, username]);
  const joinRoomHandler = (e) => {
    e.preventDefault();
    window?.localStorage.setItem("kbc_name", username);
    if (roomName && username) {
      // socket.emit("join-room", { room: roomName, username });
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
  const handlerGameStart = () => {
    socket.emit("game-started", { room: roomid });
    console.log(roomid, "click-handle");
  };
  console.log(isadmin, "is-admin");
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
          <h1>Game Lobby {room}</h1>
          {/* <div>Socket ID: {socketID}</div>

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
          </form> */}

          {room && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {isadmin && (
                <button
                  className="modal_play_button"
                  onClick={() => handlerGameStart()}
                >
                  Start Game!
                </button>
              )}
              <div
                className={styles.glassContainer}
                style={{ textAlign: "center" }}
              >
                <h3>Users in this room:</h3>
                {roomUsers.map((user, index) => (
                  <>
                    {index + 1}. {user.username}
                    {user.role === "admin" && <span> (admin)</span>}
                    {user.role === "joinee" && <span> (joinee)</span>}
                    <br />
                  </>
                ))}
              </div>
              <div className={`${styles.glassContainer} ${styles.lobby_chat_window}`}>
                <div style={{ textAlign: "center" }}>
                  Chat with your friends!
                </div>
                <form onSubmit={handleSubmit} style={{ display: "flex" }}>
                  <input
                    type="text"
                    placeholder="Message"
                    style={{ width: "100%", height: "20px" }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button type="submit">&#10148;</button>
                </form>
                <div
                  style={{
                    marginTop: "20px",
                    padding: "10px",
                    border: "2px solid white",
                    borderRadius: "10px",
                  }}
                >
                  {messages.map((msg, index) => (
                    <p key={index}>
                      {msg.username}: {msg.message}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div
            style={{
              display: "flex",
              marginTop: "20px",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* <div
              className={styles.glassContainer}
              style={{ height: "300px", overflowY: "scroll" }}
            >
              <h3>Room events</h3>
              <h3>Winner001 is currently at question 10/15</h3>
            </div> */}
          </div>
        </div>
      )}
      ;
    </>
  );
}
