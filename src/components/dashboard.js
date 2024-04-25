import React, { useEffect, useRef, useState } from "react";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
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
import { getUserDataModel } from "../graphql/queries.js";
import img from "./images/colored/badge200qs.png";
import * as subscriptions from "../graphql/subscriptions";
import img1 from "./images/greyed-out/badge200qs.png";
import { generateClient } from "aws-amplify/api";
import BadgeList from "./badges.js";
import { forEach } from "mathjs";
import { initUserData } from "./data/initUserData.js";

// function MyChart() {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     const canvas = chartRef.current;
//     const ctx = canvas.getContext("2d");
//     let myBarChart = null;

//     // Base colors
//     const baseColors = ["#50C4ED", "#387ADF", "#333A73"];

//     // Generate shades of colors based on the base colors
//     const colorScale = chroma.scale(baseColors).mode("lch").colors(10);
//     function createGlossyColor(color) {
//       const glossyColor = chroma(color).alpha(0.6).css();
//       return glossyColor;
//     }

//     const userIndex = 4; // Index of the user's percentile (e.g., 4 for 60%)
//     const backgroundColor = colorScale.map((color, index) =>
//       index === userIndex ? createGlossyColor(color) : baseColors[1]
//     );

//     const data = {
//       labels: ["20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"],
//       datasets: [
//         {
//           data: [4, 8, 15, 30, 40, 30, 15, 8, 4],
//           backgroundColor,
//         },
//       ],
//     };

//     const options = {
//       tooltips: {
//         enabled: false,
//       },
//       legend: {
//         display: false,
//       },
//       annotation: {
//         annotations: [
//           {
//             type: "line",
//             mode: "vertical",
//             scaleID: "x-axis-0",
//             value: "70%",
//             borderColor: "black",
//             label: {
//               content: "Your Score",
//               enabled: true,
//               position: "center",
//             },
//           },
//         ],
//       },
//       scales: {
//         yAxes: [
//           {
//             display: false,
//           },
//         ],
//         xAxes: [
//           {
//             barPercentage: 1.0,
//             categoryPercentage: 1.0,
//             gridLines: {
//               display: false,
//             },
//             scaleLabel: {
//               display: true,
//               labelString: "Average Score",
//             },
//           },
//         ],
//       },
//     };

//     if (canvas && canvas.id === "myChart") {
//       // Destroy existing chart instance if it exists
//       if (Chart.instances[0]) {
//         Chart.instances[0].destroy();
//       }

//       // Create new chart instance
//       myBarChart = new Chart(ctx, {
//         type: "bar",
//         data,
//         options,
//       });
//     }

//     return () => {
//       // Cleanup code to destroy the chart instance
//       if (myBarChart) {
//         myBarChart.destroy();
//       }
//     };
//   }, []);

//   return <canvas ref={chartRef} id="myChart" />;
// }

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

  // console.log(badgeName);
  // console.log(badgeValue);

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
}

// Dashboard function starts here
function Dashboard() {
  const client = generateClient();
  let globalUser = "";

  const [userState, setUserState] = useState({});
  const [userDets, setUserDets] = useState(initUserData);
  const effectRan = useRef(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const user = await fetchAuthSession();
        setUserState(user.tokens.idToken.payload);
        globalUser = userState.sub;
      } catch {
        setUserState(0);
      }
    };
    getUserData();
  });

  let onCreateSub;
  function setUpSubscriptions() {
    const variables = {
      filter: {
        username: { eq: globalUser }, // replace with User Sub using fetchAuthSession | userState
      },
    };
    onCreateSub = client
      .graphql({ query: subscriptions.onUpdateUserDataModel }, variables)
      .subscribe({
        next: ({ data }) => {
          console.log(data);
          setUserDets(data["onUpdateUserDataModel"]);
        },
        error: (error) => console.log(error),
      });
  }

  useEffect(() => {
    setUpSubscriptions();
    return () => {
      onCreateSub.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const check = async () => {
      if (effectRan.current === true) {
        return;
      } else {
        effectRan.current = true;
        let user1 = await client.graphql({
          query: getUserDataModel,
          variables: {
            username: (await getCurrentUser()).userId, // replace with User Sub using fetchAuthSession | userState
          },
        });
        setUserDets(user1["data"]["getUserDataModel"]);
        generateBadges(
          user1["data"]["getUserDataModel"]["badges"],
          user1["data"]["getUserDataModel"]["SpeakingQuestions"],
          user1["data"]["getUserDataModel"]["ListeningQuestions"]
        );
        console.log(user1["data"]["getUserDataModel"]);
      }
    };
    check();
  });

  const [selectedExercise, setSelectedExercise] = useState("Speaking");

  // useEffect(() => {
  //   handleExerciseChange();
  // }, [selectedExercise]);

  // const handleExerciseChange = (event) => {
  //   setSelectedExercise(event.target.value);
  // };

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

  function generateBadges(badges, speaking, listening) {
    delete speaking["__typename"];
    delete listening["__typename"];
    console.log(badges);
    let keysWithTrueValue = Object.keys(badges).filter(
      (key) => badges[key] === true
    );
    console.log(keysWithTrueValue);
    var store = document.getElementById("newBadges");
    document.getElementById("numBadge").innerText =
      Array.from(keysWithTrueValue).length;
    Array.from(keysWithTrueValue).forEach((e) => {
      var ele = createBadge(e);
      store.appendChild(ele);
    });

    let totalSum = 0.0;
    for (let key in speaking) {
      totalSum += speaking[key];
    }
    for (let key in listening) {
      totalSum += listening[key];
    }
    document.getElementById("numQ").innerText = totalSum;
  }

  function createBadge(key) {
    var badge = document.createElement("h3");
    badge.classList.add("badge", "m-2", "bg-primary");
    badge.innerText = key; // Also, innerText is a property, not a method.
    return badge;
  }

  return (
    <div className="container-fluid h-100 w-100 p-0">
      <div className="row w-100 p-0 m-0">
        <div className="col-md-3 p-0 m-0">
          <div className="sidebar-dashboard bg-light border-dark border-right border-0 d-flex flex-column">
            <ProfilePictureSection />
            <div className="text-user-dashboard my-4 text-center">
              {userState.given_name + " " + userState.family_name}
              <br />
            </div>

            <a href="/lex">
              <button className="profile-button my-2">
                Listening Exercise
              </button>
            </a>
            <a href="/eex">
              <button className="profile-button my-2">Speaking Exercise</button>
            </a>
            <a href="/cex">
              <button className="profile-button my-2">
                Conversational Exercise
              </button>
            </a>
          </div>
        </div>
        <div className="col-md-9 text-center">
          <div className="row p-0 m-0 w-100">
            <div className="col-md-6 py-3 text-center">
              <div className="container" style={{ height: "30vh" }}>
                <div className="badge-holder-dashboard card h-100 py-1">
                  <div className="subheading py-3">Badges</div>
                  <div>
                    <div id="newBadges"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 py-3 text-center">
              <div className="container" style={{ height: "30vh" }}>
                <div className="badge-holder-dashboard card h-100 py-1">
                  <div className="subheading py-3">Statistics</div>
                  <div className="py-3">
                    <div className="row p-0 m-0 d-flex justify-content-center align-items-center">
                      <div className="stat col-3">
                        <span
                          style={{
                            fontWeight: "bolder",
                            fontSize: "medium",
                          }}
                        >
                          Level
                        </span>
                        <br></br>
                        {userDets["level"]}
                      </div>
                      <div className="stat col-3">
                        <span
                          style={{
                            fontWeight: "bolder",
                            fontSize: "medium",
                          }}
                        >
                          Streak
                        </span>
                        <br></br>
                        {userDets["streak"]}
                      </div>
                      <div className="stat col-3">
                        <span
                          style={{
                            fontWeight: "bolder",
                            fontSize: "medium",
                          }}
                        >
                          #Badges
                        </span>
                        <br></br>
                        <div id="numBadge"></div>
                      </div>
                      <div className="stat col-3">
                        <span
                          style={{
                            fontWeight: "bolder",
                            fontSize: "medium",
                          }}
                        >
                          #Questions
                        </span>
                        <br></br>
                        <div id="numQ"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row px-4 m-0 w-100" style={{ height: "45vh" }}>
            <div className="col-md-6 p-3 text-center">
              <div className="subheading py-3">
                Listening Questions per Emotion
              </div>
              <div className="container" style={{ height: "45vh" }}>
                <Bar
                  data={{
                    labels: Array.from(
                      Object.keys(userDets["ListeningQuestions"])
                    )
                      .slice(0, 6)
                      .map((label) =>
                        label === "Surprise" ? "Neutral" : label
                      ),

                    datasets: [
                      {
                        label: `Listening Questions`,
                        data: Array.from(
                          Object.values(userDets["ListeningQuestions"])
                        ).slice(0, 6),
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
            </div>
            <div className="col-md-6 p-3 text-center">
              <div className="subheading py-3">
                Speaking Questions per Emotion
              </div>
              <div className="container" style={{ height: "45vh" }}>
                <Bar
                  data={{
                    labels: Array.from(
                      Object.keys(userDets["SpeakingQuestions"])
                    )
                      .slice(0, 6)
                      .map((label) =>
                        label === "Surprise" ? "Neutral" : label
                      ),

                    datasets: [
                      {
                        label: `Listening Questions`,
                        data: Array.from(
                          Object.values(userDets["SpeakingQuestions"])
                        ).slice(0, 6),
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
            </div>
          </div>
        </div>
      </div>
    </div>
    //     <div className="col-lg-9 col-md-8 p-0 m-0">
    //       <div className="row">
    //         {/* <div className="col-md-3">
    //           <div className="badge-holder-dashboard">
    //             <div
    //               className="subheading"
    //               style={{
    //                 display: "flex",
    //                 justifyContent: "center",
    //                 alignItems: "center",
    //               }}
    //             >
    //               Badges
    //             </div>
    //             <div>
    //               <div id="newBadges"></div>
    //             </div>
    //           </div>
    //         </div> */}
    //         <div className="qs-emotion-dashboard">
    //           <div className="qs-emotion-dashboard-row1">
    //             <div className="accuracy-table-heading">
    //               <div className="subheading">Questions Practiced </div>

    //               <select
    //                 id="exercise-select"
    //                 value={selectedExercise}
    //                 // onChange={handleExerciseChange}
    //               >
    //                 <option value="Speaking">Speaking</option>
    //                 <option value="Listening">Listening</option>
    //                 <option value="Coversation">Conversation</option>
    //               </select>
    //             </div>
    //           </div>

    //           <div
    //             className="qs-emotion-dashboard-inner"
    //             style={{ width: "800px" }}
    //           >
    //             <Bar
    //               data={{
    //                 labels: Array.from(
    //                   Object.keys(userDets[selectedExercise + "Questions"])
    //                 )
    //                   .slice(0, 6)
    //                   .map((label) =>
    //                     label === "Surprise" ? "Neutral" : label
    //                   ),

    //                 datasets: [
    //                   {
    //                     label: `${selectedExercise} Questions`,
    //                     data: Array.from(
    //                       Object.values(
    //                         userDets[selectedExercise + "Questions"]
    //                       )
    //                     ).slice(0, 6),
    //                     backgroundColor: "rgba(54, 162, 235, 0.5)", // Color for the selected exercise Questions bars
    //                   },
    //                 ],
    //               }}
    //               options={{
    //                 responsive: true,
    //                 maintainAspectRatio: false,
    //                 scales: {
    //                   y: {
    //                     beginAtZero: true,
    //                     ticks: {
    //                       precision: 0, // Display integers for y-axis ticks
    //                     },
    //                   },
    //                 },
    //                 plugins: {
    //                   legend: {
    //                     display: false, // Disable the legend
    //                   },
    //                 },
    //               }}
    //             />
    //           </div>
    //         </div>
    //       </div>

    //       <div className="custom-row-2">
    //         {/* <MenuChart /> */}
    //         <div className="acc-graph-dashboard">
    //           {/* <canvas id="accuracy-chart"></canvas> */}
    //           <Line
    //             data={data_qs_per_week}
    //             options={{
    //               ...options,
    //               responsive: true,
    //               maintainAspectRatio: false,
    //             }}
    //           />
    //         </div>
    //         {/* end of acc-graph-dashboard */}
    //         <div className="acc-stats-dashboard">
    //           {/* <h2>Accuracy Statistics</h2> */}
    //           <div className="accuracy-table-heading">
    //             <div className="subheading">Accuracies </div>
    //             <div className="exercise-dropdown-container-acc">
    //               <select
    //                 id="exercise-select-acc"
    //                 value={selectedExercise_acc}
    //                 onChange={handleExerciseChange_acc}
    //               >
    //                 <option value="Listening">Listening</option>
    //                 <option value="Speaking">Speaking</option>
    //                 <option value="Conversation">Conversation</option>
    //               </select>
    //             </div>
    //           </div>
    //           <div className="emotion-accuracies">
    //             {accuracies.map((accuracy, index) => (
    //               <div className="emotion-row" key={index}>
    //                 <div className="combined-div-acc">
    //                   <div className="emotion-label">
    //                     {emotion_labels[index]}:
    //                   </div>
    //                   <div className="emotion-value">
    //                     {(accuracy * 100).toFixed(2)}%
    //                   </div>
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default withAuthenticator(Dashboard);
