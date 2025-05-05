import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TrainingBar = ({ data, colors, borderColors }) => {
  const chartData = {
    labels: ["Completed", "Overdue", "Pending"],
    datasets: [
      {
        label: "# of Trainings",
        data: [data.completedCount, data.overDue.length, data.pending?.length],
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1,
        barThickness: 30,
      },
      {
        label: "# of Trainings",
        data: [data.completedCount, data.overDue.length, data.pending?.length],
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1,
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: "none",
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.raw !== null) {
              label += context.raw;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "80%", height: "200px", margin: "0 auto" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TrainingBar;
