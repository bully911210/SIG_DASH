import React from 'react';
import { Line } from 'react-chartjs-2';
import { useStore } from '../../services/useStore';
import { Chart as ChartJS, LegendItem } from 'chart.js';

interface AgentTrendChartProps {
  data: Record<string, { date: string; rate: number }[]>;
}

// A vibrant color palette for the chart lines
const COLORS = [
  '#4c51bf', '#667eea', '#ed64a6', '#9f7aea', '#4fd1c5',
  '#f56565', '#f6e05e', '#68d391', '#a0aec0', '#fc8181'
];

const AgentTrendChart: React.FC<AgentTrendChartProps> = ({ data }) => {
  const { setFilters, filters } = useStore();
  const agents = Object.keys(data);
  // FIX: Cast 'd' to access 'date' property, as type inference is failing.
  const allDates = [...new Set(Object.values(data).flat().map(d => (d as { date: string }).date))].sort();

  const handleLegendClick = (e: any, legendItem: LegendItem, legend: any) => {
    const agent = legendItem.text;
    const currentAgents = filters.agents;

    // If agent is already selected, clear the agent filter. Otherwise, filter by this agent.
    const newAgents = currentAgents.includes(agent) ? [] : [agent];
    setFilters({ agents: newAgents });
    
    // Default legend behaviour should be prevented
    ChartJS.defaults.plugins.legend.onClick?.call(legend.chart, e, legendItem, legend);
  };
  
  const datasets = agents.map((agent, index) => {
    const agentData = data[agent];
    const ratesByDate = new Map(agentData.map(d => [d.date, d.rate]));
    return {
      label: agent,
      data: allDates.map(date => ratesByDate.get(date) ?? null), // Use null for missing data points
      borderColor: COLORS[index % COLORS.length],
      backgroundColor: `${COLORS[index % COLORS.length]}33`, // with transparency
      fill: false,
      tension: 0.1,
      spanGaps: true,
    };
  });

  const chartData = {
    labels: allDates,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Agent QA Pass Rate Trend (Daily)',
        font: { size: 16 }
      },
      legend: {
        position: 'top' as const,
        onClick: handleLegendClick,
        labels: {
            generateLabels: (chart: any) => {
                const defaultLabels = ChartJS.defaults.plugins.legend.labels.generateLabels(chart);
                return defaultLabels.map(label => {
                    if (filters.agents.length > 0 && !filters.agents.includes(label.text)) {
                        label.hidden = true; // Visually strike through inactive legends
                    }
                    return label;
                });
            }
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Pass Rate',
        },
        min: 0,
        max: 1,
      },
    },
  };

  return <div style={{ height: '400px' }}><Line options={options} data={chartData} /></div>;
};

export default AgentTrendChart;