import React, { useState, useEffect, useRef } from "react";
import styles from "../../question.module.css";
import { useRouter } from "next/router";

const GameQuestionContainer = ({ questions }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [showPopup, setShowPopup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [gameLevel, setGameLevel] = useState(0);
  const [gamePrize, setGamePrize] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState([]);
  const router = useRouter();
  const audioRef = useRef(null);

  const easyQuestions = questions[0]?.easy || [];
  const mediumQuestions = questions[1]?.medium || [];
  const hardQuestions = questions[2]?.hard || [];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setShowPopup(true);
          clearInterval(timer);
        }
        return prevTime > 0 ? prevTime - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchRandomQuestion();
  }, [gameLevel]);

  const fetchRandomQuestion = () => {
    let questionSet;
    if (gameLevel < 5) {
      questionSet = easyQuestions;
    } else if (gameLevel < 10) {
      questionSet = mediumQuestions;
    } else {
      questionSet = hardQuestions;
    }
  
    if (!questionSet || questionsAsked.length >= questionSet.length) {
      console.error("No more questions available.");
      return;
    }
  
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * questionSet.length);
    } while (questionsAsked.includes(randomIndex));
  
    const newQuestion = questionSet[randomIndex];
    if (newQuestion) {
      setQuestion(newQuestion.question);
      setOptions(newQuestion.options);
      setAnswer(newQuestion.answer);
      setQuestionsAsked([...questionsAsked, randomIndex]);
    } else {
      console.error("No valid question found at random index.");
    }
  };
  

  const handleRestart = () => {
    setTimeLeft(60);
    setShowPopup(false);
    setShowDisable(false);
    setGameLevel(0);
    setGamePrize(0);
    setQuestionsAsked([]);
    fetchRandomQuestion();
  };

  const handleOptionClick = (selectedAnswer) => {
    if (selectedAnswer === answer) {
      setGameLevel((prevLevel) => prevLevel + 1);
      setGamePrize((prevPrize) => {
        switch (prevPrize) {
          case 0:
            return 1000;
          case 1000:
            return 2000;
          // Add more cases as per your game's prize structure
          default:
            return prevPrize;
        }
      });
      setTimeout(fetchRandomQuestion, 1000); // Delay to prevent rapid state updates
    } else {
      // Handle incorrect answer logic if needed
      // For example, end game or show modal
    }
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
    <>
      <div className={`${styles.gameContainer} ${showPopup ? styles.blur : ""}`}>
        <audio ref={audioRef} src="/assets/kbc-awesome-5410.mp3" controls hidden />
        <div className={styles.timer}>Time left - {timeLeft} seconds</div>
        <h1 className={styles.title}>Question {gameLevel + 1}/15</h1>
        <div className={styles.prizeLevel}>Prize won: ${gamePrize}</div>
        <div className={styles.content}>
          <main>
            <div className={styles.questionBox}>
              <p>{question}</p>
            </div>
            <div className={styles.answersGrid}>
              {options.map((option, index) => (
                <button
                  key={index}
                  className={`${styles.answerBtn} ${
                    index % 2 === 0
                      ? styles.answerBtn_left
                      : styles.answerBtn_right
                  }`}
                  onClick={() => handleOptionClick(option)}
                  disabled={showDisable}
                >
                  {option}
                </button>
              ))}
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
                onClick={() => setShowDisable(true)}
                disabled={showDisable}
              >
                50:50
              </button>
              <button className={styles.lifelineBtn} data-hover-text="Call a friend for help">
                Phone a Friend
              </button>
              <button className={styles.lifelineBtn} data-hover-text="Ask the audience for help">
                Ask the Audience
              </button>
            </div>
          </main>
        </div>
      </div>
      {showPopup && (
        <div aria-hidden="true" className={styles.overlay}>
          <div className={styles.centeredDiv}>
            <div className={styles.modalHeader}>
              <p className={styles.p1}>Time is up!</p>
              <p className={styles.p2}>Better luck next time!</p>
              <p className={styles.p3}>Prize won: ${gamePrize}</p>
            </div>
            <button onClick={handleRestart} className="button-1">
              Restart Game
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GameQuestionContainer;

export async function getStaticProps() {
  const res = await fetch("http://localhost:3000/questions/list.json"); // Adjust the URL as necessary
  const questions = await res.json();
  return {
    props: {
      questions,
    },
  };
}
