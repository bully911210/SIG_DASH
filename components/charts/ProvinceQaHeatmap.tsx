import React from 'react';
import { CleanRow } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface ProvinceQaHeatmapProps {
  data: CleanRow[];
}

const ProvinceQaHeatmap: React.FC<ProvinceQaHeatmapProps> = ({ data }) => {
  const matrix: Record<string, Record<string, { total: number; rejected: number; premiumSum: number }>> = {};
  // FIX: Use a type guard with .filter to correctly narrow the type to string[] and avoid potential indexing errors.
  const allProvinces = [...new Set(data.map(d => d.province).filter((p): p is string => !!p))].sort();
  const allProducts = [...new Set(data.map(d => d.product))].sort();

  data.forEach(row => {
    if (!row.province) return;
    if (!matrix[row.province]) matrix[row.province] = {};
    if (!matrix[row.province][row.product]) {
      matrix[row.province][row.product] = { total: 0, rejected: 0, premiumSum: 0 };
    }
    const cell = matrix[row.province][row.product];
    cell.total++;
    cell.premiumSum += row.premiumEffective;
    if (row.qaStatus === 'Rejected') {
      cell.rejected++;
    }
  });

  const getCellColor = (rate: number): string => {
    if (isNaN(rate) || rate === 0) return 'bg-green-100';
    const hue = 0; // Red
    const lightness = 100 - (rate * 70); // 0% rate = 100 lightness (white), 100% rate = 30 lightness (dark red)
    const saturation = 90;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-xs font-medium text-gray-600">Province / Product</th>
            {allProducts.map(product => (
              <th key={product} className="border border-gray-300 p-2 text-xs font-medium text-gray-600">{product}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allProvinces.map(province => (
            <tr key={province}>
              <td className="border border-gray-300 p-2 text-sm font-semibold text-gray-800 bg-gray-50">{province}</td>
              {allProducts.map(product => {
                const cellData = matrix[province]?.[product];
                const rejectionRate = cellData && cellData.total > 0 ? cellData.rejected / cellData.total : 0;
                const avgPremium = cellData && cellData.total > 0 ? cellData.premiumSum / cellData.total : 0;
                
                const color = getCellColor(rejectionRate);
                const textColor = rejectionRate > 0.4 ? 'text-white' : 'text-gray-900';

                return (
                  <td
                    key={product}
                    className={`border border-gray-300 p-2 text-center ${textColor}`}
                    style={{ backgroundColor: color }}
                    title={`${(rejectionRate * 100).toFixed(1)}% Reject Rate`}
                  >
                    {cellData ? (
                        <div>
                            <div className="font-bold">{formatCurrency(avgPremium)}</div>
                            <div className="text-xs">({cellData.total} sales)</div>
                        </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center space-x-4 mt-4 text-xs text-gray-600">
        <span>Legend (Rejection Rate):</span>
        <div className="flex items-center space-x-1">
            <div className="w-4 h-4" style={{ backgroundColor: getCellColor(0) }}></div>
            <span>0%</span>
        </div>
        <div className="flex items-center space-x-1">
            <div className="w-4 h-4" style={{ backgroundColor: getCellColor(0.25) }}></div>
            <span>25%</span>
        </div>
         <div className="flex items-center space-x-1">
            <div className="w-4 h-4" style={{ backgroundColor: getCellColor(0.5) }}></div>
            <span>50%</span>
        </div>
         <div className="flex items-center space-x-1">
            <div className="w-4 h-4" style={{ backgroundColor: getCellColor(1) }}></div>
            <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default ProvinceQaHeatmap;