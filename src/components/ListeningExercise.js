import { React, useState } from "react";
import "./styles/ListeningExercise.css";
import { questions } from "./data/questions_dummy";
function ListeningExercise() {
  let q = questions;

  const emotions = {
    1: "neutral",
    2: "happy",
    3: "sad",
    4: "angry",
    5: "fear",
    6: "disgust",
  };

  const emotion_random = [];

  function generateUniqueEmotions() {
    const emotion_temp = [];
    emotion_temp.push("neutral");
    const min = 1;
    const max = 6;
    const count = 4;

    const keyForNeutral = Object.entries(emotions).find(
      ([key, value]) => value === "neutral"
    )[0];

    while (emotion_temp.length < count) {
      const random_num = Math.floor(Math.random() * (max - min + 1)) + min;

      if (random_num === keyForNeutral) {
        continue;
      }

      if (!emotion_temp.includes(emotions[random_num])) {
        emotion_temp.push(emotions[random_num]);
      }
    }

    let shuffle_count = 4;
    const random_nums = [];
    while (shuffle_count > 0) {
      const random_num = Math.floor(Math.random() * (3 - 0 + 1)) + 0;

      if (!random_nums.includes(random_num)) {
        random_nums.push(random_num);
        shuffle_count--;
      }
    }

    for (let i = 0; i < random_nums.length; i++) {
      emotion_random[i] = emotion_temp[random_nums[i]];
    }
    return emotion_random;
  }

  generateUniqueEmotions();

  const [CurrentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerButtonClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    const nextQuestion = CurrentQuestion + 1;
    if (nextQuestion < q.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="container">
      {showScore ? (
        <div className="score-section">
          You scored {score} out of {questions.length}
        </div>
      ) : (
        <>
          <div className="row w-100 pt-5 text-center m-auto">
            <div className="col-12 col-md-2">
              <span>
                Question {CurrentQuestion + 1}/{questions.length}
              </span>
            </div>
            <div className="progress-bar col-12 col-md-8 p-0 align-center my-4 my-md-auto mx-auto mx-md-0">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${((CurrentQuestion + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
            <div className="col-12 col-md-2"></div>
          </div>
          <div className="fs-1 py-md-5 py-3 mt-md-5 mx-auto w-100 text-center">
            {questions[CurrentQuestion].questionText}
          </div>
          <div className="answer-section">
            <div className="container">
              <div className="row w-75 m-auto justify-content-evenly my-md-5 my-2">
                {emotion_random.map((answerOption, index) => (
                  <div
                    key={index}
                    className="col-12 col-md-6 text-light text-center py-3 my-2 my-md-3"
                    role="button"
                    onClick={() =>
                      handleAnswerButtonClick(answerOption.isCorrect)
                    }
                  >
                    <div className="bg-dark p-md-3 p-2 rounded justify-content-evenly">
                      <span className="badge text-bg-light text-dark flex-fill">
                        {String.fromCharCode(97 + index)}
                      </span>
                      <span className="p-3 flex-fill">{answerOption}</span>
                    </div>
                  </div>
                ))}
                {/* <div
                  className="col-12 col-md-4 bg-dark rounded text-light text-center py-3 my-2 my-md-0"
                  role="button"
                >
                  <span className="badge text-bg-light text-dark p-2">#</span>
                  &emsp;<span className="p-3">Hello</span>
                </div> */}
              </div>
              {/* <div className="row w-75 m-auto justify-content-evenly my-md-5 my-2">
                <div
                  className="col-12 col-md-4 bg-dark rounded text-light text-center py-3 my-2 my-md-0"
                  role="button"
                >
                  <span className="badge text-bg-light text-dark p-2">#</span>
                  &emsp;<span className="p-3">Hello</span>
                </div>
                <div
                  className="col-12 col-md-4 bg-dark rounded text-light text-center py-3 my-2 my-md-0"
                  role="button"
                >
                  <span className="badge text-bg-light text-dark p-2">#</span>
                  &emsp;<span className="p-3">Hello</span>
                </div>
              </div> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ListeningExercise;
