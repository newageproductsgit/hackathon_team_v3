import React, { useState, useEffect, useRef } from "react";
import styles from "../../question.module.css";
import { useRouter } from "next/router";

const disabled = {
  minHeight: "50px",
  color: "#ffffff",
  padding: "10px 20px",
  fontSize: "0.9em",
  cursor: "pointer",
  border: "2px solid #ffd700",
  position: "relative",
  textAlign: "left",
  borderRadius: "50px",
  boxShadow: "0 0 10px #ffd700",
  transition: "all 0.3s ease",
  color: "#000",
  pointerEvent: "none",
  backgroundColor: "#dbc4c4",
  cursor: "defult",
};

const GameQuestionContainer = () => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [showPopup, setShowPopup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const router = useRouter();
  const audioRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // clearInterval(timer);
          setShowPopup(true);
        }
        return prevTime > 0 ? prevTime - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDisable = () => {
    setShowDisable(true);
  };
  const handleRestart = () => {
    router.push("/");
    // setShowPopup(false);
    // setTimeLeft(30);
  };
  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          console.log("Audio playing");
        } catch (err) {
          console.error("Failed to play audio", err);
        }
      }
    };
    playAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  return (
    <div className={styles.gameContainer}>
      <audio
        ref={audioRef}
        src="/assets/kbc-awesome-5410.mp3"
        controls
        hidden
      />
      <div className={styles.timer}>Time left - {timeLeft} seconds</div>
      <h1 className={styles.title}>Question 1/15</h1>
      <div className={styles.prizeLevel}>Price won: $1,000,000</div>
      <div className={styles.content}>
        <main>
          <div className={styles.questionBox}>
            <p>What is the capital city of Australia?</p>
          </div>
          <div className={styles.answersGrid}>
            {!showDisable ? (
              <>
                <button className={styles.answerBtn}>A: Sydney</button>
                <button className={styles.answerBtn}>B: Melbourne</button>
                <button className={styles.answerBtn}>C: Canberra</button>
                <button className={styles.answerBtn}>D: Perth</button>
              </>
            ) : (
              <>
                <button className={styles.answerBtn}>A: Sydney</button>
                <button className={"disabled"} style={disabled}>
                  B: Melbourne
                </button>
                <button className={"disabled"} style={disabled}>
                  C: Canberra
                </button>
                <button className={styles.answerBtn}>D: Perth</button>
              </>
            )}
          </div>
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.5rem",
              marginTop: "100px",
              marginBottom: "50px",
            }}
          >
            Got stuck? Use your life lines!
          </div>
          <div className={styles.lifelines}>
            <button
              className={styles.lifelineBtn}
              data-hover-text="Removes two wrong answers"
              onClick={handleDisable}
            >
              50:50
            </button>
            <button
              className={styles.lifelineBtn}
              data-hover-text="Call a friend for help"
            >
              Phone a Friend
            </button>
            <button
              className={styles.lifelineBtn}
              data-hover-text="Ask the audience for help"
            >
              Ask the Audience
            </button>
          </div>
        </main>

        {showPopup && (
          <div aria-hidden="true" className={styles.overlay}>
            <div className={styles.centeredDiv}>
              <button onClick={handleRestart} className="button-1">
                Restart Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameQuestionContainer;
