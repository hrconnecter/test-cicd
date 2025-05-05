import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const TrainingPie = ({ data, colors, borderColors }) => {
  const chartData = {
    labels: ["Completed", "Overdue", "Pending"],
    datasets: [
      {
        label: "# of Trainings",
        data: [
          data?.completedCount,
          data?.overDue?.length,
          data?.pending?.length,
        ],
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
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
  };

  return (
    <div style={{ width: "80%", margin: "0" }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default TrainingPie;
