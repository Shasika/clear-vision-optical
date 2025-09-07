import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { dataService } from '../../services/dataService';

interface ImageUploadProps {
  currentImage?: string;
  folder: 'frames' | 'sunglasses' | 'company' | 'team';
  onImageChange: (imageUrl: string | null) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  folder,
  onImageChange,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    console.log('File selected:', file.name, file.type, file.size);
    setError(null);
    setSuccess(false);
    setUploading(true);

    try {
      // Validate file first
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        setUploading(false);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        setUploading(false);
        return;
      }

      // Upload using data service and get the data URL
      console.log('Starting upload to folder:', folder);
      const dataUrl = await dataService.saveImage(file, folder);
      console.log('Upload result:', dataUrl);
      
      if (dataUrl) {
        // Set the data URL directly - no need for local URL
        onImageChange(dataUrl);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        // Revert to current image on upload failure
        onImageChange(currentImage || null);
        setError('Failed to upload image');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image: ' + (err as Error).message);
      // Revert changes on error
      onImageChange(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    console.log('File dropped:', file?.name, file?.type, file?.size);
    
    if (file) {
      if (file.type.startsWith('image/')) {
        handleFileSelect(file);
      } else {
        setError(`Invalid file type: ${file.type}. Please drop a valid image file.`);
      }
    } else {
      setError('No file was dropped');
    }
  };

  const handleRemoveImage = async () => {
    if (currentImage) {
      try {
        // For external URLs (like Unsplash), we don't need to delete the actual file
        // Just remove the reference from our application
        if (currentImage.startsWith('http://') || currentImage.startsWith('https://')) {
          console.log('Removing external image URL reference:', currentImage);
          onImageChange(null);
          return;
        }
        
        // For uploaded images (data URLs or local files), attempt deletion
        await dataService.deleteImage(currentImage);
        onImageChange(null);
      } catch (err) {
        console.error('Failed to delete image:', err);
        // Even if deletion fails, remove from UI
        onImageChange(null);
      }
    } else {
      onImageChange(null);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Image Display */}
      {currentImage && (
        <div className="relative inline-block">
          <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
            <img
              src={currentImage}
              alt="Current"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image failed to load:', currentImage);
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNNDQgNDRIMTJWODRINDRWNDRaIiBmaWxsPSIjRDFENU1CIi8+PC9zdmc+';
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', currentImage);
              }}
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={uploading}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50"
            title="Remove image"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragOver
            ? 'border-primary-500 bg-primary-50'
            : uploading
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  <button
                    type="button"
                    onClick={openFileDialog}
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Click to upload
                  </button>{' '}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WebP up to 5MB
                </p>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">Image uploaded successfully!</span>
        </div>
      )}

      {/* Alternative URL Input */}
      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Or enter image URL
        </label>
        <div className="flex space-x-2">
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
            onBlur={(e) => {
              const url = e.target.value.trim();
              if (url && url !== currentImage) {
                onImageChange(url);
                e.target.value = '';
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const url = (e.target as HTMLInputElement).value.trim();
                if (url && url !== currentImage) {
                  onImageChange(url);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Paste a direct link to an image file
        </p>
      </div>
    </div>
  );
};

export default ImageUpload;