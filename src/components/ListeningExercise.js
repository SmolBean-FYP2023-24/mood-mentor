import { React, useEffect, useState } from "react";
import "./styles/ListeningExercise.css";
import "./styles/audio_player.css";
// eslint-disable-next-line
import { getUrl } from "aws-amplify/storage";
import { pathLabels } from "./data/pathset";
import { Chart } from "chart.js/auto";

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function getRandomAudio(emotionChoice) {
  console.log(emotionChoice);
  var emotions = ["angry", "disgust", "fear", "happy", "neutral", "sad"];
  var chosenEmotion =
    emotionChoice !== ""
      ? emotionChoice
      : emotions[Math.floor(Math.random() * emotions.length)];
  console.log(chosenEmotion);
  var chosenAudio =
    pathLabels[chosenEmotion][
      Math.floor(Math.random() * pathLabels[chosenEmotion].length)
    ];
  chosenAudio =
    "https://cdn.pixabay.com/download/audio/2022/12/19/audio_2043858e7a.mp3?filename=typical-trap-loop-140bpm-129880.mp3";
  return [chosenAudio, chosenEmotion];
}

async function playAudio(setPlayingState, setCorrectAnswer) {
  var x = document.getElementById("audioPlayer");
  if (x.getAttribute("src") === null) {
    var results = getRandomAudio("");
    console.log(results);
    var chosenAudio = results[0];
    setCorrectAnswer(results[1]);
    // IMPORTANT: Commented to reduce costs, do not remove
    // await getUrl({
    //   key: chosenAudio,
    //   options: { accessLevel: "guest" },
    // }).then((res) => {
    //   x.setAttribute("src", res.url.href);
    //   x.play();
    //   x.addEventListener("ended", function () {
    //     setPlayingState(0);
    //     document.getElementById("audioStatus").innerText = "Stopped";
    //   });
    //   setPlayingState(1);
    //   document.getElementById("audioStatus").innerText = "Playing...";
    // });
    await new Promise((resolve) => setTimeout(resolve, 1000)).then((res) => {
      x.setAttribute("src", chosenAudio);
      setPlayingState(1);
      x.play();
      x.addEventListener("ended", function () {
        setPlayingState(0);
        document.getElementById("audioStatus").innerText = "Stopped";
      });
      document.getElementById("audioStatus").innerText = "Playing...";
    });
  } else {
    setPlayingState(1);
    x.play();
    x.addEventListener("ended", function () {
      setPlayingState(0);
      document.getElementById("audioStatus").innerText = "Stopped";
    });
    document.getElementById("audioStatus").innerText = "Playing...";
  }
}

function ListeningExercise() {
  const [updateAnswers, setUpdateAnswers] = useState(false);
  const [ui, setUI] = useState(null);
  const [CurrentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [playingState, setPlayingState] = useState(0);
  function setCorrectAnswer(x) {
    console.log("setting correct answer now:", x);
    setUpdateAnswers(x);
  }
  const emotions = ["happy", "sad", "angry", "disgust", "neutral", "fear"];
  useEffect(() => {
    var emotion_random = [];
    console.log("Hook Called");
    emotion_random = [updateAnswers];
    emotions
      .filter((e) => e !== updateAnswers)
      .forEach((element) => {
        emotion_random.push(element);
      });
    console.log(emotion_random);
    if (playingState === 2) {
      setUI(null);
      setPlayingState(0);
      return;
    }
    if (emotion_random[0] !== false && playingState === 0) {
      var x = shuffle(emotion_random.slice(0, 4)).map((answerOption, index) => {
        return (
          <div
            key={index}
            className="col-12 col-md-6 text-light text-center py-2 py-md-3 my-2 my-md-3"
            role="button"
            onClick={() => {
              handleAnswerButtonClick(answerOption);
            }}
          >
            <div className="bg-dark w-md-75 w-xs-100 mx-auto p-md-3 p-2 rounded justify-content-evenly">
              <span className="badge text-bg-light text-dark flex-fill">
                {String.fromCharCode(97 + index)}
              </span>
              <span className="p-3 flex-fill">{answerOption}</span>
            </div>
          </div>
        );
      });
      setUI(x);
    } else {
      setUI(null);
      console.log("Not Called UI update");
    }
    // eslint-disable-next-line
  }, [playingState]);

  useEffect(() => {
    console.log("setting audio source to null");
    document.getElementById("audioPlayer").removeAttribute("src");
    document.getElementById("audioStatus").innerHTML = "";
    setPlayingState(2);
  }, [CurrentQuestion]);

  let q = [
    "What emotion can you identify in this audio?",
    // "What emotion can you identify in this audio?",
    // "What emotion can you identify in this audio?",
    // "What emotion can you identify in this audio?",
    // "What emotion can you identify in this audio?",
  ];

  const handleAnswerButtonClick = (answerOption) => {
    console.log(answerOption);
    if (answerOption === updateAnswers) {
      setScore(score + 1);
    }
    const nextQuestion = CurrentQuestion + 1;
    if (nextQuestion < q.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
    setUpdateAnswers(false);
  };

  return (
    <div className="w-100 p-0 m-0">
      <div className="container h-100">
        {showScore ? (
          <div className="score-section">
            You scored {score} out of {q.length}
          </div>
        ) : (
          <>
            <div className="row w-100 pt-5 text-center m-auto">
              <div className="col-12 col-md-2">
                <span>
                  Question {CurrentQuestion + 1}/{q.length}
                </span>
              </div>
              <div className="progress-bar col-12 col-md-8 p-0 align-center my-4 my-md-auto mx-auto mx-md-0">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${((CurrentQuestion + 1) / q.length) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="col-12 col-md-2"></div>
            </div>
            <div className="fs-1 py-md-5 py-3 mt-md-5 mx-auto w-100 text-center">
              {q[CurrentQuestion]}
            </div>
            <div
              className="container text-center text-light my-2"
              id="audioHolder"
            >
              <button
                className="btn btn-small btn-dark"
                onClick={function () {
                  playAudio(setPlayingState, setCorrectAnswer);
                }}
              >
                <i
                  className={playingState === 0 ? "fa fa-play" : "fa fa-pause"}
                  aria-hidden="true"
                ></i>
              </button>
              <audio id="audioPlayer"></audio>
              <div id="audioStatus" className="px-3 text-dark"></div>
            </div>
            <div className="answer-section my-4">
              <div className="container">
                <div
                  className="row w-75 m-auto justify-content-evenly my-md-5 my-2"
                  id="answerButtonArea"
                >
                  {ui}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ListeningExercise;
