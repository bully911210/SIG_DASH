import React from 'react';

interface StatsPanelProps {
  title: string;
  value: string;
  tooltip: string;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ title, value, tooltip }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md relative group">
      <div className="flex justify-between items-start">
        <h4 className="text-md font-medium text-gray-600">{title}</h4>
        <div className="text-gray-400 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="absolute bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 right-0">
                {tooltip}
            </div>
        </div>
      </div>
      <p className="text-3xl font-bold text-sig-light-blue mt-2">{value}</p>
    </div>
  );
};

export default StatsPanel;
