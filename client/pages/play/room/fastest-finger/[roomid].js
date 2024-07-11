import React, { useState, useEffect, useRef } from "react";
import styles from "../../question.module.css";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import { initSocket } from "@/lib/socket_client";
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
  const [showLoserModal, setShowLoserModal] = useState(false);
  const [showFFWinnerName, setFFWinnerName] = useState(false);

  const [show_rules_modal, setShowRulesModal] = useState(false);

  const [showInvalidModal, setShowInvalidModal] = useState(false);

  const [correct_answers, setCorrectAnswers] = useState(0);
  const [wrong_answers, setWrongAnswers] = useState(0);

  const bgaudioRef = useRef(null);
  const audioLostRef = useRef(null);
  const audioWonRef = useRef(null);

  const [socket, setSocket] = useState(null);
  const [socketID, setSocketID] = useState("");
  const [username, setUsername] = useState(null);
  const [roomName, setRoomName] = useState(null);

  const easyQuestions = questions[0]?.easy || [];
  const mediumQuestions = questions[1]?.medium || [];
  const hardQuestions = questions[2]?.hard || [];
  const router = useRouter();
  const { roomid } = router.query;
  async function checkRoom(room) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/check-room/${room}`
      );
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("Error checking room:", error);
      return false;
    }
  }
  useEffect(() => {
    // const fetchRoomStatus = async () => {
    //   const exists = await checkRoom(roomid);
    //   if (!exists) {
    //     setShowInvalidModal(true);
    //     setDisableTimer(true);
    //   } else {
    //     console.log("setting room as", roomid);
    //     setRoomName(roomid);
    //   }
    // };

    // fetchRoomStatus();
    const newSocket = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
      forceNew: true,
      closeOnBeforeunload: false,
      autoConnect: true,
    });
    // const newSocket = initSocket();
    setSocket(newSocket);
    newSocket.on("connect", () => {
      setSocketID(newSocket.id);
      console.log("connected from ff page", newSocket.id);
    });
    newSocket.on("disconnect", () => {
      console.log("socket gone"); // false
    });
    newSocket.on("receive-message", (data) => {
      setSocketID(newSocket.id);
      console.log("data");
    });
    newSocket.on("receive-ff-winner", (data) => {
      if (!showWinnerModal) {
        setShowLoserModal(true);
      }
      setFFWinnerName(data.username);
      setDisableTimer(true);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [showWinnerModal]);
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
    let user_name = window?.localStorage.getItem("kbc_name");
    if (user_name) {
      setUsername(user_name);
      if (roomid != null && username !== null) {
        socket.emit("join-room", { room: roomid, username });
      }
    } else {
      setShowInvalidModal(true);
      setDisableTimer(true);
    }
  }, [roomName, username]);
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
  const playBGAudio = async () => {
    if (bgaudioRef.current) {
      try {
        bgaudioRef.current.volume = "0.2";
        await bgaudioRef.current.play();
      } catch (err) {
        console.error("Failed to play audio", err);
      }
    }
  };

  const playLostAudio = async () => {
    if (audioLostRef.current) {
      try {
        audioLostRef.current.volume = "0.5";
        await audioLostRef.current.play();
      } catch (err) {
        console.error("Failed to play audio", err);
      }
    }
  };
  const playWonAudio = async () => {
    if (audioWonRef.current) {
      try {
        audioWonRef.current.volume = "0.5";
        await audioWonRef.current.play();
      } catch (err) {
        console.error("Failed to play audio", err);
      }
    }
  };
  const fetchRandomQuestion = (gameLevel, flipQuestion = false) => {
    let questionSet;
    let previous_questions = questionsAsked;
    if (gameLevel <= 5) {
      setTimeLeft(60);
      questionSet = easyQuestions;
    } else if (gameLevel < 10) {
      setTimeLeft(30);
      questionSet = mediumQuestions;
    } else {
      setDisableTimer(true);
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
    router.replace(`/`);
  };
  const handleWin = () => {
    // setTimeLeft(60);
    // resetLifelines();
    // setshowRestartPopup(false);
    // setGameLevel(1);
    // setGamePrize(0);
    // setQuestionsAsked([]);
    // fetchRandomQuestion(1);
    router.replace(`/play/room/game/${roomid}`);
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
        setCorrectAnswers((correct_answers) => correct_answers + 1);
        setFiftyFiftyDisabledIndices([]);
        // setTimeLeft(60);
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
        // if (gameLevel + 1 == 6) {
        //   console.log("now schanging timer", gameLevel);
        //   setTimeLeft(30);
        // }
        // if (gameLevel + 1 == 11) {
        //   setDisableTimer(true);
        // }
        if (gameLevel == 5) {
          // emitWinnerEvent();
          setShowWinnerModal(true);
          setDisableTimer(true);
          window?.localStorage.setItem("ffwinner", true);

          if (roomid && username) {
            socket.emit("fastest-finger-winner", {
              room: roomid,
              username,
            });
          }
          playWonAudio();
          return;
        }
        fetchRandomQuestion(gameLevel + 1);
      }, 500); // Delay to prevent rapid state updates
    } else {
      setWrongAnswers((wrong_answers) => wrong_answers + 1);
      // Handle incorrect answer logic if needed
      // For example, end game or show modal
      playLostAudio();
      let prize =
        gameLevel + 1 == 1
          ? 0
          : gameLevel + 1 <= 5
          ? 1000
          : gameLevel + 1 <= 10
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
      {showInvalidModal ? (
        <div aria-hidden="true" className={styles.overlay}>
          <div className={styles.centeredDiv}>
            <div className={styles.modalHeader}>
              <p className={styles.p1}>Invalid Link!</p>
            </div>
            <button onClick={handleRestart} className="button-1">
              Main Page
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={playBGAudio}
          className={`${styles.gameContainer} ${
            showRestartPopup ||
            showWinnerModal ||
            show_aud_poll_modal ||
            showLoserModal
              ? styles.blur
              : ""
          }`}
        >
          <audio
            ref={bgaudioRef}
            src={`/assets/ff.mp3`}
            controls
            loop
            hidden
          />
          <audio ref={audioLostRef} src={`/assets/lost.mp3`} controls hidden />
          <audio
            ref={audioWonRef}
            src={`/assets/kbc-awesome-5410.mp3`}
            controls
            hidden
          />
          <div className={`${styles.timer} ${styles.glassContainer}`}>
            {disableTimer ? "no time limit" : `Time left - ${timeLeft} seconds`}
          </div>
          <div className={`${styles.username_tile} ${styles.glassContainer}`}>
            Playing as: {username}
          </div>
          <div className={styles.glassContainer}>
            <h1 className={styles.title}>Question {gameLevel}/15</h1>
            {/* <div className={styles.prizeLevel}>
          Prize won: ${gamePrize.toLocaleString()}
        </div> */}
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
              {/* <div className={styles.lifeLineHeader}>
            Got stuck? Use your life lines!
          </div> */}
              {/* <div className={styles.lifelines}>
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
          </div> */}
              <div
                style={{
                  textAlign: "center",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                <p
                  onClick={() => {
                    setShowRulesModal(true);
                  }}
                >
                  Show rules
                </p>
              </div>
            </main>
          </div>
        </div>
      )}

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
      {showLoserModal && (
        <div aria-hidden="true" className={styles.overlay}>
          <div className={styles.centeredDiv}>
            <div className={styles.modalHeader}>
              <p className={styles.p1}>You lost the fastest finger round!</p>
              <hr />
              <p className={styles.p3}>
                You are not qualified for the hotseat!
              </p>
              <p className={styles.p3}>{showFFWinnerName} won this round!</p>
              <p className={styles.p3}>
                <a
                  style={{ textDecoration: "underline", color: "gold" }}
                  target="blank"
                  href="https://indianmemetemplates.com/wp-content/uploads/meri-taraf-mat-dekhiye-main-aapki-koi-sahayata-nahi-kar-paunga.jpg"
                >
                  What amitabh has to say?
                </a>
              </p>
            </div>
            <button onClick={handleRestart} className="button-1">
              Continue
            </button>
          </div>
        </div>
      )}
      {showWinnerModal && (
        <div aria-hidden="true" className={styles.overlay}>
          <div className={styles.centeredDiv}>
            <div className={styles.modalHeader}>
              <p className={styles.p1}>You won the fastest finger!</p>
              <hr />
              <p className={styles.p3}>
                You are now qualified for the hotseat!
              </p>
              {/* <p className={styles.p3}>
                <a
                  style={{ textDecoration: "underline", color: "gold" }}
                  target="blank"
                  href="https://indianmemetemplates.com/wp-content/uploads/meri-taraf-mat-dekhiye-main-aapki-koi-sahayata-nahi-kar-paunga.jpg"
                >
                  Withdraw money now!
                </a>
              </p> */}
            </div>
            <button onClick={handleWin} className="button-1">
              Continue
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
      {show_rules_modal && (
        <div aria-hidden="true" className="overlay">
          <div className="centeredDiv">
            <div
              className="backbutton"
              style={{
                position: "absolute",
                right: "0",
                margin: "5px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => {
                setShowRulesModal(false);
              }}
            >
              close
            </div>
            <div className="modalHeader">
              <p className="p1">RULES</p>
              <hr />
              <p
                className="p2"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  flexDirection: "column",
                }}
              >
                <p className="p2">Points table</p>
                <table>
                  <tr
                    style={{
                      color: "gold",
                      background: "rgba(255, 217, 0, 0.418)",
                    }}
                  >
                    <td>15</td>
                    <td>1 crore</td>
                  </tr>
                  <tr>
                    <td>14</td>
                    <td>50,00,000</td>
                  </tr>
                  <tr>
                    <td>13</td>
                    <td>25,00,000</td>
                  </tr>
                  <tr>
                    <td>12</td>
                    <td>12,50,000</td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td>6,40,000</td>
                  </tr>
                  <tr
                    style={{
                      color: "gold",
                      background: "rgba(255, 255, 255, 0.418)",
                    }}
                  >
                    <td>10</td>
                    <td>3,20,000</td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>1,60,000</td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>80,000</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>40,000</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>20,000</td>
                  </tr>
                  <tr
                    style={{
                      color: "gold",
                      background: "rgba(255, 255, 255, 0.418)",
                    }}
                  >
                    <td>5</td>
                    <td>10,000</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>5,000</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>3,000</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>2,000</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>1,000</td>
                  </tr>
                </table>

                <div>
                  <p className="p2">Life Lines</p>
                  <ul>
                    <li>
                      Fifty-Fifty: Removes two incorrect options from the
                      choices.
                    </li>
                    <li>
                      Flip the question: Allows you to change the current
                      question to a new one.
                    </li>
                    <li>
                      Audience Poll: Shows the percentage of the audience that
                      chose each option.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="p2">Timer rules</p>
                  <ul>
                    <li>
                      Fastest Finger round: 60 seconds to answer 5 questions.
                      First one with all correct answers win.
                    </li>
                    <li>
                      Hotseat round: <br />
                      1. 60 seconds each for 1st five questions.
                      <br />
                      2. 30 seconds each for next five questions. <br />
                      3. No time limit for last five questions.
                    </li>
                  </ul>
                </div>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameQuestionContainer;

export async function getServerSideProps() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://hackathon-team-v3-3xcv.vercel.app";
  const res = await fetch(`${baseUrl}/questions/fastest-finger.json`); // Adjust the URL as necessary
  const questions = await res.json();
  return {
    props: {
      questions,
    },
  };
}
