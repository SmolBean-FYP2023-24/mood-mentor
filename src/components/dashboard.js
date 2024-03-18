import React, { useEffect, useRef } from "react";
import "@aws-amplify/ui-react/styles.css";

import './profilePage.css';
import { getProfilePicture } from './profilePageUtils.js';
import Chart from 'chart.js/auto';
import './dashboard.css';


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
  const chartRef = useRef(null);
  const selectedProfilePicture = getProfilePicture();

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const data = {
      labels: ["Label 1", "Label 2", "Label 3"],
      datasets: [
        {
          label: "Dataset 1",
          data: [10, 20, 30],
          backgroundColor: "rgba(0, 123, 255, 0.5)",
          borderColor: "rgba(0, 123, 255, 1)",
          borderWidth: 1,
        },
      ],
    };

    const options = {
      // Configure additional options as needed
    };

    // Create the chart
    const chart = new Chart(ctx, {
      type: "bar",
      data: data,
      options: options,
    });

    // Clean up the chart on component unmount
    return () => {
      chart.destroy();
    };
  }, []);


  return (
      <div className="container-fluid">
        <div className="row">
            <div className="profile-box">
                <div className="profile-header">
                  <div className="profile-info">
                    <h2 className="welcome-text">Hey, CHUNG, Li, welcome back {user}!</h2>
                    {/* <h3 className="username"> {user}</h3> */}
                  </div>
                    <iframe
                      className="profile-image"
                      src="https://giphy.com/embed/EhTL8YYF56gZa5qzp0"
                      width="400"
                      height="480"
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                    <p>
                      <a href="https://giphy.com/stickers/disneyanimation-disney-animation-strange-world-EhTL8YYF56gZa5qzp0"></a>
                    </p>
                </div>
                <div className="profile-footer">
                <div class="button-container">
                    <button class="profile-button">Listening Exercise</button>
                    <button class="profile-button">Speaking Exercise</button>
                    <button class="profile-button">Conversational Exercise</button>
                </div>
                </div>
            </div>
          <div className="col-md-9">
            
                <div className="row">
              <div className="col-md-9 offset-md-3">
                <canvas ref={chartRef} id="okCanvas2" width="400" height="100">
                  <p>Hello Fallback World</p>
                </canvas>
              </div>
            </div>
          </div>
        </div>
    
        

      {/* </div> */}

      <div className="row">
        <div className="col-md-9 offset-md-3">
          <canvas ref={chartRef} id="okCanvas2" width="400" height="100">
            <p>Hello Fallback World</p>
          </canvas>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
