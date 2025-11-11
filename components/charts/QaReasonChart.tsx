import React from 'react';
import { Bar } from 'react-chartjs-2';
import { QaReasonSummary } from '../../types';

interface QaReasonChartProps {
  data: QaReasonSummary[];
}

const QaReasonChart: React.FC<QaReasonChartProps> = ({ data }) => {
  const topReasons = data.slice(0, 10);
  const labels = topReasons.map(d => d.reason);
  const counts = topReasons.map(d => d.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Number of Rejections',
        data: counts,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Top QA Rejection Reasons',
        font: { size: 16 }
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Count of Rejections',
        },
        beginAtZero: true,
      },
      y: {
        title: {
          display: true,
          text: 'Reason',
        },
      },
    },
  };

  return <div style={{ height: '400px' }}><Bar options={options} data={chartData} /></div>;
};

export default QaReasonChart;
