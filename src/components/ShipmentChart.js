import React from "react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import {
  Pie,
  Doughnut
} from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function ShipmentChart({
  delivered,
  pending
}) {

  const data = {
    labels: [
      "Delivered",
      "Pending"
    ],

    datasets: [
      {
        data: [
          delivered,
          pending
        ],

        backgroundColor: [
          "#22c55e",
          "#ef4444"
        ],

        borderWidth: 1
      }
    ]
  };

  return (

    <div>

      <h4>Shipment Status</h4>

      <div
        style={{
          width: "250px",
          margin: "auto"
        }}
      >
        <Doughnut data={data} />
      </div>

    </div>

  );
}

export default ShipmentChart;