import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../services/useStore';

interface FilterOptions {
  allAgents: string[];
  allProducts: string[];
  allProvinces: string[];
}

interface FiltersProps {
  options: FilterOptions;
}

const MultiSelectDropdown: React.FC<{
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}> = ({ label, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  const handleSelect = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-sig-light-blue focus:border-sig-light-blue sm:text-sm"
      >
        <span className="block truncate">
          {selected.length === 0 ? `All ${label}` : `${selected.length} ${label} selected`}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
           <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10 max-h-60 overflow-auto">
          <ul className="py-1">
            {options.map(option => (
              <li key={option} className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-gray-100" onClick={() => handleSelect(option)}>
                <span className={`font-normal block truncate ${selected.includes(option) ? 'font-semibold' : ''}`}>{option}</span>
                {selected.includes(option) && (
                  <span className="text-sig-light-blue absolute inset-y-0 right-0 flex items-center pr-4">
                     <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


const Filters: React.FC<FiltersProps> = ({ options }) => {
  const { filters, setFilters, clearFilters } = useStore();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'from' | 'to') => {
    setFilters({ dateRange: { ...filters.dateRange, [field]: e.target.value } });
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4 flex-grow">
          <div>
            <label htmlFor="from-date" className="block text-sm font-medium text-gray-700">From</label>
            <input type="date" id="from-date" value={filters.dateRange.from} onChange={e => handleDateChange(e, 'from')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-sig-light-blue focus:ring-sig-light-blue sm:text-sm bg-white text-gray-900"/>
          </div>
          <div>
            <label htmlFor="to-date" className="block text-sm font-medium text-gray-700">To</label>
            <input type="date" id="to-date" value={filters.dateRange.to} onChange={e => handleDateChange(e, 'to')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-sig-light-blue focus:ring-sig-light-blue sm:text-sm bg-white text-gray-900"/>
          </div>
      </div>
      
      {/* Selects */}
      <div className="grid grid-cols-2 md:flex md:flex-grow md:gap-4 gap-4">
         <div className="w-full md:w-48"><MultiSelectDropdown label="Agents" options={options.allAgents} selected={filters.agents} onChange={selected => setFilters({ agents: selected })} /></div>
         <div className="w-full md:w-48"><MultiSelectDropdown label="Products" options={options.allProducts} selected={filters.products} onChange={selected => setFilters({ products: selected })} /></div>
         <div className="w-full md:w-48"><MultiSelectDropdown label="Provinces" options={options.allProvinces} selected={filters.provinces} onChange={selected => setFilters({ provinces: selected })} /></div>
          <div>
            <select value={filters.qaStatus} onChange={e => setFilters({ qaStatus: e.target.value as any })} className="block w-full border-gray-300 rounded-md shadow-sm focus:border-sig-light-blue focus:ring-sig-light-blue sm:text-sm h-full py-2 bg-white text-gray-900">
              <option value="All">All QA Status</option>
              <option value="Passed">Passed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
      </div>
      
      {/* Clear Button */}
      <button onClick={clearFilters} className="w-full md:w-auto px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors sm:text-sm">Clear Filters</button>
    </div>
  );
};

export default Filters;