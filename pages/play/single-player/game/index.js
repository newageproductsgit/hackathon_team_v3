import React, { useState, useEffect } from "react";
import styles from "../../question.module.css";

const GameQuestionContainer = () => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [showPopup, setShowPopup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);

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
    setShowPopup(false);
    setTimeLeft(30);
  };
  return (
    <div className={styles.gameContainer}>
      <div className={styles.timer}>Time left - {timeLeft} seconds</div>
      <h1 className={styles.title}>Question 3/15</h1>
      <div className={styles.prizeLevel}>Price won: $1,000,000</div>
      <div className={styles.content}>
        <main>
          <div className={styles.questionBox}>
            <p>What is the capital city of Australia?</p>
          </div>
          <div className={styles.answersGrid}>
            <button className={`${styles.answerBtn} ${styles.answerBtn_left}`}>
              A: Sydney
            </button>
            <button className={`${styles.answerBtn} ${styles.answerBtn_right}`}>
              B: Melbourne
            </button>
            <button className={`${styles.answerBtn} ${styles.answerBtn_left}`}>
              C: Canberra
            </button>
            <button className={`${styles.answerBtn} ${styles.answerBtn_right}`}>
              D: Perth
            </button>
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
              <p>Time's Up!</p>
              <button onClick={handleRestart} className="button-1">
                Restart game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameQuestionContainer;
