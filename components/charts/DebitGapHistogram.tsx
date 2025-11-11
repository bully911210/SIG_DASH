import React from 'react';
import { Bar } from 'react-chartjs-2';
import { CleanRow } from '../../types';

interface DebitGapHistogramProps {
  data: CleanRow[];
}

const DebitGapHistogram: React.FC<DebitGapHistogramProps> = ({ data }) => {
  const bins = [-1, 5, 10, 15, 20, 25, 30, 40, 50, 60, Infinity];
  const binLabels = ['0-5', '6-10', '11-15', '16-20', '21-25', '26-30', '31-40', '41-50', '51-60', '60+'];
  const binCounts = Array(binLabels.length).fill(0);

  data.forEach(row => {
    const gap = row.debitGap;
    for (let i = 0; i < bins.length - 1; i++) {
      if (gap > bins[i] && gap <= bins[i+1]) {
        binCounts[i]++;
        break;
      }
    }
  });

  const chartData = {
    labels: binLabels,
    datasets: [
      {
        label: 'Number of Sales',
        data: binCounts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Debit Date Gap Distribution',
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
          text: 'Debit Gap (Days)',
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

export default DebitGapHistogram;