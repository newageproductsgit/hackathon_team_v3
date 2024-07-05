import React, { useState, useEffect } from "react";
import styles from "../../question.module.css";

const GameQuestionContainer = () => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [showPopup, setShowPopup] = useState(false);

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
  // const restartGame = () => {
  //   setTimeLeft(30);
  //   setShowPopup(false);
  // };
  console.log(showPopup, "dasda");
  return (
    <div className={styles.gameContainer}>
      <div className={styles.content}>
        <header>
          <h1 className={styles.title}>Who Wants to Be a Millionaire?</h1>
          <div className={styles.prizeLevel}>$1,000,000</div>
        </header>

        <main>
          <div className={styles.questionBox}>
            <p>What is the capital city of Australia?</p>
          </div>

          <div className={styles.answersGrid}>
            <button className={styles.answerBtn}>A: Sydney</button>
            <button className={styles.answerBtn}>B: Melbourne</button>
            <button className={styles.answerBtn}>C: Canberra</button>
            <button className={styles.answerBtn}>D: Perth</button>
          </div>

          <div className={styles.lifelines}>
            <button className={styles.lifelineBtn}>50:50</button>
            <button className={styles.lifelineBtn}>Phone a Friend</button>
            <button className={styles.lifelineBtn}>Ask the Audience</button>
          </div>
        </main>

        <footer>
          <div className={styles.timer}>{timeLeft}</div>
        </footer>
        {/* <button onClick={() => setShowPopup(true)}>showmodal</button> */}
        {showPopup && (
          <div aria-hidden="true" className={styles.overlay}>
            <div className={styles.centeredDiv}>
              <p>Time's   Up!</p>
              <button className="button-1">Restart game</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameQuestionContainer;
