import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import './styles/MenuChart.css';

const MenuChart = () => {
  const [exercise, setExercise] = useState('Listening');
  const [emotion, setEmotion] = useState('Happy');

  const exerciseOptions = ['Listening', 'Speaking'];
  const emotionOptions = ['Happy', 'Sad', 'Angry', 'Fear', 'Disgust', 'Surprise'];

  const handleExerciseChange = (exercise) => {
    setExercise(exercise);
  };

  const handleEmotionChange = (emotion) => {
    setEmotion(emotion);
  };

  // Color mapping for emotions
  const emotionColors = {
    Happy:'rgba(255, 205, 86, 1)' ,
    Sad: 'rgba(54, 162, 235, 1)',
    Angry: 'rgba(255, 99, 132, 1)',
    Fear: 'rgba(75, 192, 192, 1)',
    Disgust: 'rgba(153, 102, 255, 1)',
    Surprise: 'rgba(255, 159, 64, 1)',
  };

  // Mock data for demonstration
  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: `${exercise} - ${emotion}`,
        data: [80, 85, 90, 95],
        fill: false,
        borderColor: emotionColors[emotion], // Set color dynamically based on selected emotion
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Week',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Accuracy Levels',
        },
        min: 0,
        max: 100,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="menu-chart-container">
      <div className="menu">
        <h3>Select Exercise:</h3>
        <select value={exercise} onChange={(e) => handleExerciseChange(e.target.value)}>
          {exerciseOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <h3>Select Emotion:</h3>
        <select value={emotion} onChange={(e) => handleEmotionChange(e.target.value)}>
          {emotionOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="chart">
        <div className="chart-box">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default MenuChart;
