import React from 'react';
import { Line } from 'react-chartjs-2';
import { formatPercentage } from '../../utils/helpers';

interface RollingQaChartProps {
  data: { date: string; rate: number }[];
}

const RollingQaChart: React.FC<RollingQaChartProps> = ({ data }) => {
  const labels = data.map(d => d.date);
  const rates = data.map(d => d.rate);

  const chartData = {
    labels,
    datasets: [
      {
        label: '7-Day Rolling Pass Rate',
        data: rates,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.1,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'QA Pass Rate (7-Day Rolling Average)',
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
          text: 'Date',
        },
        ticks: {
            maxTicksLimit: 10
        }
      },
      y: {
        title: {
          display: true,
          text: 'Pass Rate',
        },
        min: 0,
        max: 1,
        ticks: {
            callback: function(value: any) {
                return formatPercentage(value);
            }
        }
      },
    },
  };

  return <div style={{ height: '400px' }}><Line options={options} data={chartData} /></div>;
};

export default RollingQaChart;
