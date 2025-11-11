import React from 'react';
import { Bar } from 'react-chartjs-2';
import { CleanRow } from '../../types';

interface DuplicatesByProductChartProps {
  data: CleanRow[];
}

const DuplicatesByProductChart: React.FC<DuplicatesByProductChartProps> = ({ data }) => {
  const productCounts = data.reduce((acc, row) => {
    acc[row.product] = (acc[row.product] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // FIX: Explicitly cast values to number to resolve TypeScript arithmetic operation error.
  const sortedProducts = Object.entries(productCounts).sort(([, a], [, b]) => (b as number) - (a as number));
  const labels = sortedProducts.map(([product]) => product);
  const counts = sortedProducts.map(([, count]) => count);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Number of Duplicates',
        data: counts,
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Duplicate Sales by Product',
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
          text: 'Product',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count of Duplicates',
        },
        beginAtZero: true,
        ticks: {
            stepSize: 1
        }
      },
    },
  };

  return <div style={{ height: '400px' }}><Bar options={options} data={chartData} /></div>;
};

export default DuplicatesByProductChart;