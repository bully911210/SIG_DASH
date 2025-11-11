import React from 'react';
import { Line } from 'react-chartjs-2';
import { CleanRow } from '../../types';
import { compareAsc, parseISO } from 'date-fns';

interface ProductMomentumChartProps {
  data: CleanRow[];
}

const COLORS = [
  '#4c51bf', '#667eea', '#ed64a6', '#9f7aea', '#4fd1c5',
  '#f56565', '#f6e05e', '#68d391', '#a0aec0', '#fc8181'
];

const ProductMomentumChart: React.FC<ProductMomentumChartProps> = ({ data }) => {
  const dataByProductAndMonth: Record<string, Record<string, number>> = {};
  const allMonths = new Set<string>();

  data.forEach(row => {
    const product = row.product;
    const month = row.month;
    allMonths.add(month);

    if (!dataByProductAndMonth[product]) {
      dataByProductAndMonth[product] = {};
    }
    if (!dataByProductAndMonth[product][month]) {
      dataByProductAndMonth[product][month] = 0;
    }
    dataByProductAndMonth[product][month]++;
  });

  const sortedMonths = Array.from(allMonths).sort((a,b) => compareAsc(parseISO(a), parseISO(b)));
  
  const datasets = Object.entries(dataByProductAndMonth).map(([product, monthData], index) => {
    let cumulativeCount = 0;
    const cumulativeData = sortedMonths.map(month => {
      cumulativeCount += monthData[month] || 0;
      return cumulativeCount;
    });

    return {
      label: product,
      data: cumulativeData,
      borderColor: COLORS[index % COLORS.length],
      backgroundColor: `${COLORS[index % COLORS.length]}33`,
      fill: true,
      tension: 0.1,
    };
  });

  const chartData = {
    labels: sortedMonths,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Product Momentum (Cumulative Sales)',
        font: { size: 16 }
      },
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cumulative Number of Sales',
        },
        beginAtZero: true,
      },
    },
  };

  return <div style={{ height: '400px' }}><Line options={options} data={chartData} /></div>;
};

export default ProductMomentumChart;
