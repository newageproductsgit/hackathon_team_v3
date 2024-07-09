import React, { useState, useEffect } from "react";
import styles from "../../question.module.css";

const QuestionContainer = () => {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.content}>
        <header>
          <h1 className={styles.title}>Who Wants to Be a Millionaire?</h1>
          <div className={styles.prizeLevel}>Fastest Finger First</div>
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
        </main>

        <footer>
          <div className={styles.timer}>{timeLeft}</div>
        </footer>
      </div>
    </div>
  );
};

export default QuestionContainer;