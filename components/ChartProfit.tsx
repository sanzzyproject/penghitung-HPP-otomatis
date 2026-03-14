import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  labaBulanan: number; // laba bersih per bulan
}

const ChartProfit: React.FC<Props> = ({ labaBulanan }) => {
  const days = Array.from({ length: 30 }, (_, i) => `Hari ${i + 1}`);

  // Simulasi data 30 hari dengan tren naik/fluktuasi
  const base = labaBulanan / 30;
  const kondisiRame = days.map((_, i) => base * (1 + 0.3 * Math.sin(i / 5)) * (1 + i / 100));
  const target = days.map((_, i) => base * (1 + 0.1 * Math.sin(i / 7)) * (1 + i / 150));
  const kondisiSepi = days.map((_, i) => base * (0.7 + 0.2 * Math.sin(i / 4)) * (1 + i / 200));

  const data = {
    labels: days,
    datasets: [
      {
        label: 'Kondisi Rame',
        data: kondisiRame,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Target',
        data: target,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Kondisi Sepi',
        data: kondisiSepi,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Proyeksi Laba (30 Hari)',
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => 'Rp ' + value.toLocaleString(),
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border h-80">
      <Line data={data} options={options} />
    </div>
  );
};

export default ChartProfit;
