import { React, useEffect, useState } from "react";
import "./styles/ListeningExercise.css";
import "./styles/audio_player.css";
import { dummyData } from "./dummyData";
// eslint-disable-next-line
import { getUrl } from "aws-amplify/storage";
import { pathLabels } from "./data/pathset";
import { fetchAuthSession } from "aws-amplify/auth";

import {
  createUserDataModel,
  updateUserDataModel,
  deleteUserDataModel,
} from "../graphql/mutations";
import {
  getUserDataModel
} from "../graphql/queries";
import { generateClient } from "aws-amplify/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

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
  return newObj;
  }






function removeKeys(obj, keys) {
  const newObj = { ...obj };
  keys.forEach((key) => {
    delete newObj[key];
  });
  return newObj;
}


const updateData = async (user) => {
  try{
    // console.log("this is in user",user.data)
    // const {getUserDataModel}=user;
    // console.log("this is get",getUserDataModel)

   const keysToRemove = [
    "__typename",
    "_deleted",
    "_lastChangedAt",
    "createdAt",
    "updatedAt",
    // "_version", // check if need to remove
  ];

  const cleanedUserData = removeKeys(user, keysToRemove);
  // console.log(user)

  const cleanedUser = {
    data: {
      getUserDataModel: removeTypenameKey(cleanedUserData),
    },
  };
   console.log("cleaned user",cleanedUser);
  await client.graphql({
    query: updateUserDataModel,
    variables: {
      input: cleanedUser.data.getUserDataModel,
      // condition: "e361b884-d24d-450e-9ac8-b757abcbf333"   
     }
  });
  } // end of try 
  catch(error)
  {
    console.error ("Error updating user",error);
    return null;
  }
}


const getUserData = async() => {
  try {
    const userauth=await fetchAuthSession();
    const response = await client.graphql({
      query: getUserDataModel,
      variables: {
        username: userauth.tokens.accessToken.payload.sub, // extracting based on username
      },
    });
        
    const userDataModel = response.data.getUserDataModel;
    console.log('User data model:', userDataModel);
    // console.lo
    // ("this is the console log wiht user_Data",response.data)

    return userDataModel;
    // Process the user data model as needed
  } catch (error) {
    console.error('Error retrieving user data model:', error);
    return null;
  }
}

let datamodel;






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

// removing emotion choice from the parameter
function getRandomAudio() {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(emotionChoice);
      var emotions = ["angry", "disgust", "fear", "happy", "neutral", "sad"];
      let chosenEmotion;

      datamodel = await getUserData();
      let lowestThreeEmotions = Object.entries(datamodel.ListeningAccuracy)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 3)
        .map(entry => entry[0]);

      chosenEmotion = lowestThreeEmotions[Math.floor(Math.random() * lowestThreeEmotions.length)];
      const emotion_case = chosenEmotion.charAt(0).toUpperCase() + chosenEmotion.slice(1);
      if (emotion_case === 'Neutral') {
        datamodel.ListeningQuestions['Surprise'] += 1.0;
      } else {
        datamodel.ListeningQuestions[emotion_case] += 1.0;
      }

      try {
        await updateData(datamodel);
        console.log("Data updated successfully!");
      } catch (error) {
        console.error("Error updating data:", error);
      }

      chosenEmotion = chosenEmotion.charAt(0).toLowerCase() + chosenEmotion.slice(1);

      var chosenAudio =
        pathLabels[chosenEmotion][
          Math.floor(Math.random() * pathLabels[chosenEmotion].length)
        ];

      // console.log("emotionnnnn", chosenEmotion);
      // console.log("audioooooo", chosenAudio);

      resolve([chosenAudio, chosenEmotion]);
    } catch (error) {
      reject(error);
    }
  });
}

const random_function_audio = async() => {

  try {
    var results = await getRandomAudio();
    // console.log("hiiiiiiiiiiiiiiiiii", results);
    var chosenAudio = results[0];
    // setCorrectAnswer(results[1]);
    return results;
  } catch (error) {
    console.error("Error:", error);
  }
 
}

export const playAudio = async (
  setPlayingState,
  setCorrectAnswer,
  targetEmotion = ""
) => {
  var x = document.getElementById("audioPlayer");
  if (x.getAttribute("src") === null) {
    var results=await random_function_audio();
    var chosenAudio = results[0];
    setCorrectAnswer(results[1]); 
    // IMPORTANT: Commented to reduce costs, do not remove
    await getUrl({
      key: chosenAudio,
      options: { accessLevel: "guest" },
    }).then((res) => {
      x.setAttribute("src", res.url.href);
      x.play();
      x.addEventListener("ended", function () {
        setPlayingState(0);
        document.getElementById("audioStatus").innerText = "Stopped";
      });
      setPlayingState(1);
      document.getElementById("audioStatus").innerText = "Playing...";
    });
    // await new Promise((resolve) => setTimeout(resolve, 1000)).then((res) => {
    //   x.setAttribute("src", chosenAudio);
    //   setPlayingState(1);
    //   x.play();
    //   x.addEventListener("ended", function () {
    //     setPlayingState(0);
    //     document.getElementById("audioStatus").innerText = "Stopped";
    //   });
    //   document.getElementById("audioStatus").innerText = "Playing...";
    // });
  } else {
    setPlayingState(1);
    x.play();
    x.addEventListener("ended", function () {
      setPlayingState(0);
      document.getElementById("audioStatus").innerText = "Stopped";
    });
    document.getElementById("audioStatus").innerText = "Playing...";
  }
};

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

  


  // Access the variables from the dummy data
  // const {
  //   id,
  //   username,
  //   password,
  //   streak,
  //   level,
  //   badges,
  //   speakingQuestion,
  //   listeningQuestion,
  //   conversationQuestion,
  //   hasOnboarded,
  //   speakingAccuracy,
  //   listeningAccuracy,
  //   conversationAccuracy,
  // } = dummyData;

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
            <div className="optionButton btn-clr-lex w-md-75 w-xs-100 mx-auto p-md-3 p-2 rounded justify-content-evenly">
              <span className="badge text-bg-light text-dark flex-fill">
                {String.fromCharCode(97 + index)}
              </span>
              <span className="p-3 flex-fill optionButtonText">
                {answerOption}
              </span>
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
    "What emotion can you identify in this audio?",
    "What emotion can you identify in this audio?",
    "What emotion can you identify in this audio?",
    "What emotion can you identify in this audio?",
  ];

  async function handleAnswerButtonClick(answerOption) {
    // console.log("hiiiiiii",answerOption);

    
    var optionButtons = document.getElementsByClassName("optionButton");
    for (var i = 0; i < optionButtons.length; i++) {
      // Get the 'optionButtonText' of the current optionButton
      var optionButtonText =
        optionButtons[i].getElementsByClassName("optionButtonText")[0]
          .innerText;

      // Check if the 'optionButtonText' equals 'aaaa'
      if (optionButtonText === updateAnswers) {
          // console.log("hiiiiiii",answerOption);
          // console.log("hiiiiiii",updateAnswers);


        // If it does, remove the 'bg-dark' class and add the 'correct' class
        optionButtons[i].classList.remove("btn-clr-lex");
        optionButtons[i].classList.add("correct");
      } else {
        optionButtons[i].classList.remove("btn-clr-lex");
        optionButtons[i].classList.add("incorrect");
      }
    }

    await new Promise((r) => setTimeout(r, 1000));

    if (answerOption === updateAnswers) { // this is when the answer is corrrect so update to the DB for that particular emotion
      setScore(score + 1);
      datamodel=await getUserData();


       const binary_correct=answerOption === updateAnswers;
      // DB update code

      for (let emotion in datamodel.ListeningAccuracy) {
        if(answerOption ==='neutral')
        {
          // case consistency for key-map
          const emotion_cpy=(answerOption.charAt(0).toUpperCase() + answerOption.slice(1));
          datamodel.ListeningAccuracy['Surprise'] = (datamodel.ListeningAccuracy['Surprise']*(datamodel.ListeningQuestions['Surprise']-1) + (binary_correct*100) )/datamodel.ListeningQuestions['Surprise'];
          console.log(datamodel.ListeningAccuracy['Surprise'])
          console.log(emotion_cpy)
          break;
          //schema error: when it's neutral update the surprise variable since we don't have netural in the DB
        }
        if (emotion.toLowerCase() === answerOption) {
          const emotion_cpy=(emotion.charAt(0).toUpperCase() + emotion.slice(1));
          datamodel.ListeningAccuracy[emotion_cpy] = (datamodel.ListeningAccuracy[emotion_cpy]*(datamodel.ListeningQuestions[emotion_cpy]-1) + (binary_correct*100) )/datamodel.ListeningQuestions[emotion_cpy];
          console.log(datamodel.ListeningAccuracy[emotion_cpy])
          console.log(emotion_cpy)

          break;
        }
      }

      // need to check 
        try {
          await updateData(datamodel);
          // const data_user=await getUserData();
          console.log("Data updated successfully!");
        } catch (error) {
          console.error("Error updating data:", error);
        }

    } // end of if block
    const nextQuestion = CurrentQuestion + 1;
    if (nextQuestion < q.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
    setUpdateAnswers(false);  
  }

  var initData = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        label: "Result Breakdown",
        data: [0, 0],
        backgroundColor: ["#4CAF50", "#E53935"],
      },
    ],
  };
  const [graphData, setGraphData] = useState(initData);

  useEffect(() => {
    initData.datasets[0].data = [score, q.length - score];
    setGraphData(initData);
    // eslint-disable-next-line
  }, [score]);

  return (
    <div className="w-100 p-0 m-0">
      <div className="container h-100 p-0 p-sm-auto">
        {showScore ? (
          <div className="score-section p-0 m-0">
            <div
              style={{ height: "calc(100vh - 56px)" }}
              className="text-center"
            >
              <div
                className="p-2 m-0 text-center"
                style={{
                  minHeight: "50vh",
                  display: "flex",
                  justifyContent: "center",
                  maxHeight: "75vh",
                  maxWidth: "100vw",
                }}
              >
                <Doughnut data={graphData} />
              </div>
              <br></br>
              <div className="p-2">
                <h5 className="text-body-secondary text-center">
                  You scored {score} out of {q.length}
                </h5>
              </div>
              < a href="/dashboard">
              <button
                className="btn btn-clr-lex-dash btn-primary mt-5"
              >
                Go to dashboard
              </button>
              </a>
            </div>
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