// import React, { useEffect, useRef } from "react";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";

// const Dictaphone = () => {
//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition,
//   } = useSpeechRecognition();
//   const mediaRecorderRef = useRef(null);

//   useEffect(() => {
//     // Request access to the microphone
//     navigator.mediaDevices.getUserMedia({ audio: true }).then((mediaStream) => {
//       mediaRecorderRef.current = new MediaRecorder(mediaStream);

//       mediaRecorderRef.current.ondataavailable = function (event) {
//         // Create a Blob from the audio data
//         const blob = new Blob([event.data], { type: "audio/mp3" });

//         // Create a URL for the Blob
//         const url = URL.createObjectURL(blob);

//         // Create a link for downloading the audio file
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = "audio.mp3";
//         link.click();
//       };
//     });
//   }, []);

//   const startRecording = () => {
//     SpeechRecognition.startListening();
//     mediaRecorderRef.current.start();
//   };

//   const stopRecording = () => {
//     SpeechRecognition.stopListening();
//     mediaRecorderRef.current.stop();
//   };

//   if (!browserSupportsSpeechRecognition) {
//     return <span>Browser doesn't support speech recognition.</span>;
//   }

//   return (
//     <div>
//       <p>Microphone: {listening ? "on" : "off"}</p>
//       <button onClick={startRecording}>Start</button>
//       <button onClick={stopRecording}>Stop</button>
//       <button onClick={resetTranscript}>Reset</button>
//       <p>{transcript}</p>
//     </div>
//   );
// };

// export default Dictaphone;

// import React, { useEffect, useRef } from "react";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";
// import RecordRTC from "recordrtc";
// import * as EBML from "ts-ebml";

// const Dictaphone = () => {
//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition,
//   } = useSpeechRecognition();
//   const recorderRef = useRef(null);

//   useEffect(() => {
//     // Request access to the microphone
//     navigator.mediaDevices.getUserMedia({ audio: true }).then((mediaStream) => {
//       recorderRef.current = RecordRTC(mediaStream, { type: "audio" });
//     });
//   }, []);

//   const startRecording = () => {
//     SpeechRecognition.startListening();
//     recorderRef.current.startRecording();
//   };

//   //   const stopRecording = () => {
//   //     SpeechRecognition.stopListening();
//   //     recorderRef.current.stopRecording(() => {
//   //       const blob = recorderRef.current.getBlob();

//   //       // Create a URL for the Blob
//   //       const url = URL.createObjectURL(blob);

//   //       // Create a link for downloading the audio file
//   //       const link = document.createElement("a");
//   //       link.href = url;
//   //       link.download = "audio.wav";
//   //       link.click();
//   //     });
//   //   };

//   const stopRecording = () => {
//     SpeechRecognition.stopListening();
//     recorderRef.current.stopRecording(() => {
//       const blob = recorderRef.current.getBlob();

//       // Read the Blob as an ArrayBuffer
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const buffer = reader.result;

//         // Decode the EBML
//         const decoder = new EBML.Decoder();
//         const ebmlElms = decoder.decode(buffer);

//         // Read the EBML elements
//         const reader = new EBML.Reader();
//         ebmlElms.forEach((elm) => {
//           reader.read(elm);
//         });
//         reader.stop();

//         // Make the metadata seekable
//         const refinedMetadataBuf = EBML.tools.makeMetadataSeekable(
//           reader.metadatas,
//           reader.duration,
//           reader.cues
//         );

//         // Create a new Blob with the refined metadata
//         const body = buffer.slice(reader.metadataSize);
//         const newBlob = new Blob([refinedMetadataBuf, body], {
//           type: "audio/webm",
//         });

//         // Create a URL for the new Blob
//         const url = URL.createObjectURL(newBlob);

//         // Create a link for downloading the audio file
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = "audio.webm";
//         link.click();
//       };
//       reader.readAsArrayBuffer(blob);
//     });
//   };

//   if (!browserSupportsSpeechRecognition) {
//     return <span>Browser doesn't support speech recognition.</span>;
//   }

//   return (
//     <div>
//       <p>Microphone: {listening ? "on" : "off"}</p>
//       <button onClick={startRecording}>Start</button>
//       <button onClick={stopRecording}>Stop</button>
//       <button onClick={resetTranscript}>Reset</button>
//       <p>{transcript}</p>
//     </div>
//   );
// };

// export default Dictaphone;

import React, { useEffect, useRef } from "react";
import "./audio.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import RecordRTC from "recordrtc";
import { Buffer } from "buffer";
import * as EBML from "ts-ebml";
window.Buffer = window.Buffer || Buffer;
let started = false;

const Dictaphone = () => {
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
      fileReader.onloadend = () => {
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
        const url = URL.createObjectURL(newBlob);

        // Create a link for downloading the audio file
        const link = document.createElement("a");
        link.href = url;
        link.download = "audio.wav";
        link.click();
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

  return (
    <>
      <div className="row w-100 m-0 p-0">
        <div
          className="col-12 col-md-4 bg-dark text-light"
          style={{ height: "calc(100vh - 63px)" }}
        >
          <div id="holder" className="m-auto">
            {/* <br></br>
          <button onClick={startRecording}>Start</button>
          <button onClick={stopRecording}>Stop</button>
          <button onClick={resetTranscript}>Reset</button> */}
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
                contentEditable
                className="bg-light p-3"
                style={{ textAlign: "justify", minHeight: "60vh" }}
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
                  onClick={resetTranscript}
                >
                  Reset Transcript
                </button>
              </div>
              <div className="col-12 col-md-3 p-0">
                <button
                  className="btn w-100 btn-success mx-0 "
                  id="analysisBtn"
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

export default Dictaphone;
