import React from 'react';
import { Bar } from 'react-chartjs-2';
import { CleanRow } from '../../types';

interface SalesTypeBreakdownChartProps {
  data: CleanRow[];
}

const COLORS = {
  'New Member': 'rgba(54, 162, 235, 0.6)',
  'Reactivation': 'rgba(75, 192, 192, 0.6)',
  'Increase': 'rgba(255, 206, 86, 0.6)',
  'Default': 'rgba(153, 102, 255, 0.6)',
};


const SalesTypeBreakdownChart: React.FC<SalesTypeBreakdownChartProps> = ({ data }) => {
  const productData: Record<string, Record<string, number>> = {};
  const allTypes = new Set<string>();
  
  data.forEach(row => {
    const product = row.product;
    const type = row.verkoopType || 'Unknown';
    allTypes.add(type);

    if (!productData[product]) {
      productData[product] = {};
    }
    if (!productData[product][type]) {
      productData[product][type] = 0;
    }
    productData[product][type]++;
  });

  const labels = Object.keys(productData).sort();
  const sortedTypes = Array.from(allTypes).sort();
  
  const datasets = sortedTypes.map(type => ({
    label: type,
    data: labels.map(product => productData[product][type] || 0),
    backgroundColor: COLORS[type as keyof typeof COLORS] || COLORS.Default,
  }));

  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Sales Type Mix by Product',
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
            text: 'Product'
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

export default SalesTypeBreakdownChart;
