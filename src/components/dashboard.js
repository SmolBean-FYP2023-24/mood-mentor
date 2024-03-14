import React, { useEffect, useRef } from "react";
import "@aws-amplify/ui-react/styles.css";
import "./styles/profilePage.css";
import { getProfilePicture } from "./profilePageUtils.js";
import Chart from "chart.js/auto";

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
        <div className="col-md-3">
          <img
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid black",
            }}
            src={selectedProfilePicture}
            alt=""
          />
        </div>
        <div className="col-md-9">
          <div>
            <label
              htmlFor=""
              className="mt-3"
              style={{ fontWeight: "bold", fontSize: "larger" }}
            >
              Name: {user}
            </label>
            <br />
            <label htmlFor="" className="mt-3 font-semibold text-5xl">
              Level:{" "}
            </label>
            <br />
          </div>
        </div>
      </div>

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
