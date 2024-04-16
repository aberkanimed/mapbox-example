import React from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto'; //Not used but neccesary is not is going to crash...

const LineChart = () => {
  // Data for the chart
  const data = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        label: '2023',
        data: [42, 47, 43, 35, 42, 53, 43, 56, 46, 38, 49, 55],
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: '2022',
        data: [35, 33, 36, 28, 31, 42, 56, 35, 41, 24, 21, 34],
        fill: false,
        backgroundColor: 'yellow',
        borderColor: 'yellow',
      },
      {
        label: '2021',
        data: [38, 30, 39, 25, 34, 39, 59, 40, 38, 25, 22, 26],
        fill: false,
        backgroundColor: 'orange',
        borderColor: 'orange',
      },
    ],
  };

  // Chart configuration options
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <div>
      <h2>Years incidents</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
