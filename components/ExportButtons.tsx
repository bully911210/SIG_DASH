
import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { exportToCsv } from '../utils/helpers';
import { CleanRow, AgentSummary } from '../types';

interface ExportButtonsProps {
  filteredData: CleanRow[];
  dashboardRef: React.RefObject<HTMLDivElement>;
  agentSummary: AgentSummary[];
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ filteredData, dashboardRef }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadCsv = () => {
    exportToCsv(filteredData, 'filtered_sales_data.csv');
  };

  const handleDownloadPdf = async () => {
    if (!dashboardRef.current) return;
    setIsExporting(true);
    
    try {
        const canvas = await html2canvas(dashboardRef.current, {
            scale: 2, // Higher scale for better quality
            useCORS: true
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('dashboard_report.pdf');
    } catch (error) {
        console.error("Error generating PDF:", error);
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDownloadCsv}
        disabled={isExporting}
        className="px-4 py-2 text-sm font-medium text-sig-blue bg-white border border-sig-blue rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
      >
        Download CSV (Filtered)
      </button>
      <button
        onClick={handleDownloadPdf}
        disabled={isExporting}
        className="px-4 py-2 text-sm font-medium text-white bg-sig-light-blue rounded-md hover:bg-sig-blue disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isExporting ? 'Generating...' : 'Download PDF (Dashboard)'}
      </button>
    </div>
  );
};

export default ExportButtons;
