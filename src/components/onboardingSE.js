import { React, useEffect, useState, useRef } from "react";
import "./styles/ListeningExercise.css";
import { sentences } from "./data/sentences";
import "./styles/expressingExercise.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import RecordRTC from "recordrtc";
import { Buffer } from "buffer";
import * as EBML from "ts-ebml";
import { fetchAuthSession } from "aws-amplify/auth";
import { uploadData, getUrl } from "aws-amplify/storage";
import { getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { dummyData } from "./dummyData";


window.Buffer = window.Buffer || Buffer;
let started = false;
function getRandomSentence(emotionChoice = "") {
  let lowestThreeEmotions = Object.entries(dummyData.listeningAccuracy)
  .sort((a, b) => a[1] - b[1])
  .slice(0, 3)
  .map(entry => entry[0]);

  let chosenEmotion = lowestThreeEmotions[Math.floor(Math.random() * lowestThreeEmotions.length)];

    
  var chosenSentence =
    sentences[chosenEmotion][
      Math.floor(Math.random() * sentences[chosenEmotion].length)
    ];
  var chosenSentiment;
  if (["sad", "angry", "fear", "disgust"].includes(chosenEmotion)) {
    chosenSentiment = "negative";
  } else {
    chosenSentiment = "positive";
  }
  console.log(chosenSentence, chosenSentiment, chosenEmotion);
  return [chosenSentence, chosenSentiment, chosenEmotion];
}

async function isLoggedIn() {
  try {
    const user = await getCurrentUser();
    return user;
  } catch (e) {
    return false;
  }
}

function OnboardingEE() {
  const [x, setX] = useState("");
  const [CurrentQuestion, setCurrentQuestion] = useState(0);
  const [attempt, setAttempt] = useState(1);
  const [accuracy, setAccuracy] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [results, setResults] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [disallowNext, setDisallowNext] = useState(true);
  const [isAdditionalPage, setIsAdditionalPage] = useState(false);
  const [filledCircles, setFilledCircles] = useState(0);
  const [hoveredCircle, setHoveredCircle] = useState(null);
  const navigate = useNavigate();
  let [loginState, setLoginState] = useState({ stateID: 1, user: null });

  async function viewDashboard() {
    if (await isLoggedIn()) {
      navigate("/dashboard");
    }
  }

  useEffect(() => {
    console.log(results);
  }, [results]);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const recorderRef = useRef(null);

  function getSentiment(emotion) {
    if (["sad", "angry", "fear", "disgust"].includes(emotion)) {
      return "negative";
    } else if (emotion === "neutral") {
      return "neutral";
    } else {
      return "positive";
    }
  }
  function findMissingElements(A, B) {
    return A.filter((element) => !B.includes(element));
  }
  useEffect(() => {
    // Request access to the microphone
    navigator.mediaDevices.getUserMedia({ audio: true }).then((mediaStream) => {
      recorderRef.current = RecordRTC(mediaStream, { type: "audio" });
    });
  }, []);
  useEffect(() => {
    var x_labels = [];
    var y_scores = [];
    Array.from(results).forEach((e) => x_labels.push(e.label));
    Array.from(results).forEach((e) => y_scores.push(e.score));
    var missingEmotion = findMissingElements(
      ["sad", "angry", "fear", "disgust", "happy", "neutral"],
      x_labels
    );
    x_labels.push(missingEmotion);
    y_scores.push(0.00000000000000001);
    var s = getSentiment(x_labels[0]);
    if (attempt === 1) {
      // First attempt at the question
      if (showGraph) {
        // Toast after the graph is visible
        if (s === x[1] && x[2] !== x_labels[0]) {
          // if Sentiment is what's asked for, and target emotion does not have the highest rank
          setAccuracy(y_scores[x_labels.findIndex((e) => e === x[2])]); // Set comparing accuracy threshold for improvement
          toast(`Good Job! Now try to increase some ${x[2]} in your speech`, {
            // inform user that sentiments match, but you can improve with the emotion
            icon: "👏",
          });
          setAttempt(2); // Next attempt will be attempt 2
        } else if (x[2] === x_labels[0]) {
          toast("You got it in one go!", {
            // inform user that the emotion was the target emotion
            icon: "👏",
          });
          setAttempt(1); // Next attempt will be attempt 1 for next question
          setDisallowNext(false);
        } else {
          // if the sentiment is not what's asked
          toast("Try Again", {
            icon: "👎",
          });
          setAttempt(2); // Next attempt will be attempt 2
        }
      }
    } else {
      // Second attempt at the question for improvement
      // Two conditions: highest emotion sentiments matching, accuracy threshold comparison
      if (showGraph) {
        // Toast after the graph is visible
        if (s === x[1]) {
          // still the same sentiment as asked
          if (
            accuracy !== null &&
            y_scores[x_labels.findIndex((e) => e === x[2])] > accuracy
          ) {
            // Accuracy of target emotion has improved and accuracy is not null
            setAccuracy(null);
            setAttempt(1);
            toast(`Good Job! You improved!`, {
              icon: "👏",
            });
            setDisallowNext(false);
          } else if (accuracy === null) {
            // The sentiment did not match the last time but did this time
            toast("You get partials", {
              icon: "👏",
            });
            setAttempt(1);
            setCurrentQuestion(CurrentQuestion + 1);
            resetTranscript();
          } else {
            // Couldn't improve accuracy
            toast("You need more practice, whoops!", {
              icon: "👎",
            });
            setAccuracy(null);
            setAttempt(1);
            setCurrentQuestion(CurrentQuestion + 1);
            resetTranscript();
          }
        } else {
          // Failed sentiment matching
          toast("Your sentiments don't match, whoops!", {
            icon: "👎",
          });
          setAttempt(1);
          setAccuracy(null);
          setCurrentQuestion(CurrentQuestion + 1);
          resetTranscript();
        }
      }
    }
    setChartData({
    });
  }, [results, showGraph]);

  const startRecording = () => {
    started = true;
    SpeechRecognition.startListening({ continuous: true });
    recorderRef.current.startRecording();
    startAnimation();
  };

  // eslint-disable-next-line
  const stopRecording = () => {
    stopAnimation();
    started = false;
    SpeechRecognition.stopListening();
    recorderRef.current.stopRecording(() => {
      const blob = recorderRef.current.getBlob();

      // Read the Blob as an ArrayBuffer
      const fileReader = new FileReader();
      fileReader.onloadend = async () => {
        const buffer = fileReader.result;
        console.log(buffer);

        // Decode the EBML
        const decoder = new EBML.Decoder();
        const ebmlElms = decoder.decode(buffer);

        // Read the EBML elements
        const ebmlReader = new EBML.Reader();
        ebmlElms.forEach((elm) => {
          ebmlReader.read(elm);
        });
        ebmlReader.stop();

        // Make the metadata seekable
        const refinedMetadataBuf = EBML.tools.makeMetadataSeekable(
          ebmlReader.metadatas,
          ebmlReader.duration,
          ebmlReader.cues
        );

        // Create a new Blob with the refined metadata
        const body = new Uint8Array(buffer.slice(ebmlReader.metadataSize));
        const newBlob = new Blob([refinedMetadataBuf, body], {
          type: "audio/wav",
        });

        try {
          const result = await uploadData({
            key: "audio.wav",
            data: new File([newBlob], "audio.wav"),
            options: {
              accessLevel: "private",
            },
          }).result;
          console.log("Succeeded: ", result);
          await analyze();
        } catch (error) {
          console.log("Error : ", error);
        }
      };
      fileReader.readAsArrayBuffer(blob);
    });
  };

  useEffect(() => {
    if (!listening && started) {
      stopRecording();
    }
  }, [listening, stopRecording]);

  useEffect(() => {
    setX(getRandomSentence());
  }, [CurrentQuestion]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  function startAnimation() {
    const shrinkGrow = [
      { transform: "scale(0.75)" },
      { transform: "scale(1)" },
      { transform: "scale(0.75)" },
    ];
    const timing = {
      duration: 750,
      iterations: Infinity,
    };
    document.getElementById("omic").animate(shrinkGrow, timing);
  }

  function stopAnimation() {
    document
      .getElementById("omic")
      .getAnimations()
      .forEach((element) => {
        element.cancel();
      });
  }

  async function analyze() {
    const user = await fetchAuthSession();
    var myHeaders = new Headers();
    myHeaders.append("Authorization", user.tokens.idToken.toString());
    myHeaders.append("Content-Type", "application/json");
    console.log(user.tokens.idToken.toString());
    var urll;
    await getUrl({
      key: "audio.wav",
      options: {
        accessLevel: "private",
      },
    }).then((res) => (urll = res.url.href));
    var raw = {
      audio_file: urll,
    };

    console.log(raw);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: "follow",
    };

    await fetch(
      "https://0ikothkm27.execute-api.us-west-2.amazonaws.com/default/audio_analyze/",
      requestOptions
    )
      .then(
        (response) => {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        },
        (err) => console.log(err)
      )
      .then((result) => {
        setResults(result);
        setShowGraph(true);
        console.log(result);
      });
  }
  const pages =  [...Array(5)];

  let q = [
    // "Speak the sentence in a",
    // "Speak the sentence in a",
    // "Speak the sentence in a",
    // "Speak the sentence in a",
    // "Speak the sentence in a",
  ];
  // setFilledCircles(4);

  return (
    <div className="w-100 p-0 m-0">
      <Toaster position="bottom-center" reverseOrder={false} />
      <div className="container h-100 p-0 p-sm-auto">
        {showScore ? (
          <span>Show Score</span>
        ) : CurrentQuestion < q.length ? (
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
              <h5>
                {q[CurrentQuestion]}&nbsp;&nbsp;
                <span className="badge bg-dark">{x[1]}</span>&nbsp; emotion
              </h5>
              <br></br>
              <span className="typeAnimate">{x[0]}</span>
            </div>
            <div className="m-auto text-center w-100">
              <button
                className="btn btn-mic btn-dark btn-md"
                id="omic"
                onClick={!listening ? startRecording : stopRecording}
              >
                <i className="fa fa-microphone" aria-hidden="true"></i>
              </button>
            </div>
            <br></br>
            <button
              className="btn btn-large btn-dark"
              onClick={() => {
                console.log("next ques");
                setCurrentQuestion(CurrentQuestion + 1);
                resetTranscript();
                setDisallowNext(true);
              }}
              disabled={disallowNext}
              id="nextQuesBtn"
            >
              Next
            </button>
          </>
        ): (
          <div>
            <div className="progress-bar-container">
              {pages.map((page, index) => (
                <div
                  key={index}
                  className={`progress-bar-circle ${index < filledCircles ? 'filled' : 'filled'} ${index === hoveredCircle ? 'hovered' : ''}`}
                ></div>
              ))}
            </div>
            <div>
              <div className="plane-container">
              <img
                src="https://imgur.com/VdtQTCy.png"
                alt="Paper Plane"
                className="plane"
              />
              </div>
              <div className="journey-text-onboarding">
              Let's begin your journey in the world of Mood-Mentor!
              </div>
            </div>
            <button
              className={`${
                loginState.stateID === 0
                  ? "d-none"
                  : "btn-onboarding"
              }`}
              onClick={viewDashboard}
              id="btn btn-primary"
            >
              Let's Go
            </button>
            <div>
            <img src="https://imgur.com/eAMqj2N.png" alt="Joy and Sadness" className="grpPic-Onboarding"/>
            </div>
          </div>
          )}
      </div>
    </div>
  );
}

export default OnboardingEE;
