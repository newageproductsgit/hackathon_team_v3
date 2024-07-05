import React, { useState, useEffect } from 'react';
import styles from '../../question.module.css';

const QuestionContainer = () => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [question, setQuestion] = useState(null); // State to hold the question data

  useEffect(() => {
    // Mock API call to fetch question data (replace with actual fetch call)
    fetch('/api/questions?id=1')
      .then(response => response.json())
      .then(data => {
        console.log('apadata',data);
       // const question = data.question;
        setQuestion(data); // Update state with fetched data
        // Highlight code blocks using Prism.js
      })
      .catch(error => console.error('Error fetching question:', error));

    const timer = setInterval(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []); // Empty dependency array to run effect only once on mount

  // Render loading or question content based on state
  return (
    <div className={styles.gameContainer}>
      <div className={styles.content}>
        <header>
          <h1 className={styles.title}>Who Wants to Be a Millionaire?</h1>
          <div className={styles.prizeLevel}>$1,000,000</div>
        </header>

        <main>
          {question ? (
            <div className={styles.questionBox}>
              <p>{question.question_text}</p>
            </div>
          ) : (
            <div>Loading...</div>
          )}

          <div className={styles.answersGrid}>
            {/* Render answer buttons dynamically */}
            {question &&
              question.map((answer, index) => (
                <button key={index} className={styles.answerBtn}>
                  {answer}
                </button>
              ))}
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
      </div>
    </div>
  );
};

export default QuestionContainer;
