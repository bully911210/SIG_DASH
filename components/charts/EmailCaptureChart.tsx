import React from 'react';
import { Bar } from 'react-chartjs-2';
import { AgentSummary } from '../../types';
import { formatPercentage } from '../../utils/helpers';

interface EmailCaptureChartProps {
  data: AgentSummary[];
}

const EmailCaptureChart: React.FC<EmailCaptureChartProps> = ({ data }) => {
  
  const sortedData = [...data].sort((a,b) => b.passRate - a.passRate); // Re-using passRate logic for email for now. Need to update hook
  
  // This needs to be calculated in the hook and passed in.
  // For now, let's assume agentSummary has an emailCaptureRate property
  const agentData = data.map(agent => ({
      agent: agent.agent,
      // Placeholder logic, this should come from useFilteredData
      emailCaptureRate: Math.random() 
  })).sort((a, b) => b.emailCaptureRate - a.emailCaptureRate);


  const labels = agentData.map(d => d.agent);
  const rates = agentData.map(d => d.emailCaptureRate);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Email Capture Rate',
        data: rates,
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
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
        text: 'Email Capture Rate by Agent',
        font: { size: 16 }
      },
      legend: {
        display: false
      },
       tooltip: {
        callbacks: {
          label: function(context: any) {
             if (context.parsed.x !== null) {
              return formatPercentage(context.parsed.x);
            }
            return '';
          }
        }
      }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Capture Rate (%)'
            },
            min: 0,
            max: 1,
            ticks: {
                 callback: function(value: any) {
                    return formatPercentage(value);
                 }
            }
        },
        y: {
            title: {
                display: true,
                text: 'Agent'
            }
        }
    }
  };

  return <div style={{ height: '400px' }}><Bar options={options} data={chartData} /></div>;
};

export default EmailCaptureChart;
