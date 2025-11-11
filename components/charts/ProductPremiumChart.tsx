import React from 'react';
import { Bar } from 'react-chartjs-2';
import { CleanRow } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface ProductPremiumChartProps {
  data: CleanRow[];
}

const ProductPremiumChart: React.FC<ProductPremiumChartProps> = ({ data }) => {
  const productPremiums = data.reduce((acc, row) => {
    if (!acc[row.product]) {
      acc[row.product] = 0;
    }
    acc[row.product] += row.premiumEffective;
    return acc;
  }, {} as Record<string, number>);

  // FIX: Explicitly cast values to number to resolve TypeScript arithmetic operation error.
  const sortedProducts = Object.entries(productPremiums).sort(([, a], [, b]) => (b as number) - (a as number));
  const labels = sortedProducts.map(([product]) => product);
  const premiumData = sortedProducts.map(([, premium]) => premium);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total Premium',
        data: premiumData,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
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
        text: 'Product Premium Totals',
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
            if (context.parsed.x !== null) {
              label += formatCurrency(context.parsed.x);
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
                text: 'Total Premium (R)'
            },
            ticks: {
                 callback: function(value: any) {
                    return formatCurrency(value);
                 }
            }
        },
        y: {
            title: {
                display: true,
                text: 'Product'
            }
        }
    }
  };

  return <div style={{ height: '400px' }}><Bar options={options} data={chartData} /></div>;
};

export default ProductPremiumChart;
