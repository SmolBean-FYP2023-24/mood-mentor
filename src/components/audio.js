import React, { useEffect, useRef } from "react";
import "./audio.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import RecordRTC from "recordrtc";
import { Buffer } from "buffer";
import * as EBML from "ts-ebml";
import { fetchAuthSession } from "aws-amplify/auth";
import { uploadData, getUrl } from "aws-amplify/storage";

window.Buffer = window.Buffer || Buffer;
let started = false;

const AudioRecorder = () => {
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
          await getUrl({
            key: "audio.wav",
            options: {
              accessLevel: "private",
            },
          }).then((res) => console.log(res.url.href));
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
    var raw = JSON.stringify(document.getElementById("finaltext").innerText);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(
      "https://1xgrgbwrn5.execute-api.us-west-2.amazonaws.com/main/analyze/",
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then((result) => {
        if (result.body) {
          let parsedResponse = result.body.replace(/\\n/g, "");
          console.log(parsedResponse.trim());
        } else {
          console.log("No 'body' field in the response");
        }
      })
      .catch((error) => console.log("error", error));
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
          style={{ height: "calc(100vh - 63px)" }}
        >
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
        <div className="col-12 col-md-8">
          <div className="container py-3">
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
            <div className="row justify-content-end">
              <div className="col-12 col-md-3 p-0 mx-md-2">
                <button
                  className="btn w-100 btn-warning my-2 my-md-0 mx-0 mx-md-0"
                  id="resetBtn"
                  onClick={resetContent}
                >
                  Reset Transcript
                </button>
              </div>
              <div className="col-12 col-md-3 p-0">
                <button
                  className="btn w-100 btn-success mx-0 "
                  id="analysisBtn"
                  onClick={analyze}
                >
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
