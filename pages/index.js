import { useEffect, useRef, useState } from "react";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";
import { useRouter } from "next/router";

export default function Home({ socket }) {
  const { asPath } = useRouter();
  const [roomId, setRoomId] = useState("");
  const audioRef = useRef(null);
  const router = useRouter();
  const handleRoomCreated = (newRoomId) => {
    setRoomId(newRoomId);
    router.push(`/room/${newRoomId}`);
  };

  const handleRoomJoined = (joinedRoomId) => {
    router.push(`/room/${joinedRoomId}`);
  };
  const handleClick = () => {
    router.push(`/play/single-player/game`);
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
    console.log("came egre");
    // setTimeout(playAudio,2000)
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  return (
    <>
      <div onClick={playAudio}>
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
            <p>Create Room</p>
            <CreateRoom socket={socket} onRoomCreated={handleRoomCreated} />
            {roomId && <p>Room created! ID: {roomId}</p>}
            <div className="cta-container">
              {/* <hr /> */}
              {/* <h2>Join a Room</h2> */}
            </div>
            <h2>Join a Room</h2>
            <JoinRoom socket={socket} onRoomJoined={handleRoomJoined} />
          </div>
          <p>
            <b>OR</b>
          </p>
          <button onClick={handleClick} className="single_p_button">
            PLAY SINGLEPLAYER
          </button>
        </div>
      </div>
    </>
  );
}
