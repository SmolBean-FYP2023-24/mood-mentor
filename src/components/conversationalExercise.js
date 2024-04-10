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

window.Buffer = window.Buffer || Buffer;

const ConversationalExercise = () => {
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
  const {
    transcript,
    listening,
    // resetTranscript,
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
    var raw = {
      prompt: document.getElementById("speakerA").innerText,
      audio_file: urll,
    };

    console.log(raw);
    // eslint-disable-next-line
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: "follow",
    };

    // await fetch(
    //   "https://0ikothkm27.execute-api.us-west-2.amazonaws.com/default/analyze/",
    //   requestOptions
    // )
    //   .then(
    //     (response) => {
    //       if (!response.ok) {
    //         throw new Error("HTTP error " + response.status);
    //       }
    //       return response.json();
    //     },
    //     (err) => console.log(err)
    //   )
    //   .then((result) => {
    //     console.log(result);
    //   });

    // await new Promise((r) => setTimeout(r, 1000));
    var obj = [
      {
        score: 0.4828985333442688,
        label: "happy",
      },
      {
        score: 0.31746071577072144,
        label: "sad",
      },
      {
        score: 0.15375052392482758,
        label: "neutral",
      },
      {
        score: 0.023502331227064133,
        label: "fear",
      },
      {
        score: 0.015406891703605652,
        label: "disgust",
      },
      " {'Hello, my name is Sarthak.': 'neutral'}",
    ];
    console.log(obj);
    return obj;
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

  return (
    <div className="container-fluid">
      <div
        className="speakerPersonA"
        contentEditable="true"
        suppressContentEditableWarning="true"
      >
        <p id="speakerA">{transcript}</p>
        <div className="speaker-toolbar rounded" contentEditable="false">
          <button
            className="rounded p-3 border-0"
            onClick={!listening ? startRecording : stopRecording}
          >
            {!listening ? (
              <i className="fa fa-microphone" aria-hidden="true"></i>
            ) : (
              <i className="fa fa-stop" aria-hidden="true"></i>
            )}
          </button>
          {/* <span className="timer mx-3">{timer} seconds</span> */}
          <button className="rounded p-3 border-0" onClick={analyze}>
            <i className="fa fa-check" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <div
        className="speakerPersonA"
        contentEditable="true"
        suppressContentEditableWarning="true"
      >
        {transcript}
        <div className="speaker-toolbar rounded" contentEditable="false">
          <button
            className="rounded p-3 border-0"
            onClick={!listening ? startRecording : stopRecording}
          >
            {!listening ? (
              <i className="fa fa-microphone" aria-hidden="true"></i>
            ) : (
              <i className="fa fa-stop" aria-hidden="true"></i>
            )}
          </button>
          {/* <span className="timer mx-3">{timer} seconds</span> */}
          <button className="rounded p-3 border-0">
            <i className="fa fa-check" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationalExercise;
