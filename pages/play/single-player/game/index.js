import React, { useState, useEffect } from "react";
import styles from "../../question.module.css";

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
      <div className={styles.content}>
        <header>
          <h1 className={styles.title}>Who Wants to Be a Millionaire?</h1>
          <div className={styles.prizeLevel}>$1,000,000</div>
        </header>

        <main>
          <div className={styles.questionBox}>
            <p>What is the capital city of Australia?</p>
          </div>
          <div className="button-container">
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
              <button className={'disabled'} style={{backgroundColor:'grey',pointerEvents:'none'}}>B: Melbourne</button>
              <button className={'disabled'} style={{backgroundColor:'grey',pointerEvents:'none'}}>C: Canberra disabled</button>
              <button className={styles.answerBtn}>D: Perth</button>
              </>
            }
           
          </div>
          </div>
          <div className={styles.lifelines}>
            <button className={styles.lifelineBtn} onClick={handleDisable}>50:50</button>
            <button className={styles.lifelineBtn}>Phone a Friend</button>
            <button className={styles.lifelineBtn}>Ask the Audience</button>
          </div>
        </main>

        <footer>
          <div className={styles.timer}>{timeLeft}</div>
        </footer>
      </div>
    </div>
  );
};

export default GameQuestionContainer;
