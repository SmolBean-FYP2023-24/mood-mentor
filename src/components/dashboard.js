import { React, useEffect, useState } from "react"; 
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import "@aws-amplify/ui-react/styles.css";
import chroma from 'chroma-js';

// import './profilePage.css';
import { getProfilePicture } from './profilePageUtils.js';
import Chart from 'chart.js/auto';
import './styles/dashboard.css';
import "./styles/profilePage.css";
import MenuChart from './MenuChart.js';
import ProfilePictureSection from "./ProfilePictureSection.js";
import { dummyData } from './dummyData'; // Import the dummy data
import img from './images/colored/badge200qs.png';
import img1 from './images/greyed-out/badge200qs.png';


import { evaluate, parse, sqrt, exp, pi } from 'mathjs';
import { components } from "@aws-amplify/ui-react";





function BadgeHolder({ badges }) {
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);

  const navigateBadge = (direction) => {
    if (direction === 'prev') {
      setCurrentBadgeIndex((prevIndex) => prevIndex - 1);
    } else if (direction === 'next') {
      setCurrentBadgeIndex((prevIndex) => prevIndex + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        navigateBadge('prev');
      } else if (event.key === 'ArrowRight') {
        navigateBadge('next');
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentBadge = Object.entries(badges)[currentBadgeIndex];
  const [badgeName, badgeValue] = currentBadge;

  console.log(badgeName)
  console.log(badgeValue)

  // C:\Users\Lenovo S540 FSIN\Desktop\1_FYP_2023\FYP_Final\mood-mentor\src\components\images\greyed-out\badge200qs.png
  

  return (
      <div className="badge">
        {badgeValue ? (
          <img src={img} alt={badgeName} style={{ width: '20px', height: '20px' }} />
        ) : (
          <img src={img1} alt={badgeName} style={{ width: '20px', height: '20px' }} />
        )}
        <span className="arrow left-arrow" onClick={() => navigateBadge('prev')}>&larr;</span>
        <span className="arrow right-arrow" onClick={() => navigateBadge('next')}>&rarr;</span>
      </div>
  );

  // C:\Users\Lenovo S540 FSIN\Desktop\1_FYP_2023\FYP_Final\mood-mentor\src\components\images\greyed-out\badge50qs.png

}

// Dashboard function starts here

function Dashboard({ user }) {

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
  const [selectedExercise, setSelectedExercise] = useState('Speaking');

  const handleExerciseChange = (event) => {
    setSelectedExercise(event.target.value);
  };



  // Below is the code for the accuracy charts

  const [selectedExercise_acc, setSelectedExercise_acc] = useState('Speaking');
  const [accuracies, setAccuracies] = useState([]);
  const [trendIndicators, setTrendIndicators] = useState([]);

  const emotion_labels=['happy', 'sad', 'angry', 'fear', 'disgust', 'surprise']

  useEffect(() => {
    updateAccuracies(selectedExercise_acc);
  }, [selectedExercise_acc]);

  const handleExerciseChange_acc = (event) => {
    setSelectedExercise_acc(event.target.value);
  };

  const calculateEmotionAccuracies = (exercise) => {
    const accuracyData = dummyData[`${exercise.toLowerCase()}Accuracy`];

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
          trendIndicators.push('upward');
        } else if (accuracyValues[i] < accuracyValues[i - 1]) {
          trendIndicators.push('downward');
        } else {
          trendIndicators.push('equal');
        }
      }
    }
    return trendIndicators;
  };

  const updateAccuracies = (exercise) => {
  const { labels, accuracies, trendIndicators } = calculateEmotionAccuracies(exercise);

    setAccuracies(accuracies);
    setTrendIndicators(trendIndicators);

    // Destroy the existing chart if it exists
    const existingChart = Chart.getChart("accuracy-chart");
    if (existingChart) {
      existingChart.destroy();
    }

    // Update the chart
    const accuracyChart = document.getElementById('accuracy-chart').getContext('2d');
    new Chart(accuracyChart, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: `${exercise} Accuracy`,
            data: accuracies,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            pointRadius: 3,
            pointHoverRadius: 5,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return (value * 100).toFixed(0) + '%';
              },
            },
          },
        },
      },
    });
  };


  return (
    <div className="container-fluid-dashboard">
       <div className="row-1-dashbaord">
        <div className="col-lg-2 col-md-4">
          <div className="sidebar-dashboard">
            <div> clas

            </div>
            <h2>Navigation</h2>
            <ul>
              <li>Home</li>
              <li>About</li>
              <li>Services</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12">
          {/* Main content goes here */}
          <div className="main-content">
            <div className="row-2-dashboard">
              <div className="badge-holder-dashboard">
                 <BadgeHolder badges={badges}/>
             

              </div>
              <div className="qs-emotion-dashboard">

              <div className="qs-emotion-dashboard-row1">

              <div className="qs-emotion-dashboard-heading">Number of Questions by Emotion</div>
              <div className="exercise-dropdown">
              {/* <label htmlFor="exercise-select">Select Exercise:</label> */}
              <select
                id="exercise-select"
                value={selectedExercise}
                onChange={handleExerciseChange}
              >
                <option value="Speaking">Speaking</option>
                <option value="Listening">Listening</option>
                <option value="Conversation">Conversation</option>
              </select>
            </div>

        </div>
              

             <div className="qs-emotion-dashbaord-inner">

             <Bar
            data={{
              labels: ['Happy', 'Sad', 'Angry', 'Disgust', 'Surprise', 'Fear'],
              datasets: [
                {
                  label:`${selectedExercise} Questions`,
                  data: Object.values(
                    dummyData[selectedExercise.toLowerCase() + 'Question']
                  ),
                  backgroundColor: 'rgba(54, 162, 235, 0.5)', // Color for the selected exercise Questions bars
                },
              ],
            }}
            options={{
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
            {/* end of row2 */}

            <div className="row-3-dashboard">
              <div className="acc-graph-dashboard">

               <canvas id="accuracy-chart"></canvas>
             

              </div>
              <div className="acc-stats-dashboard">
          <h2>Accuracy Statistics</h2>
          <div className="dropdown-container">
            <label htmlFor="exercise-select">Select Exercise:</label>
            <select
              id="exercise-select"
              value={selectedExercise_acc}
              onChange={handleExerciseChange_acc}
            >
              <option value="Listening">Listening</option>
              <option value="Speaking">Speaking</option>
              <option value="Conversation">Conversation</option>
            </select>
          </div>
          <div className="emotion-accuracies">
            <h3>Emotion Accuracies</h3>
            {accuracies.map((accuracy, index) => (
              <div className="emotion-row" key={index}>
                <div className="emotion-label">{emotion_labels[index]}:</div>
                <div className={`emotion-value ${trendIndicators[index]}`}>{(accuracy * 100).toFixed(2)}%</div>
              </div>
            ))}
          </div>
        {/* </div>
      </div> */}



              </div>

            </div>

          </div>
          {/* end of main content */}
        </div>
      </div>
    </div>
    // end of the container-fluid tag

    
 
  );
}


export default Dashboard;