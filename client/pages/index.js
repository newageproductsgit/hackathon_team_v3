import { useEffect, useRef, useState } from "react";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import ChatWindow from "@/components/Chatwindow";

export default function Home() {
  const { asPath } = useRouter();
  const [roomId, setRoomId] = useState("");
  const [showStartModal, setShowStartModal] = useState(false);
  const [createRoomText, setCreateRoomText] = useState(false);
  const audioRef = useRef(null);
  const router = useRouter();
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketID] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [roomUsers, setRoomUsers] = useState([]);
  const [name, setName] = useState("");

  console.log("roomname", roomName);
  const handleRoomCreated = (newRoomId) => {
    console.log(newRoomId);
    setRoomId(newRoomId);
    setCreateRoomText(true);
    setTimeout(() => {
      setCreateRoomText(false);
    }, 3000);
    // router.push(`/room/${newRoomId}`);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const handleJoin = (e) => {
    e.preventDefault();
    socket.emit("join-room", { userName: name });
  };
  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };
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

  const handleClick = () => {
    setShowStartModal(true);
  };
  const playAudio = async () => {
    if (audioRef.current) {
      try {
        audioRef.current.volume = "0.2";
        await audioRef.current.play();
      } catch (err) {
        console.error("Failed to play audio", err);
      }
    }
  };
  useEffect(() => {
    // setTimeout(playAudio,2000)
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  console.log(roomUsers);
  return (
    <>
      <div onClick={playAudio} className={`${showStartModal ? "blur" : ""}`}>
        <audio
          ref={audioRef}
          src="/assets/kbc-awesome-5410.mp3"
          controls
          loop
          hidden
        />
        <div className="container">
          <div className="main-head glassContainer">
            <img
              src="/assets/logo.png"
              style={{ width: "80px", borderRadius: "60%" }}
            />
            <h1 style={{ textTransform: "uppercase" }}>
              Kaun Banega Crorepati 💸🤑
            </h1>
          </div>
          <div className="info-box glassContainer">
            <div className="create-room">
              {!roomId ? (
                <>
                  <p>Create Room</p>
                  <CreateRoom
                    socket={socket}
                    onRoomCreated={handleRoomCreated}
                  />
                </>
              ) : createRoomText && roomId ? (
                <>
                  <p>Create Room</p>
                  <CreateRoom
                    socket={socket}
                    onRoomCreated={handleRoomCreated}
                    setRoomName={setRoomName}
                    roomName={roomName}
                  />
                  <p>Your Room is created successfully!</p>
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="join-room">
              {roomId && !createRoomText ? (
                <>
                  <h2>Join a Room</h2>
                  <JoinRoom
                    socket={socket}
                    name={name}
                    setName={setName}
                    handleJoin={handleJoin}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
            <ul>
              {roomUsers.map((user, index) => (
                <li key={index}>
                  {user.username}
                  {user.role === "admin" && <span> (admin)</span>}
                  {user.role === "joinee" && <span> (joinee)</span>}
                </li>
              ))}
            </ul>
          </div>
          {!roomId && (
            <>
              <p>
                <b>OR</b>
              </p>
              <button onClick={handleClick} className="single_p_button">
                PLAY SINGLEPLAYER
              </button>
            </>
          )}
        </div>
      </div>
      <div className="center-align">
        {/* <div className="id-socket">{socketID}</div> */}
        {/* <form onSubmit={joinRoomHandler}>
          <h2>Join Room</h2>
          <input 
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          />
          <button type="submit">Join</button>
        </form> */}
        {/* <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <input
            type="text"
            placeholder="Room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button type="submit">Send</button>
        </form> */}
      </div>
      {showStartModal && (
        <div aria-hidden="true" className="overlay">
          <div className="centeredDiv">
            <div
              className="backbutton"
              style={{
                position: "absolute",
                right: "0",
                margin: "5px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => {
                setShowStartModal(false);
              }}
            >
              close
            </div>
            <div className="modalHeader">
              <p className="p1">RULES</p>
              <hr />
              <p
                className="p2"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  flexDirection: "column",
                }}
              >
                <p className="p2">Points table</p>
                <table>
                  <tr
                    style={{
                      color: "gold",
                      background: "rgba(255, 217, 0, 0.418)",
                    }}
                  >
                    <td>15</td>
                    <td>1 crore</td>
                  </tr>
                  <tr>
                    <td>14</td>
                    <td>50,00,000</td>
                  </tr>
                  <tr>
                    <td>13</td>
                    <td>25,00,000</td>
                  </tr>
                  <tr>
                    <td>12</td>
                    <td>12,50,000</td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td>6,40,000</td>
                  </tr>
                  <tr
                    style={{
                      color: "gold",
                      background: "rgba(255, 255, 255, 0.418)",
                    }}
                  >
                    <td>10</td>
                    <td>3,20,000</td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>1,60,000</td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>80,000</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>40,000</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>20,000</td>
                  </tr>
                  <tr
                    style={{
                      color: "gold",
                      background: "rgba(255, 255, 255, 0.418)",
                    }}
                  >
                    <td>5</td>
                    <td>10,000</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>5,000</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>3,000</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>2,000</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>1,000</td>
                  </tr>
                </table>

                <div>
                  <p className="p2">Life Lines</p>
                  <ul>
                    <li>
                      Fifty-Fifty: Removes two incorrect options from the
                      choices.
                    </li>
                    <li>
                      Flip the question: Allows you to change the current
                      question to a new one.
                    </li>
                    <li>
                      Audience Poll: Shows the percentage of the audience that
                      chose each option.
                    </li>
                  </ul>
                </div>
              </p>
            </div>
            <button
              className="modal_play_button"
              onClick={() => router.push(`/play/single-player/game`)}
            >
              PLAY!
            </button>
          </div>
        </div>
      )}
      {/* <div className="chat_window_container">
        <ChatWindow />
      </div> */}
    </>
  );
}
