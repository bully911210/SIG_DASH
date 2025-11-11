
import React from 'react';
import { useStore } from './services/useStore';
import UploadPage from './components/UploadPage';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const { cleanRows, fileName, clearData } = useStore();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-sig-blue shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            SIG Solutions Sales Dashboard
          </h1>
          <div className="flex items-center gap-4">
            {fileName && <span className="text-sm text-gray-300 hidden md:block">File: {fileName}</span>}
            {fileName && (
              <button
                onClick={clearData}
                className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sig-blue focus:ring-red-500"
                title="Clear all data and upload a new file"
              >
                Reset App
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {cleanRows.length > 0 ? <Dashboard /> : <UploadPage />}
      </main>
    </div>
  );
};

export default App;
