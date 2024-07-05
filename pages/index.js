import { useState } from "react";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";
import { useRouter } from "next/router";


export default function Home({socket}) {
  const { asPath } = useRouter();
  if (asPath == "homepage") {
    body.style.background = "#4B0082";
  }
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const handleRoomCreated = (newRoomId) => {
    setRoomId(newRoomId);
    router.push(`/room/${newRoomId}`);
  };

  const handleRoomJoined = (joinedRoomId) => {
    router.push(`/room/${joinedRoomId}`);
  };
  return (
    <>
      <div>
        <div class="container">
          <div className="main-head">
            <img
              src="/assets/logo.png"
              style={{ width: "80px", borderRadius: "60%" }}
            />
            <h1 style={{ textTransform: "uppercase" }}>
              Kaun Banega Crorepati
            </h1>
          </div>
          <div class="info-box">
            <p>Start Here</p>
            <div className="cta-container">
              <CreateRoom socket={socket} onRoomCreated={handleRoomCreated} />
              {roomId && <p>Room created! ID: {roomId}</p>}
              <hr />
              <h2>Join a Room</h2>
              <JoinRoom socket={socket} onRoomJoined={handleRoomJoined} />
            </div>
          </div>

          <div class="image-container">
            <img
              src="/assets/img2.webp"
              alt="KBC Host"
              style={{ width: "500px" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
