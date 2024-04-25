import React, { useEffect, useRef, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import "@aws-amplify/ui-react/styles.css";
import chroma from "chroma-js";

// import './profilePage.css';
import Chart from "chart.js/auto";
import "./styles/dashboard.css";
import "./styles/profilePage.css";
import ProfilePictureSection from "./ProfilePictureSection.js";
import { dummyData } from "./dummyData.js";
import img from "./images/colored/badge200qs.png";
import img1 from "./images/greyed-out/badge200qs.png";
import { getUserDataModel } from "../graphql/queries.js";

import { evaluate, parse, sqrt, exp, pi } from "mathjs";
import * as subscriptions from "../graphql/subscriptions";
import { generateClient } from "aws-amplify/api";



function BadgeHolder({ badges }) {
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);

  const navigateBadge = (direction) => {
    if (direction === "prev") {
      setCurrentBadgeIndex((prevIndex) => prevIndex - 1);
    } else if (direction === "next") {
      setCurrentBadgeIndex((prevIndex) => prevIndex + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        navigateBadge("prev");
      } else if (event.key === "ArrowRight") {
        navigateBadge("next");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const currentBadge = Object.entries(badges)[currentBadgeIndex];
  const [badgeName, badgeValue] = currentBadge;

  console.log(badgeName);
  console.log(badgeValue);

  // C:\Users\Lenovo S540 FSIN\Desktop\1_FYP_2023\FYP_Final\mood-mentor\src\components\images\greyed-out\badge200qs.png

  return (
    <div className="badgeDash">
      <span className="arrow left-arrow" onClick={() => navigateBadge("prev")}>
        &larr;
      </span>
      {badgeValue ? (
        <img src={img} alt={badgeName} />
      ) : (
        <img src={img1} alt={badgeName} />
      )}
      <span className="arrow right-arrow" onClick={() => navigateBadge("next")}>
        &rarr;
      </span>
    </div>
  );

  // C:\Users\Lenovo S540 FSIN\Desktop\1_FYP_2023\FYP_Final\mood-mentor\src\components\images\greyed-out\badge50qs.png
}

// Dashboard function starts here
function Dashboard(props) {
  //User authentication
  // const [userState, setUserState] = useState(0);
  // useEffect(() => {
  //   const getUserData = async () => {
  //     const user = await fetchAuthSession();
  //     setUserState(user.tokens.idToken.payload);
  //     props.handleUser(user);
  //   };
  //   getUserData();
  // }, [props]);

  // Access the variables from the dummy data
  const {
    id,
    username,
    password,
    streak,
    level,
    badges,
    speakingQuestion,
    listeningQuestion,
    conversationQuestion,
    hasOnboarded,
    speakingAccuracy,
    listeningAccuracy,
    conversationAccuracy,
  } = dummyData;

  // Function to create  menus
  const [selectedExercise, setSelectedExercise] = useState("Speaking");

  const handleExerciseChange = (event) => {
    setSelectedExercise(event.target.value);
  };

  // CHART2: LINE CHART FOR QUESTIONS PER WEEK

  const data_qs_per_week = {
    labels: [1, 2, 3, 4, 5, 6, 7], // Week numbers
    legend: {
      display: false, // Hide the legend
    },
    datasets: [
      {
        label: "Number of Questions Practiced",
        data: [10, 15, 8, 12, 20, 16, 25], // Number of questions practiced per week
        fill: true,
        // const baseColors = ["#50C4ED", "#387ADF", "#333A73"];
        backgroundColor: "#A7D5F2",
        borderColor: "#2D4B73",
        borderWidth: 2,
        lineTension: 0.3, // Adjust the line tension to control the curve smoothness
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Week Number",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Questions Practiced",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            if (label) {
              return `${label}: ${context.parsed.y}`;
            }
            return `${context.parsed.y}`;
          },
        },
      },
    },
  };

  // Below is the code for the accuracy charts

  const [selectedExercise_acc, setSelectedExercise_acc] = useState("Speaking");
  const [accuracies, setAccuracies] = useState([]);
  const [trendIndicators, setTrendIndicators] = useState([]);

  const emotion_labels = [
    "happy",
    "sad",
    "angry",
    "fear",
    "disgust",
    "surprise",
  ];

  useEffect(() => {
    updateAccuracies(selectedExercise_acc);
  }, [selectedExercise_acc]);

  const handleExerciseChange_acc = (event) => {
    setSelectedExercise_acc(event.target.value);
  };

  const calculateEmotionAccuracies = (exercise) => {
    const accuracyData = dummyData[`${exercise}Accuracy`];

    const labels = Object.keys(accuracyData);
    // console.log(labels)
    const accuracyValues = Object.values(accuracyData);

    // Calculate the trend indicators
    const trendIndicators = calculateTrendIndicators(accuracyValues);

    return {
      labels,
      accuracies: accuracyValues,
      trendIndicators,
    };
  };

  const calculateTrendIndicators = (accuracyValues) => {
    const trendIndicators = [];
    for (let i = 0; i < accuracyValues.length; i++) {
      if (i === 0) {
        trendIndicators.push(null);
      } else {
        if (accuracyValues[i] > accuracyValues[i - 1]) {
          trendIndicators.push("upward");
        } else if (accuracyValues[i] < accuracyValues[i - 1]) {
          trendIndicators.push("downward");
        } else {
          trendIndicators.push("equal");
        }
      }
    }
    return trendIndicators;
  };

  const updateAccuracies = (exercise) => {
    const { labels, accuracies, trendIndicators } =
      calculateEmotionAccuracies(exercise);

    setAccuracies(accuracies);
    setTrendIndicators(trendIndicators);

    // Destroy the existing chart if it exists
    const existingChart = Chart.getChart("accuracy-chart");
    if (existingChart) {
      existingChart.destroy();
    }
  };

  return (
    <div className="container-fluid-dashboard">
      {/* <h1 className="top-text">Dashboard</h1> */}

      <div className="row-1-dashboard">
        <div className="col-lg-2 col-md-4">
          <div className="sidebar-dashboard">
            <ProfilePictureSection />
            <div className="text-user-dashboard">
              Name: {username}
              <br />
              Streak: {streak}
              <br />
              User ID: {id}
            </div>

            <a href="/lex">
              <button className="profile-button">Listening Exercise</button>
            </a>
            <a href="/eex">
              <button className="profile-button">Speaking Exercise</button>
            </a>
            <a href="/cex">
              <button className="profile-button">
                Conversational Exercise
              </button>
            </a>
          </div>
          {/* end of sidebar-dashboard */}
        </div>
        {/* end of col-lg-3 col-md-4 */}

        <div className="col-lg-10 col-md-8">
          <div className="row-2-dashboard">
            <div className="badge-holder-dashboard">
              <div
                className="subheading"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "2vh",
                }}
              >
                Badges
              </div>
              <BadgeHolder badges={badges} />
            </div>

            <div className="qs-emotion-dashboard">
              <div className="qs-emotion-dashboard-row1">
                <div className="accuracy-table-heading">
                  <div className="subheading">Questions Practiced </div>
                  {/* <div className="exercise-dropdown-emotion-qs"> */}

                  <select
                    id="exercise-select"
                    value={selectedExercise}
                    onChange={handleExerciseChange}
                  >
                    <option value="Speaking">Speaking</option>
                    <option value="Listening">Listening</option>
                    <option value="Coversation">Conversation</option>
                  </select>
                  {/* <div className="qs-emotion-dashboard-heading">
                        Questions per emotion</div> */}
                </div>
              </div>
              {/* end of excercise-dropdown */}

              {/* </div> */}
              {/* end of qs-emotion-dashboard-row1 */}

              <div
                className="qs-emotion-dashboard-inner"
                style={{ width: "800px" }}
              >
                <Bar
                  data={{
                    labels: [
                      "Happy",
                      "Sad",
                      "Angry",
                      "Disgust",
                      "Surprise",
                      "Fear",
                    ],
                    datasets: [
                      {
                        label: `${selectedExercise} Questions`,
                        data: Object.values(
                          dummyData[selectedExercise + "Questions"]
                        ),
                        backgroundColor: "rgba(54, 162, 235, 0.5)", // Color for the selected exercise Questions bars
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0, // Display integers for y-axis ticks
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false, // Disable the legend
                      },
                    },
                  }}
                />
              </div>
              {/* qs-emotion-dashboard-inner */}
            </div>
            {/* end of qs-emotion-dashboard-row1 */}
          </div>
          {/* end of row-2-dashboard */}

          <div className="custom-row-2">
            {/* <MenuChart /> */}
            <div className="acc-graph-dashboard">
              {/* <canvas id="accuracy-chart"></canvas> */}
              <Line
                data={data_qs_per_week}
                options={{
                  ...options,
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
            {/* end of acc-graph-dashboard */}
            <div className="acc-stats-dashboard">
              {/* <h2>Accuracy Statistics</h2> */}
              <div className="accuracy-table-heading">
                <div className="subheading">Accuracies </div>
                <div
                  className="exercise-dropdown-container-acc"
                  style={{ marginTop: "2vh" }}
                >
                  {/* <label htmlFor="exercise-select">Select Exercise:</label> */}
                  <select
                    id="exercise-select-acc"
                    value={selectedExercise_acc}
                    onChange={handleExerciseChange_acc}
                  >
                    <option value="Listening">Listening</option>
                    <option value="Speaking">Speaking</option>
                    <option value="Conversation">Conversation</option>
                  </select>
                </div>
                {/* end of dropdown container */}
              </div>
              <div className="emotion-accuracies">
                {/* <h3>Emotion Accuracies</h3> */}
                {accuracies.map((accuracy, index) => (
                  <div className="emotion-row" key={index}>
                    <div className="combined-div-acc">
                      <div className="emotion-label">
                        {emotion_labels[index]}:
                      </div>
                      <div className="emotion-value">
                        {(accuracy * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* end of emotion accuracies */}
            </div>
            {/* end of acct-stats-dashboard */}
          </div>
          {/* custom-row-2 */}
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(Dashboard);