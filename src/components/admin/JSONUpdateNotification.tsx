import React, { useState, useEffect } from 'react';
import { AlertTriangle, Download, X, RefreshCw, CheckCircle, Copy } from 'lucide-react';

interface PendingUpdate {
  filename: string;
  timestamp: number;
  content: string;
}

const JSONUpdateNotification: React.FC = () => {
  const [pendingUpdates, setPendingUpdates] = useState<PendingUpdate[]>([]);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  useEffect(() => {
    const checkForUpdates = () => {
      const updates: PendingUpdate[] = [];
      const files = ['frames.json', 'sunglasses.json', 'company.json'];
      
      files.forEach(filename => {
        const downloadInfo = localStorage.getItem(`download_${filename}`);
        if (downloadInfo) {
          try {
            const { content, timestamp } = JSON.parse(downloadInfo);
            updates.push({ filename, timestamp, content });
          } catch (error) {
            console.error('Error parsing download info:', error);
          }
        }
      });
      
      setPendingUpdates(updates);
    };

    // Check immediately
    checkForUpdates();
    
    // Check every 5 seconds
    const interval = setInterval(checkForUpdates, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = async (content: string, filename: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFile(filename);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const downloadFile = (filename: string) => {
    const downloadInfo = localStorage.getItem(`download_${filename}`);
    if (downloadInfo) {
      try {
        const { url } = JSON.parse(downloadInfo);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    }
  };

  const markAsUpdated = (filename: string) => {
    localStorage.removeItem(`download_${filename}`);
    setPendingUpdates(prev => prev.filter(update => update.filename !== filename));
  };

  const refreshFromJSON = () => {
    // Clear all caches and reload
    localStorage.clear();
    window.location.reload();
  };

  if (pendingUpdates.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      {pendingUpdates.map(update => (
        <div key={update.filename} className="mb-3 bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                {update.filename} Updated
              </h3>
              <p className="text-xs text-yellow-700 mt-1">
                Database changes detected. Update your JSON file to persist changes.
              </p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => downloadFile(update.filename)}
                  className="inline-flex items-center px-2 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </button>
                
                <button
                  onClick={() => copyToClipboard(update.content, update.filename)}
                  className="inline-flex items-center px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  {copiedFile === update.filename ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <Copy className="h-3 w-3 mr-1" />
                  )}
                  {copiedFile === update.filename ? 'Copied!' : 'Copy JSON'}
                </button>
                
                <button
                  onClick={() => markAsUpdated(update.filename)}
                  className="inline-flex items-center px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Done
                </button>
              </div>
              
              <div className="mt-2 text-xs text-yellow-600">
                📁 Save to: <code className="bg-yellow-100 px-1 rounded">public/data/{update.filename}</code>
              </div>
            </div>
            
            <button
              onClick={() => markAsUpdated(update.filename)}
              className="ml-2 text-yellow-400 hover:text-yellow-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      
      {pendingUpdates.length > 0 && (
        <div className="mt-2">
          <button
            onClick={refreshFromJSON}
            className="w-full inline-flex items-center justify-center px-3 py-2 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reload from JSON Files
          </button>
        </div>
      )}
    </div>
  );
};

export default JSONUpdateNotification;