
import React from 'react';
import { Line } from 'react-chartjs-2';
import { CleanRow } from '../../types';
import { eachDayOfInterval, format, parseISO } from 'date-fns';

interface QaTrendChartProps {
  data: CleanRow[];
}

const QaTrendChart: React.FC<QaTrendChartProps> = ({ data }) => {
  const dateCounts = data.reduce((acc, row) => {
    const date = row.date;
    if (!acc[date]) {
      acc[date] = { Passed: 0, Rejected: 0 };
    }
    acc[date][row.qaStatus]++;
    return acc;
  }, {} as Record<string, { Passed: number; Rejected: number }>);

  const sortedDates = Object.keys(dateCounts).sort();
  const labels = sortedDates;

  if (sortedDates.length > 1) {
    const interval = eachDayOfInterval({
        start: parseISO(sortedDates[0]),
        end: parseISO(sortedDates[sortedDates.length - 1]),
    });
    const allLabels = interval.map(d => format(d, 'yyyy-MM-dd'));

    const passedData = allLabels.map(label => dateCounts[label]?.Passed || 0);
    const rejectedData = allLabels.map(label => dateCounts[label]?.Rejected || 0);

    const chartData = {
        labels: allLabels,
        datasets: [
        {
            label: 'Passed',
            data: passedData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.1
        },
        {
            label: 'Rejected',
            data: rejectedData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            tension: 0.1
        },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
        title: {
            display: true,
            text: 'QA Result Trend (Daily)',
            font: { size: 16 }
        },
        legend: {
            position: 'top' as const,
        },
        },
        scales: {
            x: {
                title: { display: true, text: 'Date' }
            },
            y: {
                title: { display: true, text: 'Count' },
                beginAtZero: true,
            }
        }
    };

    return <div style={{ height: '400px' }}><Line options={options} data={chartData} /></div>;

  }
  return <div className="h-[400px] flex items-center justify-center text-gray-500">Not enough data for a trend chart.</div>
};

export default QaTrendChart;
