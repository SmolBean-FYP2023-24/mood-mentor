// eslint-disable-next-line
import React, { useEffect, useRef, useState } from "react";
import "./styles/conversationalExercise.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import RecordRTC from "recordrtc";
import { Buffer } from "buffer";
import * as EBML from "ts-ebml";
// eslint-disable-next-line
import { fetchAuthSession } from "aws-amplify/auth";
// eslint-disable-next-line
import { uploadData, getUrl } from "aws-amplify/storage";
import * as $ from "jquery";
import { generateClient } from "aws-amplify/api";
import {
  createUserDataModel,
  updateUserDataModel,
  deleteUserDataModel,
} from "../graphql/mutations";

const client = generateClient();

window.Buffer = window.Buffer || Buffer;

const ConversationalExercise = () => {
  const [showOverlay, setShowOverlay] = useState("d-none");
  const [question, setQuestion] = useState("");
  const [preFetch, setPrefetch] = useState(true);
  const [showGuide, setShowGuide] = useState("false");
  const [questionGuide, setQuestionGuide] = useState("");
  const [userTurn, setUserTurn] = useState(1);
  // eslint-disable-next-line
  const [content, setContent] = useState("");
  console.error = (function (_error) {
    return function (message) {
      if (
        typeof message !== "string" ||
        message.indexOf("component is `contentEditable`") === -1
      ) {
        _error.apply(console, arguments);
      }
    };
  })(console.error);
  const processResponseText = (txt) => {
    const myText = txt.trim();
    const replacedText = myText.replace(/'/g, '"');
    var jsObj = JSON.parse(replacedText);
    console.log(jsObj);
  };
  const {
    transcript,
    listening,
    resetTranscript,
    // browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const recorderRef = useRef(null);

  useEffect(() => {
    // Request access to the microphone
    navigator.mediaDevices.getUserMedia({ audio: true }).then((mediaStream) => {
      recorderRef.current = RecordRTC(mediaStream, { type: "audio" });
    });
  }, []);

  const startRecording = () => {
    console.log("recording started");
    SpeechRecognition.startListening({ continuous: true });
    recorderRef.current.startRecording();
  };

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
    // const urll = "";
    var raw = {
      prompt: document.getElementById("transcriptArea").innerText,
      audio_file: urll,
    };
    var final_result;
    console.log(raw);
    // eslint-disable-next-line
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://0ikothkm27.execute-api.us-west-2.amazonaws.com/default/analyze/",
        requestOptions
      );

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      const result = await response.json();
      final_result = [result[0], result[5]["choices"][0]["message"]["content"]];
      console.log(result);
    } catch (err) {
      console.log(err);
    }
    setUserTurn(userTurn + 1);
    var area = document.getElementById("historyArea");
    var div;
    if (userTurn % 2 === 1) {
      div = generateUser1ChatBox(
        document.getElementById("transcriptArea").innerText,
        final_result
      );
    } else {
      div = generateUser2ChatBox(
        document.getElementById("transcriptArea").innerText,
        final_result
      );
    }
    // var div = document.createElement("div");
    // div.classList.add("container-fluid", "d-flex", "justify-content-end");
    // div.innerText = document.getElementById("transcriptArea").innerText;
    resetTranscript();
    area.appendChild(div);
  }

  function generateUser1ChatBox(text, final_result) {
    console.log(final_result);
    console.log("user1Chat");
    var container_div = document.createElement("div");
    var row = document.createElement("div");
    row.className = "row";

    var col1 = document.createElement("div");
    col1.className = "col-8";

    var col2 = document.createElement("div");
    col2.className = "col-4 userChatBg";

    var span = document.createElement("span");
    span.className = "user1Chat text-light userChat";
    span.innerText = text;

    col2.appendChild(span);
    row.appendChild(col1);
    row.appendChild(col2);
    container_div.appendChild(row);

    var nextRow = document.createElement("div");
    nextRow.className = "row";
    var column = document.createElement("div");
    column.className = "col-8";
    var column1 = document.createElement("div");
    column1.className = "col-4 text-small";
    column1.innerText =
      "Audio: " + JSON.stringify(final_result[0]) + " Text: " + final_result[1];
    nextRow.appendChild(column);
    nextRow.appendChild(column1);
    container_div.appendChild(nextRow);
    return container_div;
  }

  function generateUser2ChatBox(text, final_result) {
    console.log("user2Chat");
    var container_div = document.createElement("div");

    var row = document.createElement("div");
    row.className = "row";

    var col1 = document.createElement("div");
    col1.className = "col-4 userChatBg";

    var col2 = document.createElement("div");
    col2.className = "col-8";

    var span = document.createElement("span");
    span.className = "user2Chat text-light userChat";
    span.innerText = text;

    col1.appendChild(span);
    row.appendChild(col1);
    row.appendChild(col2);
    container_div.appendChild(row);

    var nextRow = document.createElement("div");
    nextRow.className = "row";
    var column = document.createElement("div");
    column.className = "col-4 text-small";
    column.innerText =
      "Audio: " + JSON.stringify(final_result[0]) + " Text: " + final_result[1];
    var column1 = document.createElement("div");
    column1.className = "col-8";
    nextRow.appendChild(column);
    nextRow.appendChild(column1);
    container_div.appendChild(nextRow);
    return container_div;
  }

  const stopRecording = () => {
    console.log("recording stopped");
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
        } catch (error) {
          console.log("Error : ", error);
        }
      };
      fileReader.readAsArrayBuffer(blob);
    });
  };

  const userData = {
    username: "owner",
    streak: 0,
    level: 1,
    badges: {
      BadgeQuestion50: true,
      BadgeQuestion100: false,
      BadgeQuestion200: true,
      BadgeDayHalf: false,
      BadgeDayMonth: true,
      BadgeDayThreeMonths: false,
      BadgeHappy40: true,
      BadgeSad40: false,
      BadgeFear40: true,
      BadgeDisgust40: false,
      BadgeSurprise40: true,
      BadgeAngry40: false,
      BadgeHappy60: true,
      BadgeSad60: false,
      BadgeFear60: true,
      BadgeDisgust60: false,
      BadgeSurprise60: true,
      BadgeAngry60: false,
    },
    SpeakingQuestions: {
      Happy: 0.7,
      Sad: 0.2,
      Angry: 0.4,
      Fear: 0.3,
      Disgust: 0.5,
      Surprise: 0.6,
    },
    ListeningQuestions: {
      Happy: 0.7,
      Sad: 0.2,
      Angry: 0.4,
      Fear: 0.3,
      Disgust: 0.5,
      Surprise: 0.6,
    },
    CoversationQuestions: {
      Happy: 0.7,
      Sad: 0.2,
      Angry: 0.4,
      Fear: 0.3,
      Disgust: 0.5,
      Surprise: 0.6,
    },
    HasOnboarded: false,
    SpeakingAccuracy: {
      Happy: 0.7,
      Sad: 0.2,
      Angry: 0.4,
      Fear: 0.3,
      Disgust: 0.5,
      Surprise: 0.6,
    },
    ListeningAccuracy: {
      Happy: 0.7,
      Sad: 0.2,
      Angry: 0.4,
      Fear: 0.3,
      Disgust: 0.5,
      Surprise: 0.6,
    },
    ConversationAccuracy: {
      Happy: 0.7,
      Sad: 0.2,
      Angry: 0.4,
      Fear: 0.3,
      Disgust: 0.5,
      Surprise: 0.6,
    },
  };

  const storeData = async () => {
    await client.graphql({
      query: createUserDataModel,
      variables: {
        input: userData,
      },
    });
  };

  const fetchQuestion = async () => {
    const user = await fetchAuthSession();
    var myHeaders = new Headers();
    myHeaders.append("Authorization", user.tokens.idToken.toString());
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        "https://0ikothkm27.execute-api.us-west-2.amazonaws.com/default/getQuestion/",
        requestOptions
      );
      const result = await response.text();
      console.log(JSON.parse(result));
      setQuestion(JSON.parse(result)["Topic"]);
      setQuestionGuide(JSON.parse(result)["Guide"]);
      setShowGuide(true);
      setPrefetch(false);
    } catch (error) {
      console.error(error);
    }
  };

  function hideGuide() {
    $("#guideArea").slideToggle();
    setShowGuide(!showGuide);
  }
  useEffect(() => {}, [showGuide, preFetch]);
  // fetchQuestion();

  return (
    // <div className="w-100 p-0" id="containerCEX">
    //   <div className="container h-100 p-0 p-sm-auto">
    //     <div
    //       className="speakerPersonA"
    //       contentEditable="true"
    //       suppressContentEditableWarning="true"
    //     >
    //       <p id="speakerA">{transcript}</p>
    //       <div className="speaker-toolbar rounded" contentEditable="false">
    //         <button
    //           className="rounded p-3 border-0"
    //           onClick={!listening ? startRecording : stopRecording}
    //         >
    //           {!listening ? (
    //             <i className="fa fa-microphone" aria-hidden="true"></i>
    //           ) : (
    //             <i className="fa fa-stop" aria-hidden="true"></i>
    //           )}
    //         </button>
    //         {/* <span className="timer mx-3">{timer} seconds</span> */}
    //         <button className="rounded p-3 border-0" onClick={analyze}>
    //           <i className="fa fa-check" aria-hidden="true"></i>
    //         </button>
    //       </div>
    //     </div>
    //     <div
    //       className="speakerPersonA"
    //       contentEditable="true"
    //       suppressContentEditableWarning="true"
    //     >
    //       {transcript}
    //       <div className="speaker-toolbar rounded" contentEditable="false">
    //         <button
    //           className="rounded p-3 border-0"
    //           onClick={!listening ? startRecording : stopRecording}
    //         >
    //           {!listening ? (
    //             <i className="fa fa-microphone" aria-hidden="true"></i>
    //           ) : (
    //             <i className="fa fa-stop" aria-hidden="true"></i>
    //           )}
    //         </button>
    //         {/* <span className="timer mx-3">{timer} seconds</span> */}
    //         <button className="rounded p-3 border-0">
    //           <i className="fa fa-check" aria-hidden="true"></i>
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div className="container-fluid text-dark py-0 my-0 h-100">
      <div id="overlay">
        <div id="overlay_text">Overlay Text</div>
      </div>
      <div className="row h-100">
        <div className="col-12 col-md-3 text-center px-3 bg-dark">
          <div className="row mt-3">
            <div className="col-12 d-flex justify-content-center">
              <b className="text-light">Members</b>
            </div>
          </div>
          <div className="row pt-5">
            <div className="userArea card bg-dark text-light p-4 my-1 rounded-3 border-0">
              <div className="row">
                <div className="col-2">
                  <img
                    className="userImage"
                    style={{
                      borderRadius: "100%",
                      width: "50px",
                      height: "50px",
                    }}
                    alt=""
                    src="https://i.imgur.com/JOKsNeT.jpeg"
                  ></img>
                </div>

                <div className="col-10">
                  <p className="d-flex p-0 m-0">User 1</p>
                  <p className="d-flex p-0 m-0">
                    <span className="text-secondary">
                      myemail@connect.ust.hk
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="userArea card bg-dark text-light p-4 my-1 rounded-3 border-0">
              <div className="row">
                <div className="col-2">
                  <img
                    className="userImage"
                    style={{
                      borderRadius: "100%",
                      width: "50px",
                      height: "50px",
                    }}
                    alt=""
                    src="https://i.imgur.com/JOKsNeT.jpeg"
                  ></img>
                </div>
                <div className="col-10">
                  <p className="d-flex p-0 m-0">User 2</p>
                  <p className="d-flex p-0 m-0">
                    <span className="text-secondary">
                      myemail@connect.ust.hk
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row d-flex justify-content-end align-items-endnp">
            <div className="p-0 my-1">
              <a href="/dashboard">
              <button className="btn btn-danger w-100">
                <i className="fa fa-ban" aria-hidden="true"></i>
                &nbsp;Exit
              </button>
              </a>
              <button
                onClick={fetchQuestion}
                className={`my-2 btn btn-large btn-secondary w-100 ${
                  preFetch ? "d-block" : "d-none"
                }`}
              >
                Fetch Question
              </button>
              <button
                onClick={hideGuide}
                className={`my-2 btn btn-large btn-dark w-100 ${
                  !preFetch ? "d-block" : "d-none"
                }`}
              >
                {showGuide ? "Hide" : "Show"} Guide
              </button>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-9 text-center">
          <div className="row mt-3">
            <div className="col-12">
              <b className="text-secondary">Conversation</b>
            </div>
          </div>
          <div className="row pt-1">
            <p id="primaryQuestion">
              <b>{question}</b>
            </p>
            <div id="guideArea">
              {questionGuide.split("\n").map((point, index) => (
                <p key={index}>{point}</p>
              ))}
            </div>
          </div>
          <div
            id="historyArea"
            placeholder="Conversation History"
            className="container-fluid border px-4 py-4 rounded-3"
          ></div>
          <div className="row">
            <div className="container-fluid my-3">
              <div
                className="d-flex px-5 py-5 rounded-3"
                id="transcriptArea"
                suppressContentEditableWarning={true}
                contentEditable={true}
              >
                <>
                  {transcript !== "" ? (
                    <>User {userTurn % 2 === 0 ? 2 : 1}:</>
                  ) : (
                    ""
                  )}{" "}
                  {transcript}
                </>
              </div>
            </div>
          </div>

          <div className="row p-0">
            <div className="col-12 col-md-9"></div>
            <div className="col-12 col-md-3 d-flex justify-content-end">
              <button
                className="btn btn-large btn-dark rounded-2 mx-2"
                onClick={!listening ? startRecording : stopRecording}
              >
                {!listening ? (
                  <>
                    <i className="fa fa-microphone" aria-hidden="true"></i>{" "}
                    Speak
                  </>
                ) : (
                  <>
                    <i className="fa fa-stop" aria-hidden="true"></i> Stop
                  </>
                )}
              </button>
              <button
                className="analyzeBtn btn btn-large btn-success rounded-2"
                onClick={analyze}
              >
                Analyze
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationalExercise;
