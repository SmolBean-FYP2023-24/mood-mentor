import React, { useEffect, useRef , useState} from "react";  
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
import { dummyData } from "./dummyData.js";


import { evaluate, parse, sqrt, exp, pi } from 'mathjs';


function MyChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    let myBarChart = null;

    // Base colors
    const baseColors = ["#50C4ED", "#387ADF", "#333A73"];

    // Generate shades of colors based on the base colors
    const colorScale = chroma.scale(baseColors).mode('lch').colors(10);
    function createGlossyColor(color) {
      const glossyColor = chroma(color).alpha(0.6).css();
      return glossyColor;
    }

    const userIndex = 4; // Index of the user's percentile (e.g., 4 for 60%)
    const backgroundColor = colorScale.map((color, index) =>
    index === userIndex ? createGlossyColor(color) : baseColors[1]
    );

    



    const data = {
      labels: [
        "20%",
        "30%",
        "40%",
        "50%",
        "60%",
        "70%",
        "80%",
        "90%",
        "100%"
      ],
      datasets: [
        {
          data: [
            4,
            8,
            15,
            30,
            40,
            30,
            15,
            8,
            4
          ],
          backgroundColor,
        }
      ]
    };

    const options = {
      tooltips: {
        enabled: false
      },
      legend: {
        display: false
      },
      annotation: {
        annotations: [
          {
            type: "line",
            mode: "vertical",
            scaleID: "x-axis-0",
            value: "70%",
            borderColor: "black",
            label: {
              content: "Your Score",
              enabled: true,
              position: "center"
            }
          }
        ]
      },
      scales: {
        yAxes: [
          {
            display: false
          }
        ],
        xAxes: [
          {
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: "Average Score"
            }
          }
        ]
      }
    };

    if (canvas && canvas.id === 'myChart') {
      // Destroy existing chart instance if it exists
      if (Chart.instances[0]) {
        Chart.instances[0].destroy();
      }

      // Create new chart instance
      myBarChart = new Chart(ctx, {
        type: 'bar',
        data,
        options,
      });
    }

    return () => {
      // Cleanup code to destroy the chart instance
      if (myBarChart) {
        myBarChart.destroy();
      }
    };
  }, []);

  return <canvas ref={chartRef} id="myChart" />;
}


// Dashboard function starts here

function Dashboard({ user }) {

  
  // CHART2: LINE CHART FOR QUESTIONS PER WEEK

  const data_qs_per_week = {
    labels: [1, 2, 3, 4,5,6,7], // Week numbers
    legend: {
      display: false, // Hide the legend
    },
    datasets: [
      {
        label:'Number of Questions Practiced',
        data: [10, 15, 8, 12, 20, 16, 25], // Number of questions practiced per week
        fill: true,
        // const baseColors = ["#50C4ED", "#387ADF", "#333A73"];
        backgroundColor: 'rgba(56, 122, 223, 0.7)',
        borderColor: 'rgba(56, 122, 223, 1)',
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
          text: 'Week Number',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Questions Practiced',
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
    <div className="container-fluid-dashboard">
      {/* <h1 className="top-text">Dashboard</h1> */}

      <div className="row-1-dashbaord">
            <div className="col-lg-3 col-md-4">
              <div className="sidebar-dashboard">
              <ProfilePictureSection/> 

                  <a href="/lex">
                  <button className="profile-button">Listening Exercise</button>
                </a>
                <a href="/eex">
                  <button className="profile-button">Speaking Exercise</button>
                </a>
                <a href="/cex">
                  <button className="profile-button">Conversational Exercise</button>
                </a>
                              
                </div>

                  
            </div>

            <div className="col-lg-9 col-md-8">

            <div className="chart-box-normal">
              <div className="chart-container">
                  {/* <Bar data={chartData} options={chartOptions} /> */}
                  <MyChart />
             </div>
             </div>

            </div> 
        </div>
  
  <div className="row-dashboard">
    


      {/* <div className="profile-box-dashboard">
        <div className="profile-header">

          <div className="profile-info">
            
          </div>
         
        </div>
        
      </div> */}

      {/* <div className="normal-box-dashboard">
            
        <div className='badge-text-row'>
               <h2 className="welcome-text"> ACHIEVEMENTS </h2>
        </div>

        <div className="badges">

        <div className="badge1">
            <img src="https://imgur.com/sPI6W5u.png" alt="Embedded Image"/>
          </div>

          <div className="badge2">
            <img src="https://imgur.com/sPI6W5u.png" alt="Embedded Image"/>
          </div>
        </div>
        </div>  */}
  </div>
  {/* end of the row tag */}

  <div className="custom-row-1">

      <div className="chart-box-normal">
              <div className="chart-container">
                  {/* <Bar data={chartData} options={chartOptions} /> */}
                  <MyChart />
              </div>
      </div> 

      <div className="chart-box-practice-qs">
            <Line data={data_qs_per_week} options={options} />
      </div>    

  </div>

  <div className="custom-row-2"> 
   
      <MenuChart />
    
  </div>


 


  

      
       
      
      
    </div>
    // end of the container-fluid tag

    
 
  );
}


export default Dashboard;