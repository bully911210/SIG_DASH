import React from 'react';
import { Bar } from 'react-chartjs-2';
import { CleanRow } from '../../types';

interface DebitDayDistributionChartProps {
  data: CleanRow[];
}

const DebitDayDistributionChart: React.FC<DebitDayDistributionChartProps> = ({ data }) => {
  const dayCounts = Array(31).fill(0);

  data.forEach(row => {
    if (row.debitDate) {
      const dayOfMonth = row.debitDate.getDate(); // 1-31
      if (dayOfMonth >= 1 && dayOfMonth <= 31) {
        dayCounts[dayOfMonth - 1]++;
      }
    }
  });

  const labels = Array.from({ length: 31 }, (_, i) => String(i + 1));

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Number of Sales',
        data: dayCounts,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Debit Day Distribution',
        font: { size: 16 }
      },
      legend: {
        display: false
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Day of Month',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count of Sales',
        },
        beginAtZero: true,
      },
    },
  };

  return <div style={{ height: '400px' }}><Bar options={options} data={chartData} /></div>;
};

export default DebitDayDistributionChart;
