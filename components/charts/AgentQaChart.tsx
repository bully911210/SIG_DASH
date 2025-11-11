
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { CleanRow } from '../../types';

interface AgentQaChartProps {
  data: CleanRow[];
}

const AgentQaChart: React.FC<AgentQaChartProps> = ({ data }) => {
  const agentData = data.reduce((acc, row) => {
    if (!acc[row.agent]) {
      acc[row.agent] = { Passed: 0, Rejected: 0 };
    }
    acc[row.agent][row.qaStatus]++;
    return acc;
  }, {} as Record<string, { Passed: number; Rejected: number }>);

  const labels = Object.keys(agentData).sort((a,b) => (agentData[b].Passed + agentData[b].Rejected) - (agentData[a].Passed + agentData[a].Rejected));

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Passed',
        data: labels.map(agent => agentData[agent].Passed),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Rejected',
        data: labels.map(agent => agentData[agent].Rejected),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Agent QA Results',
        font: { size: 16 }
      },
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
            display: true,
            text: 'Agent'
        }
      },
      y: {
        stacked: true,
        title: {
            display: true,
            text: 'Count of Sales'
        },
        beginAtZero: true
      },
    },
  };

  return <div style={{ height: '400px' }}><Bar options={options} data={chartData} /></div>;
};

export default AgentQaChart;
