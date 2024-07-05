import React, { useState, useEffect } from "react";
import styles from "../../question.module.css";

const disabled={
  minHeight: '50px',
  color: '#ffffff',
  padding: '10px 20px',
  fontSize: '0.9em',
  cursor: 'pointer',
  border: '2px solid #ffd700',
  position: 'relative',
  textAlign: 'left',
  borderRadius: '50px',
  boxShadow: '0 0 10px #ffd700',
  transition: 'all 0.3s ease',
  color:'#000',
  pointerEvent:'none',
};

const GameQuestionContainer = () => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [showDisable,setShowDisable]=useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDisable=()=>{
    setShowDisable(true)
  }

  return (
    <div className={styles.gameContainer}>
      <div className={styles.timer}>Time left - {timeLeft} seconds</div>
      <h1 className={styles.title}>Question 3/15</h1>
      <div className={styles.prizeLevel}>Price won: $1,000,000</div>
      <div className={styles.content}>
        <main
        >
          <div className={styles.questionBox}>
            <p>What is the capital city of Australia?</p>
          </div>
          <div className={styles.answersGrid}>
          {
              !showDisable ?
              <>
              <button className={styles.answerBtn}>A: Sydney</button>
              <button className={styles.answerBtn}>B: Melbourne</button>
              <button className={styles.answerBtn}>C: Canberra</button>
              <button className={styles.answerBtn}>D: Perth</button>
              </>
              :
              <>
              <button className={styles.answerBtn}>A: Sydney</button>
              <button className={'disabled'} style={disabled}>B: Melbourne</button>
              <button className={'disabled'} style={disabled}>C: Canberra disabled</button>
              <button className={styles.answerBtn}>D: Perth</button>
              </>
            }
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
      </div>
    </div>
  );
};

export default GameQuestionContainer;
