
import React, { useState, useCallback } from 'react';
import { useStore } from '../services/useStore';
import { UploadIcon } from './icons/UploadIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

const UploadPage: React.FC = () => {
  const { setFile, isLoading } = useStore();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
      <div className="w-full max-w-2xl text-center">
        <div
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-lg p-12 transition-colors duration-200 ${
            isDragging ? 'border-sig-light-blue bg-blue-50' : 'border-gray-300 bg-white'
          }`}
        >
          <input
            type="file"
            id="file-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".csv"
            onChange={(e) => handleFileChange(e.target.files)}
            disabled={isLoading}
          />
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center space-y-4 cursor-pointer">
            {isLoading ? (
              <>
                <SpinnerIcon className="w-12 h-12 text-sig-light-blue" />
                <p className="text-lg font-semibold text-gray-700">Processing your data...</p>
                <p className="text-sm text-gray-500">This might take a moment for large files.</p>
              </>
            ) : (
              <>
                <UploadIcon className="w-12 h-12 text-sig-light-blue" />
                <p className="text-lg font-semibold text-gray-700">
                  <span className="text-sig-light-blue">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-gray-500">CSV files up to 5MB</p>
              </>
            )}
          </label>
        </div>
        <p className="mt-6 text-gray-600">
          No data yet. Upload your latest sales CSV to get started.
        </p>
      </div>
    </div>
  );
};

export default UploadPage;
