import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { CleanRow } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface DebitGapScatterChartProps {
  data: CleanRow[];
}

const DebitGapScatterChart: React.FC<DebitGapScatterChartProps> = ({ data }) => {
  const passedData = data
    .filter(row => row.qaStatus === 'Passed')
    .map(row => ({ x: row.debitGap, y: row.premiumEffective }));

  const rejectedData = data
    .filter(row => row.qaStatus === 'Rejected')
    .map(row => ({ x: row.debitGap, y: row.premiumEffective }));

  const chartData = {
    datasets: [
      {
        label: 'Passed',
        data: passedData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Rejected',
        data: rejectedData,
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
        text: 'Debit Gap vs. Premium',
        font: { size: 16 }
      },
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const premium = formatCurrency(context.parsed.y);
            const gap = context.parsed.x;
            return `${label}: ${premium} at ${gap} days gap`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Debit Gap (Days)',
        },
        beginAtZero: true,
      },
      y: {
        title: {
          display: true,
          text: 'Effective Premium (R)',
        },
        beginAtZero: true,
        ticks: {
            callback: function(value: any) {
               return formatCurrency(value);
            }
       }
      },
    },
  };

  return <div style={{ height: '400px' }}><Scatter options={options} data={chartData} /></div>;
};

export default DebitGapScatterChart;
