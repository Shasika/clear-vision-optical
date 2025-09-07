import React, { useState, useEffect } from 'react';
import {
  Database,
  FileText,
  Save,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Copy,
  Download,
  RotateCcw,
  X
} from 'lucide-react';
import CustomDropdown from '../../components/CustomDropdown';

interface JsonFile {
  name: string;
  path: string;
  size: number;
  lastModified: string;
}

const DataManagement: React.FC = () => {
  const [, setJsonFiles] = useState<JsonFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [jsonContent, setJsonContent] = useState<string>('');
  const [originalContent, setOriginalContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isValidJson, setIsValidJson] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Available data files
  const dataFiles = [
    { value: 'company.json', label: 'Company Settings' },
    { value: 'frames.json', label: 'Frames Data' },
    { value: 'sunglasses.json', label: 'Sunglasses Data' },
    { value: 'contacts.json', label: 'Contacts Data' },
    { value: 'inquiries.json', label: 'Inquiries Data' }
  ];

  useEffect(() => {
    fetchFileList();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      loadFileContent(selectedFile);
    }
  }, [selectedFile]);

  useEffect(() => {
    setHasChanges(jsonContent !== originalContent);
    validateJson();
  }, [jsonContent, originalContent]);

  const fetchFileList = async () => {
    try {
      const response = await fetch('/api/data/files');
      if (response.ok) {
        const files = await response.json();
        setJsonFiles(files);
      }
    } catch (err) {
      console.error('Error fetching file list:', err);
    }
  };

  const loadFileContent = async (filename: string) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`/api/data/files/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}`);
      }
      
      const data = await response.json();
      const formattedJson = JSON.stringify(data, null, 2);
      setJsonContent(formattedJson);
      setOriginalContent(formattedJson);
      setIsValidJson(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file');
    } finally {
      setLoading(false);
    }
  };

  const validateJson = () => {
    if (!jsonContent.trim()) {
      setIsValidJson(true);
      return;
    }

    try {
      JSON.parse(jsonContent);
      setIsValidJson(true);
      setError('');
    } catch (err) {
      setIsValidJson(false);
      setError(err instanceof Error ? `JSON Syntax Error: ${err.message}` : 'Invalid JSON');
    }
  };

  const handleSave = async () => {
    if (!isValidJson || !selectedFile) {
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const parsedData = JSON.parse(jsonContent);
      
      const response = await fetch(`/api/data/files/${selectedFile}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData, null, 2)
      });

      if (!response.ok) {
        throw new Error('Failed to save file');
      }

      setOriginalContent(jsonContent);
      setSuccess(`Successfully saved ${selectedFile}`);
      fetchFileList(); // Refresh file list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save file');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    if (!isValidJson) {
      return;
    }

    try {
      const parsedData = JSON.parse(jsonContent);
      setPreviewData(parsedData);
      setShowPreview(true);
    } catch (err) {
      setError('Cannot preview invalid JSON');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all changes? This will lose any unsaved modifications.')) {
      setJsonContent(originalContent);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonContent);
    setSuccess('JSON content copied to clipboard');
  };

  const handleDownload = () => {
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile || 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      setJsonContent(JSON.stringify(parsed, null, 2));
    } catch (err) {
      setError('Cannot format invalid JSON');
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonContent(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Management</h1>
        <p className="text-gray-600">Edit and manage JSON data files directly</p>
      </div>

      {/* File Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Database className="h-5 w-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Select Data File:
              </label>
              <CustomDropdown
                value={selectedFile}
                onChange={(value) => setSelectedFile(value as string)}
                options={dataFiles}
                placeholder="Choose a file..."
                className="min-w-[200px] focus:ring-primary-500"
              />
            </div>
          </div>
          
          {selectedFile && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              <span>{selectedFile}</span>
              {hasChanges && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Unsaved changes
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Editor */}
      {selectedFile && (
        <div className="bg-white rounded-lg shadow">
          {/* Toolbar */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  disabled={!isValidJson || saving || !hasChanges}
                  className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </button>
                
                <button
                  onClick={handlePreview}
                  disabled={!isValidJson}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </button>
                
                <button
                  onClick={handleReset}
                  disabled={!hasChanges}
                  className="inline-flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={formatJson}
                  disabled={!isValidJson}
                  className="inline-flex items-center px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  Format
                </button>
                
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </button>
                
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </button>
              </div>
            </div>
            
            {/* Status Messages */}
            {error && (
              <div className="mt-3 flex items-center text-red-600 text-sm">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
            
            {success && (
              <div className="mt-3 flex items-center text-green-600 text-sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                {success}
              </div>
            )}
          </div>
          
          {/* JSON Editor */}
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Loading file...</span>
              </div>
            ) : (
              <div className="relative">
                <textarea
                  value={jsonContent}
                  onChange={handleTextareaChange}
                  className={`
                    w-full h-96 px-3 py-2 border rounded-lg font-mono text-sm resize-none
                    focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                    ${isValidJson ? 'border-gray-300' : 'border-red-300 bg-red-50'}
                  `}
                  placeholder="JSON content will appear here..."
                  spellCheck={false}
                />
                
                {/* Line numbers could be added here */}
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  Lines: {jsonContent.split('\n').length} | 
                  Characters: {jsonContent.length}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">JSON Preview - {selectedFile}</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4 overflow-auto max-h-[calc(80vh-8rem)]">
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto">
                {JSON.stringify(previewData, null, 2)}
              </pre>
            </div>
            
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManagement;