/* Inicio Imports */
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
/* Fin Imports */


function StatusChart({ data }) {

  /* Inicio DatosChart */
  const chartData = {
    labels: ["Pendiente", "En Progreso", "Completada"],
    datasets: [
      {
        data: [
          data?.pendiente || 0,
          data?.progreso || 0,
          data?.completada || 0
        ],
        backgroundColor: ["#ec4899", "#7c3aed", "#16a34a"],
        borderWidth: 0,
      },
    ],
  };
  /* Fin DatosChart */


  /* Inicio OpcionesChart */
  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 16,
          font: { size: 12 },
        },
      },
    },
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: false,
  };
  /* Fin OpcionesChart */


  /* Inicio Render */
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "350px",
        height: "320px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <Doughnut data={chartData} options={options} />

      {/* Inicio CentroChart */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "32px",
          color: "#666",
        }}
      >
      </div>
      {/* Fin CentroChart */}
    </div>
  );
  /* Fin Render */
}

export default StatusChart;
