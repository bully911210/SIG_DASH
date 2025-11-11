import React from 'react';
import { Bar } from 'react-chartjs-2';

interface AgentConsistencyChartProps {
  data: { agent: string; consistencyIndex: number }[];
}

const AgentConsistencyChart: React.FC<AgentConsistencyChartProps> = ({ data }) => {
  const labels = data.map(d => d.agent);
  const consistencyData = data.map(d => d.consistencyIndex);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Consistency Index',
        data: consistencyData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Agent Consistency Index',
        font: { size: 16 }
      },
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(1) + '%';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Agent',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Index Value (Higher is more consistent)',
        },
        beginAtZero: true,
        max: 100
      },
    },
  };

  return <div style={{ height: '400px' }}><Bar options={options} data={chartData} /></div>;
};

export default AgentConsistencyChart;
