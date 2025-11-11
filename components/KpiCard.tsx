
import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow text-center">
      <h4 className="text-sm font-medium text-gray-500 truncate">{title}</h4>
      <p className="text-2xl font-bold text-sig-blue mt-1">{value}</p>
    </div>
  );
};

export default KpiCard;
