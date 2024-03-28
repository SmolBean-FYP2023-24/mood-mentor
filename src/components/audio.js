import React, { useEffect, useRef, useState } from "react";
import "./styles/audio.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import RecordRTC from "recordrtc";
import { Buffer } from "buffer";
import * as EBML from "ts-ebml";
import { fetchAuthSession } from "aws-amplify/auth";
import { uploadData, getUrl } from "aws-amplify/storage";
import { sentences } from "./data/sentences";

window.Buffer = window.Buffer || Buffer;
let started = false;
function getRandomSentence(emotionChoice = "") {
  var emotions = ["angry", "disgust", "fear", "happy", "neutral", "sad"];
  var chosenEmotion =
    emotionChoice !== ""
      ? emotionChoice
      : emotions[Math.floor(Math.random() * emotions.length)];
  var chosenSentence =
    sentences[chosenEmotion][
      Math.floor(Math.random() * sentences[chosenEmotion].length)
    ];
  console.log("hello");
  return [chosenSentence, chosenEmotion];
}
const AudioRecorder = () => {
  const [CurrentQuestion, setCurrentQuestion] = useState(0);
  const [x, setX] = useState("");

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const recorderRef = useRef(null);

  useEffect(() => {
    // Request access to the microphone
    navigator.mediaDevices.getUserMedia({ audio: true }).then((mediaStream) => {
      recorderRef.current = RecordRTC(mediaStream, { type: "audio" });
    });
  }, []);

  const startRecording = () => {
    started = true;
    SpeechRecognition.startListening({ continuous: true });
    document.getElementById("analysisBtn").disabled = true;
    recorderRef.current.startRecording();
    startAnimation();
  };

  // eslint-disable-next-line
  const stopRecording = () => {
    setCurrentQuestion(CurrentQuestion + 1);
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
          // await getUrl({
          //   key: "audio.wav",
          //   options: {
          //     accessLevel: "private",
          //   },
          // }).then((res) => console.log(res.url.href));
          document.getElementById("analysisBtn").disabled = false;
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
    document.getElementById("outerMic").animate(shrinkGrow, timing);
  }

  function stopAnimation() {
    document
      .getElementById("outerMic")
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
      prompt: document.getElementById("finaltext").innerText,
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
      "https://0ikothkm27.execute-api.us-west-2.amazonaws.com/default/analyze/",
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
        console.log(result);
      });
  }

  function resetContent() {
    resetTranscript();
    document.getElementById("finaltext").innerText =
      "Transcription appears here...";
  }

  return (
    <>
      <div className="row w-100 m-0 p-0">
        <div
          className="col-12 col-md-4 bg-dark text-light"
          style={{ height: "calc(100vh - 56px)" }}
        >
          <span>Question {x[0]}</span>
          <div id="holder" className="m-auto">
            <div
              className="p-5 rounded-circle border"
              style={{ aspectRatio: "1", textAlign: "center" }}
              id="outerMic"
              onClick={!listening ? startRecording : stopRecording}
            >
              <i
                className="fa fa-microphone"
                style={{ fontSize: "500%" }}
                aria-hidden="true"
                id="mic"
              ></i>
            </div>
            <br></br>
            Listening: {listening ? "On" : "Off"}
          </div>
        </div>
        <div
          className="col-12 col-md-8"
          style={{ height: "calc(100vh - 56px)" }}
        >
          <div className="container py-3 h-100">
            <div className="row">
              <p
                id="finaltext"
                suppressContentEditableWarning={true}
                contentEditable
                className="bg-light p-3"
                style={{
                  textAlign: "justify",
                  minHeight: "77vh",
                }}
              >
                {transcript === ""
                  ? "Transcription appears here..."
                  : transcript}
              </p>
            </div>
            <div className="row justify-content-end my-auto">
              <div className="col-12 col-md-3 p-0 mx-md-2">
                <button
                  className="btn w-100 btn-warning my-2 my-md-0 mx-0 mx-md-0"
                  id="resetBtn"
                  onClick={resetContent}
                >
                  <i className="fa fa-refresh" aria-hidden="true"></i> &nbsp;
                  Reset Transcript
                </button>
              </div>
              <div className="col-12 col-md-3 p-0">
                <button
                  className="btn w-100 btn-success mx-0 "
                  id="analysisBtn"
                  onClick={analyze}
                >
                  <i className="fa fa-bar-chart" aria-hidden="true"></i> &nbsp;
                  Perform Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AudioRecorder;
