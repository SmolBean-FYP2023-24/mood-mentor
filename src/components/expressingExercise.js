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
import { withAuthenticator } from "@aws-amplify/ui-react";
import { uploadData, getUrl } from "aws-amplify/storage";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import toast, { Toaster } from "react-hot-toast";
import { dummyData } from "./dummyData";
import { useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/api";
import * as mutations from "../graphql/mutations.js";
import { getUserDataModel } from "../graphql/queries.js";

// ---------------------------------------------------------------

// Add Database Abilities

// ---------------------------------------------------------------

const client = generateClient();

function removeTypenameKey(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(removeTypenameKey);
  }

  const newObj = {};
  for (const key in obj) {
    if (key !== "__typename") {
      newObj[key] = removeTypenameKey(obj[key]);
    }
  }
  return newObj;
}

function removeKeys(obj, keys) {
  const newObj = { ...obj };
  keys.forEach((key) => {
    delete newObj[key];
  });
  return newObj;
}

const updateData = async (user) => {
  try {
    const keysToRemove = [
      "__typename",
      "_deleted",
      "_lastChangedAt",
      "createdAt",
      "updatedAt",
    ];

    const cleanedUserData = removeKeys(user, keysToRemove);

    const cleanedUser = {
      data: {
        getUserDataModel: removeTypenameKey(cleanedUserData),
      },
    };
    console.log("cleaned user", cleanedUser);
    await client.graphql({
      query: mutations.updateUserDataModel,
      variables: {
        input: cleanedUser.data.getUserDataModel,
      },
    });
  } catch (error) {
    // end of try
    console.error("Error updating user", error);
    return null;
  }
};

const getUserData = async () => {
  try {
    const userauth = await fetchAuthSession();
    const response = await client.graphql({
      query: getUserDataModel,
      variables: {
        username: userauth.tokens.accessToken.payload.sub, // extracting based on username
      },
    });

    const userDataModel = response.data.getUserDataModel;
    console.log("User data model:", userDataModel);
    // console.lo
    // ("this is the console log wiht user_Data",response.data)

    return userDataModel;
    // Process the user data model as needed
  } catch (error) {
    console.error("Error retrieving user data model:", error);
    return null;
  }
};

let datamodel;
let emotionAccuracy;
let emotionCorrect;
let updateComplete;
let updatePartial;

// ------------------------------------
// Code for Expressing Exercise
// ------------------------------------
ChartJS.register(ArcElement, Tooltip, Legend);

window.Buffer = window.Buffer || Buffer;
let started = false;

// ------------------------------------
// Recommendation System
// ------------------------------------
function getRandomSentence(emotionChoice = "") {
  var emotions = ["happy", "sad", "angry", "disgust", "fear"];
  var entries = dummyData.SpeakingAccuracy;
  var convertedEntries = {};
  for (var key in entries) {
    var lowercaseKey = key.toLowerCase();
    var value = entries[key];
    convertedEntries[lowercaseKey] = value;
  }
  let lowestThreeEmotions = Object.entries(convertedEntries)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map((entry) => entry[0]);

  if (lowestThreeEmotions.includes("neutral")) {
    const fourthLowestAccuracy = Object.entries(convertedEntries)
      .sort((a, b) => a[1] - b[1])
      .slice(3, 4)
      .map((entry) => entry[0])[0];
    lowestThreeEmotions[lowestThreeEmotions.indexOf("neutral")] =
      fourthLowestAccuracy;
  }

  let chosenEmotion =
    lowestThreeEmotions[Math.floor(Math.random() * lowestThreeEmotions.length)];
  console.log("Chosen emotion", chosenEmotion);
  emotionCorrect = chosenEmotion;

  // updating chosen emotion to compare accuracy and push to databasw

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

function ExpressingExercise() {
  const [x, setX] = useState("");
  const [CurrentQuestion, setCurrentQuestion] = useState(0);
  const [attempt, setAttempt] = useState(1);
  const [accuracy, setAccuracy] = useState(null);
  // eslint-disable-next-line
  const [showScore, setShowScore] = useState(false);
  // eslint-disable-next-line
  const [score, setScore] = useState(0);
  const [partial, setPartial] = useState(0);
  const [results, setResults] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [disallowNext, setDisallowNext] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(results);
  }, [results]);
  const {
    // transcript,
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
    console.log(missingEmotion[0]);
    x_labels.push(missingEmotion[0]);
    y_scores.push(0);
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
          // setDisallowNext(false);
          setCurrentQuestion(CurrentQuestion + 1);
          resetTranscript();
          setScore(score + 1);
          updateComplete = true;
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
            // setDisallowNext(false);
            setCurrentQuestion(CurrentQuestion + 1);
            resetTranscript();
            setPartial(partial + 1);
            updatePartial = true;
          } else if (accuracy === null) {
            // The sentiment did not match the last time but did this time
            toast("You get partials", {
              icon: "👏",
            });
            setAttempt(1);
            setCurrentQuestion(CurrentQuestion + 1);
            resetTranscript();
            setPartial(partial + 1);
            updatePartial = true;
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
      labels: x_labels,
      datasets: [
        {
          label: "Predictions",
          data: y_scores,
          // backgroundColor: [`rgb(134, 77, 240)`],
          backgroundColor: "#3C5973",
        },
      ],
    });

    // console.log("Emotion accuracy at x label [0]", emotionCorrect);
    // eslint-disable-next-line
  }, [results, showGraph]);

  const startRecording = () => {
    started = true;
    SpeechRecognition.startListening({ continuous: true });
    // document.getElementById("analysisBtn").disabled = true;
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

        // Create a URL for the new Blob
        // const url = URL.createObjectURL(newBlob);

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
          // await getUrl({
          //   key: "audio.wav",
          //   options: {
          //     accessLevel: "private",
          //   },
          // }).then((res) => console.log(res.url.href));
          // document.getElementById("analysisBtn").disabled = false;
        } catch (error) {
          console.log("Error : ", error);
        }

        // Create a link for downloading the audio file
        // const link = document.createElement("a");
        // link.href = url;
        // link.download = "audio.wav";
        // link.click();
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
      });

    // Updating DB from here

    datamodel = await getUserData();
    let final_result = results;

    console.log("datamodel before updates", datamodel);

    // console.log("final result:-----", final_result);

    if (updateComplete) {
      const emotionUpdateCnt =
        emotionCorrect.charAt(0).toUpperCase() + emotionCorrect.slice(1);
      final_result.forEach((result) => {
        if (result.label === emotionCorrect) {
          emotionAccuracy = result.score;
        }
      });

      for (let emotion in datamodel.SpeakingAccuracy) {
        if (emotionCorrect === "neutral") {
          datamodel.SpeakingQuestions["Surprise"] += 1.0;
          const den = datamodel.SpeakingQuestions["Surprise"];
          console.log("dennnn", den);

          // case consistency for key-map
          const emotion_cpy =
            emotionCorrect.charAt(0).toUpperCase() + emotionCorrect.slice(1);
          datamodel.SpeakingAccuracy["Surprise"] =
            (datamodel.SpeakingAccuracy["Surprise"] *
              (datamodel.SpeakingQuestions["Surprise"] - 1) +
              emotionAccuracy * 100) /
            den;
          console.log(datamodel.SpeakingAccuracy["Surprise"]);
          console.log(emotion_cpy);
          break;
          //schema error: when it's neutral update the surprise variable since we don't have netural in the DB
        }
        if (emotion.toLowerCase() === emotionCorrect) {
          const emotionUpdateCnt =
            emotionCorrect.charAt(0).toUpperCase() + emotionCorrect.slice(1);
          datamodel.SpeakingQuestions[emotionUpdateCnt] += 1.0;

          const emotion_cpy =
            emotion.charAt(0).toUpperCase() + emotion.slice(1);
          const den = datamodel.SpeakingQuestions[emotion_cpy];
          console.log("dennnn", den);

          datamodel.SpeakingAccuracy[emotion_cpy] =
            (datamodel.SpeakingAccuracy[emotion_cpy] *
              (datamodel.SpeakingQuestions[emotion_cpy] - 1) +
              emotionAccuracy * 100) /
            den;
          console.log(datamodel.SpeakingAccuracy[emotion_cpy]);
          console.log(emotion_cpy);

          break;
        }
      }

      try {
        await updateData(datamodel);
        // const data_user=await getUserData();
        console.log("Data updated successfully!");
      } catch (error) {
        console.error("Error updating data:", error);
      }
      console.log("datamodel updates in complete", datamodel);
    } else if (updatePartial) {
      final_result.forEach((result) => {
        if (result.label === emotionCorrect) {
          emotionAccuracy = result.score;
        }
      });

      for (let emotion in datamodel.SpeakingAccuracy) {
        if (emotionCorrect === "neutral") {
          datamodel.SpeakingQuestions["Surprise"] += 1.0;
          const den = datamodel.SpeakingQuestions["Surprise"];
          console.log("dennnn", den);

          // case consistency for key-map
          const emotion_cpy =
            emotionCorrect.charAt(0).toUpperCase() + emotionCorrect.slice(1);
          datamodel.SpeakingAccuracy["Surprise"] =
            (datamodel.SpeakingAccuracy["Surprise"] *
              (datamodel.SpeakingQuestions["Surprise"] - 1) +
              emotionAccuracy * 50) /
            den;
          console.log(datamodel.SpeakingAccuracy["Surprise"]);
          console.log(emotion_cpy);
          break;
          //schema error: when it's neutral update the surprise variable since we don't have netural in the DB
        }
        if (emotion.toLowerCase() === emotionCorrect) {
          const emotionUpdateCnt =
            emotionCorrect.charAt(0).toUpperCase() + emotionCorrect.slice(1);
          datamodel.SpeakingQuestions[emotionUpdateCnt] += 1.0;

          const emotion_cpy =
            emotion.charAt(0).toUpperCase() + emotion.slice(1);
          const den = datamodel.SpeakingQuestions[emotion_cpy];
          console.log("dennnn", den);

          datamodel.SpeakingAccuracy[emotion_cpy] =
            (datamodel.SpeakingAccuracy[emotion_cpy] *
              (datamodel.SpeakingQuestions[emotion_cpy] - 1) +
              emotionAccuracy * 50) /
            den;
          console.log(datamodel.SpeakingAccuracy[emotion_cpy]);
          console.log(emotion_cpy);

          break;
        }
      }

      try {
        await updateData(datamodel);
        // const data_user=await getUserData();
        console.log("Data updated successfully!");
      } catch (error) {
        console.error("Error updating data:", error);
      }
      console.log("datamodel updates in partial", datamodel);
    }

    // Ending DB upate here
  }

  const graphData = {
    labels: ["Correct", "Partial", "Incorrect"],
    datasets: [
      {
        data: [score, partial, 5 - (score + partial)],
        backgroundColor: ["green", "blue", "red"],
      },
    ],
  };

  let q = [
    "Speak the sentence in a",
    "Speak the sentence in a",
    "Speak the sentence in a",
    "Speak the sentence in a",
    "Speak the sentence in a",
  ];

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
            <button
              className="btn btn-large btn-dark d-none"
              onClick={() => {
                console.log("next ques");
                setCurrentQuestion(CurrentQuestion + 1);
                resetTranscript();
                setDisallowNext(true);
              }}
              // disabled={disallowNext}
              id="nextQuesBtn"
            >
              Next
            </button>
            <div>
              {showGraph ? <Bar data={chartData}></Bar> : <span></span>}
              <p className="d-none">
                Comparing against accuracy{" "}
                {accuracy !== null ? accuracy : "null"}
              </p>
            </div>
          </>
        ) : (
          <div
            style={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "20px",
            }}
          >
            <div className="score-section p-0 m-0">
              <div className="text-center">
                <div
                  className="p-3 m-0 text-center"
                  style={{ maxWidth: "100%", fontSize: "24px" }}
                >
                  <Doughnut
                    data={graphData}
                    options={{ cutoutPercentage: 80 }}
                  />
                </div>
                <br />
                <div className="p-2">
                  <h4 className="text-body-secondary text-center">
                    You scored {score} correct and {partial} partially correct
                    out of {q.length}!
                  </h4>
                </div>
              </div>
            </div>
            {/* <button
              className="btn btn-primary mt-5"
              onClick={() => navigate("/dashboard")}
            >
              Go to dashboard
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuthenticator(ExpressingExercise);
