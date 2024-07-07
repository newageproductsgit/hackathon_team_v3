import React, { useState, useEffect, useRef } from "react";
import styles from "../../question.module.css";
import { useRouter } from "next/router";
const option_names = ["A: ", "B: ", "C: ", "D: "];
const GameQuestionContainer = ({ questions }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [disableTimer, setDisableTimer] = useState(false);
  const [showRestartPopup, setshowRestartPopup] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [current_question_data, setCurrentQuestionData] = useState(null);
  const [gameLevel, setGameLevel] = useState(1);
  const [gamePrize, setGamePrize] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState([]);

  const [flip_q_used, setFlipQuestionUsed] = useState(false);
  const [fifty_fifty_used, setFiftyFiftyUsed] = useState(false);
  const [fifty_fifty_disabled_indices, setFiftyFiftyDisabledIndices] = useState(
    []
  );
  const [show_aud_poll_modal, setShowAudiPollModal] = useState(false);
  const [aud_poll_used, setAudiencePollUsed] = useState(false);
  const [audi_poll_result, setAudiPollResult] = useState([]);

  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const easyQuestions = questions[0]?.easy || [];
  const mediumQuestions = questions[1]?.medium || [];
  const hardQuestions = questions[2]?.hard || [];

  const router = useRouter();
  useEffect(() => {
    if (!disableTimer) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setshowRestartPopup(true);
            clearInterval(timer);
          }
          return prevTime > 0 ? prevTime - 1 : 0;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, disableTimer]);

  useEffect(() => {
    fetchRandomQuestion(1);
  }, []);
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message = "Are you sure you want to leave?";
      event.preventDefault();
      event.returnValue = message; // For most modern browsers
      return message; // For some older browsers
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  const fetchRandomQuestion = (gameLevel, flipQuestion = false) => {
    let questionSet;
    let previous_questions = questionsAsked;
    if (gameLevel <= 5) {
      questionSet = easyQuestions;
    } else if (gameLevel < 10) {
      questionSet = mediumQuestions;
    } else {
      questionSet = hardQuestions;
    }

    if (
      (gameLevel == 1 && !flipQuestion) ||
      gameLevel == 6 ||
      gameLevel == 11 ||
      gameLevel == 15
    ) {
      previous_questions = [];
    }
    console.log(gameLevel, previous_questions);
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * questionSet.length);
    } while (previous_questions.includes(randomIndex));

    const newQuestion = questionSet[randomIndex];
    if (newQuestion) {
      setCurrentQuestionData(newQuestion);
      setQuestion(newQuestion.question);
      setOptions(newQuestion.options);
      setAnswer(newQuestion.answer);
      setQuestionsAsked([...previous_questions, randomIndex]);
    } else {
      console.error("No valid question found at random index.");
    }
  };
  async function resetLifelines() {
    setFiftyFiftyUsed(false);
    setFiftyFiftyDisabledIndices([]);
    setAudiencePollUsed(false);
    setFlipQuestionUsed(false);
    setAudiencePollUsed(false);
  }
  const handleRestart = () => {
    // setTimeLeft(60);
    // resetLifelines();
    // setshowRestartPopup(false);
    // setGameLevel(1);
    // setGamePrize(0);
    // setQuestionsAsked([]);
    // fetchRandomQuestion(1);
    router.replace("/");
  };
  function getFourNumbersSummingTo100() {
    // Generate three random numbers between 1 and 98
    const num1 = Math.floor(Math.random() * 98) + 1;
    const num2 = Math.floor(Math.random() * (99 - num1)) + 1;
    const num3 = Math.floor(Math.random() * (100 - num1 - num2)) + 1;

    // Calculate the fourth number
    const num4 = 100 - num1 - num2 - num3;

    setAudiPollResult([num1, num2, num3, num4]);
  }

  const handleOptionClick = (selectedAnswer) => {
    if (selectedAnswer === answer) {
      setTimeout(() => {
        setFiftyFiftyDisabledIndices([]);
        setTimeLeft(60);
        setGameLevel((prevLevel) => prevLevel + 1);
        setGamePrize((prevPrize) => {
          switch (gameLevel) {
            case 1:
              return 1000;
            case 2:
              return 2000;
            case 3:
              return 3000;
            case 4:
              return 5000;
            case 5:
              return 10000;
            case 6:
              return 20000;
            case 7:
              return 40000;
            case 8:
              return 80000;
            case 9:
              return 160000;
            case 10:
              return 320000;
            case 11:
              return 640000;
            case 12:
              return 125000;
            case 13:
              return 250000;
            case 14:
              return 500000;
            case 15:
              return 1000000;
            // Add more cases as per your game's prize structure
            default:
              return prevPrize;
          }
        });
        if (gameLevel + 1 == 6) {
          console.log("now schanging timer", gameLevel);
          setTimeLeft(30);
        }
        if (gameLevel + 1 == 11) {
          setDisableTimer(true);
        }
        if (gameLevel == 15) {
          setShowWinnerModal(true);
          return;
        }
        fetchRandomQuestion(gameLevel + 1);
      }, 1000); // Delay to prevent rapid state updates
    } else {
      // Handle incorrect answer logic if needed
      // For example, end game or show modal
      let prize =
        gameLevel + 1 == 1
          ? 0
          : gameLevel + 1 < 5
          ? 1000
          : gameLevel + 1 < 10
          ? 10000
          : 320000;
      setGamePrize(prize);
      setshowRestartPopup(true);
    }
  };

  async function executeFiftyFiftyLifeline() {
    let answer_index = current_question_data.answer_index;
    console.log("answer index", answer_index);
    if (answer_index != undefined) {
      let disabled_options = [];
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * 4);
        if (
          randomIndex != answer_index &&
          !disabled_options.includes(randomIndex)
        ) {
          disabled_options.push(randomIndex);
        }
      } while (disabled_options.length < 2);
      console.log(answer_index, disabled_options);
      setFiftyFiftyDisabledIndices(disabled_options);
    }
  }
  return (
    <>
      <div
        className={`${styles.gameContainer} ${
          showRestartPopup || showWinnerModal || show_aud_poll_modal
            ? styles.blur
            : ""
        }`}
      >
        <div className={`${styles.timer} ${styles.glassContainer}`}>
          {disableTimer ? "no time limit" : `Time left - ${timeLeft} seconds`}
        </div>
        <div className={styles.glassContainer}>
          <h1 className={styles.title}>Question {gameLevel}/15</h1>
          <div className={styles.prizeLevel}>
            Prize won: ${gamePrize.toLocaleString()}
          </div>
        </div>
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
                  } ${
                    fifty_fifty_disabled_indices.includes(index)
                      ? styles.disabled_option
                      : ""
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option_names[index]}
                  {option}
                </button>
              ))}
            </div>
            <div
              className={styles.lifeLineHeader}
            >
              Got stuck? Use your life lines!
            </div>
            <div className={styles.lifelines}>
              <button
                className={`${styles.lifelineBtn} ${
                  fifty_fifty_used ? styles.disabledLifeline : ""
                }`}
                data-hover-text="Removes two wrong answers"
                onClick={() => {
                  executeFiftyFiftyLifeline();
                  setFiftyFiftyUsed(true);
                }}
              >
                50:50
              </button>
              <button
                className={`${styles.lifelineBtn} ${
                  flip_q_used ? styles.disabledLifeline : ""
                }`}
                data-hover-text="Answer another question"
                onClick={() => {
                  fetchRandomQuestion(gameLevel, true);
                  setFlipQuestionUsed(true);
                  setFiftyFiftyDisabledIndices([]);
                }}
              >
                Flip the question
              </button>
              <button
                className={`${styles.lifelineBtn} ${
                  aud_poll_used ? styles.disabledLifeline : ""
                }`}
                data-hover-text="Ask the audience for help"
                onClick={() => {
                  setShowAudiPollModal(true);
                  getFourNumbersSummingTo100();
                  setAudiencePollUsed(true);
                }}
              >
                Ask the Audience
              </button>
            </div>
          </main>
        </div>
      </div>
      {showRestartPopup && (
        <div aria-hidden="true" className={styles.overlay}>
          <div className={styles.centeredDiv}>
            <div className={styles.modalHeader}>
              <p className={styles.p1}>Game Over!</p>
              <hr />
              <p className={styles.p2}>
                <b>Answer is: {current_question_data?.answer}</b>
              </p>
              <hr />
              <p className={styles.p2}>Better luck next time!</p>
              <p className={styles.p3}>
                Prize won: ${gamePrize.toLocaleString()}
              </p>
              <p className={styles.p3}>
                <a
                  style={{ textDecoration: "underline", color: "gold" }}
                  target="blank"
                  href="https://indianmemetemplates.com/wp-content/uploads/meri-taraf-mat-dekhiye-main-aapki-koi-sahayata-nahi-kar-paunga.jpg"
                >
                  Withdraw money now!
                </a>
              </p>
            </div>
            <button onClick={handleRestart} className="button-1">
              Restart Game
            </button>
          </div>
        </div>
      )}
      {showWinnerModal && (
        <div aria-hidden="true" className={styles.overlay}>
          <div className={styles.centeredDiv}>
            <div className={styles.modalHeader}>
              <p className={styles.p1}>You won!</p>
              <hr />
              <p className={styles.p3}>
                Prize won: ${gamePrize.toLocaleString()}
              </p>
              <p className={styles.p3}>
                <a
                  style={{ textDecoration: "underline", color: "gold" }}
                  target="blank"
                  href="https://indianmemetemplates.com/wp-content/uploads/meri-taraf-mat-dekhiye-main-aapki-koi-sahayata-nahi-kar-paunga.jpg"
                >
                  Withdraw money now!
                </a>
              </p>
            </div>
            <button onClick={handleRestart} className="button-1">
              Exit
            </button>
          </div>
        </div>
      )}
      {show_aud_poll_modal && (
        <div aria-hidden="true" className={styles.overlay}>
          <div className={styles.centeredDiv}>
            <div className={styles.modalHeader}>
              <p className={styles.p1}>Audience Poll Result!</p>
              <table
                border="1px solid gold"
                style={{ textAlign: "center", width: "100%" }}
              >
                <tr>
                  <th>Option</th>
                  <th>Vote in %</th>
                </tr>
                <tr>
                  <td>A:</td>
                  <td>
                    <p className={styles.p2}>
                      {audi_poll_result[0] + "%" ?? "25%"}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>B:</td>
                  <td>
                    <p className={styles.p2}>
                      {audi_poll_result[1] + "%" ?? "25%"}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>C:</td>
                  <td>
                    <p className={styles.p2}>
                      {audi_poll_result[2] + "%" ?? "25%"}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>D:</td>
                  <td>
                    <p className={styles.p2}>
                      {audi_poll_result[3] + "%" ?? "25%"}
                    </p>
                  </td>
                </tr>
              </table>
            </div>
            <button
              onClick={() => {
                setShowAudiPollModal(false);
              }}
              className="button-1"
            >
              <b>CLOSE</b>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GameQuestionContainer;

export async function getStaticProps() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://hackathon-team-v3-3xcv.vercel.app";
  const res = await fetch(`${baseUrl}/questions/list.json`); // Adjust the URL as necessary
  const questions = await res.json();
  return {
    props: {
      questions,
    },
  };
}
