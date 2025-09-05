import React from 'react';
import { Download, Database, RefreshCw } from 'lucide-react';
import { dataService } from '../../services/dataService';

const JSONDownloadUtility: React.FC = () => {
  const handleDownload = (filename: 'frames.json' | 'sunglasses.json' | 'company.json') => {
    dataService.downloadJSONFile(filename);
  };

  const handleClearCache = () => {
    dataService.clearCache();
    window.location.reload();
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center mb-3">
        <Database className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-sm font-medium text-blue-800">Data Management</h3>
      </div>
      
      <div className="space-y-3">
        <p className="text-xs text-blue-700">
          Changes are saved to localStorage. Download updated JSON files to update your project files:
        </p>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleDownload('frames.json')}
            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            <Download className="h-3 w-3 mr-1" />
            Frames JSON
          </button>
          
          <button
            onClick={() => handleDownload('sunglasses.json')}
            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            <Download className="h-3 w-3 mr-1" />
            Sunglasses JSON
          </button>
          
          <button
            onClick={() => handleDownload('company.json')}
            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            <Download className="h-3 w-3 mr-1" />
            Company JSON
          </button>
          
          <button
            onClick={handleClearCache}
            className="inline-flex items-center px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reload from JSON
          </button>
        </div>
        
        <p className="text-xs text-blue-600">
          💡 After downloading, replace the files in <code className="bg-blue-100 px-1 rounded">public/data/</code> and refresh to see changes.
        </p>
      </div>
    </div>
  );
};

export default JSONDownloadUtility;