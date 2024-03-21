import React, { useEffect, useRef , useState} from "react";  
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import "@aws-amplify/ui-react/styles.css";

// import './profilePage.css';
import { getProfilePicture } from './profilePageUtils.js';
import Chart from 'chart.js/auto';
import './dashboard.css';


import { evaluate, parse, sqrt, exp, pi } from 'mathjs';

function generateNormalDistributionData(mean, standardDeviation, minX, maxX, step) {
  const data = [];
  for (let x = minX; x <= maxX; x += step) {
    const exponent = -((x - mean) ** 2) / (2 * standardDeviation ** 2);
    const y = (1 / (standardDeviation * sqrt(2 * pi))) * exp(exponent);
    data.push(y);
  }
  return data;
}


function NormalDistributionChart({ mean, standardDeviation, minX, maxX, step }) {
  const data = generateNormalDistributionData(mean, standardDeviation, minX, maxX, step);

  const chartData = {
    labels: data.map(point => point.x),
    datasets: [
      {
        label: 'Normal Distribution',
        data: data.map(point => point.y),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'X',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Y',
        },
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
}


// const emotions = {
//   1: "neutral",
//   2: "happy",
//   3: "sad",
//   4: "angry",
//   5: "fear",
//   6: "disgust",
// };
// const selectedProfilePicture = getProfilePicture();

function Dashboard({ user }) {

  // CHART1: FOR NORMAL DISTRIBUTION

  const mean = 0; // Define the mean value
  const standardDeviation = 1; // Define the standard deviation value
  const minX = -5; // Define the minimum x value
  const maxX = 5; // Define the maximum x value
  const step = 0.1; // Define the step value

  const data = generateNormalDistributionData(mean, standardDeviation, minX, maxX, step);

  const labels = [];
  for (let x = minX; x <= maxX; x += step) {
    labels.push(x.toFixed(1));
  }

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Normal Distribution',
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'X',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Probability Density',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.dataset.data[context.dataIndex];
            const rank = context.dataIndex + 1;
            return `Rank: ${rank}, Probability Density: ${value.toFixed(2)}`;
          },
        },
      },
    },
  };


  // CHART2: LINE CHART FOR QUESTIONS PER WEEK

  const data_qs_per_week = {
    labels: [1, 2, 3, 4, 5, 6, 7], // Week numbers
    datasets: [
      {
        label: 'Number of Questions Practiced',
        data: [10, 15, 8, 12, 20, 16, 25], // Number of questions practiced per week
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
          text: 'Number of Questions Practiced',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Week Number',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            if (label) {
              return `${label}: ${context.parsed.y}`;
            }
            return `${context.parsed.y}`;
          },
        },
      },
    },
  };

  


  return (
    <div className="container-fluid">
      {/* <h1 className="top-text">Dashboard</h1> */}
  <div className="row">
    


      <div className="profile-box">
        <div className="profile-header">
          <div className="profile-info">
            <h2 className="welcome-text">Hey, CHUNG, Li, welcome back {user}!</h2>
            {/* <h3 className="username"> {user}</h3> */}
          </div>
          <iframe
            className="profile-image"
            // src="https://giphy.com/embed/EhTL8YYF56gZa5qzp0"
            width="400"
            height="480"
            frameBorder="0"
            allowFullScreen
          ></iframe>
          <p>
            {/* <a href="https://giphy.com/stickers/disneyanimation-disney-animation-strange-world-EhTL8YYF56gZa5qzp0"></a> */}
          </p>
        </div>
        
      </div>

      <div className="normal-box">
            <p>We put the badges here </p>
        </div> 
  </div>
  {/* end of the row tag */}


  <div className="custom-row">

    <button className="profile-button">Listening Exercise</button>
      <button className="profile-button">Speaking Exercise</button>
      <button className="profile-button">Conversational Exercise</button>
         </div>

  <div className="custom-row-1">

    <div className="chart-box-normal">
            <div className="chart-container">
                <Bar data={chartData} options={chartOptions} />
                
              </div>
    </div> 

        <div className="chart-box-practice-qs">
            
                  <div className="chart-container">
                  <Line data={data_qs_per_week} options={options} />
                </div>
        </div>    

  </div>


 


  

      
       
      
      
    </div>
    // end of the container-fluid tag

    
 
  );
}


export default Dashboard;
