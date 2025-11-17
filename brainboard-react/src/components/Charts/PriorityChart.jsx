/* Inicio Imports */
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
/* Fin Imports */


function PriorityChart({ data }) {

  /* Inicio DatosChart */
  const chartData = {
    labels: ["Alta", "Media", "Baja"],
    datasets: [
      {
        label: "Cantidad",
        data: [data?.alta || 0, data?.media || 0, data?.baja || 0],
        backgroundColor: ["#ef4444", "#f59e0b", "#3b82f6"],
        borderRadius: 10,
        barThickness: 40,
      },
    ],
  };
  /* Fin DatosChart */


  /* Inicio OpcionesChart */
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { bodyFont: { size: 13 } },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: "#e5e7eb" },
      },
      x: {
        ticks: { font: { size: 12 } },
        grid: { display: false },
      },
    },
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
      }}
    >
      <Bar data={chartData} options={options} />
    </div>
  );
  /* Fin Render */
}

export default PriorityChart;
