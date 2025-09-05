import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Plus, AlertCircle, CheckCircle, Image as ImageIcon, Camera } from 'lucide-react';
import { dataService } from '../../services/dataService';

interface ImageGalleryUploadProps {
  images: string[];
  folder: 'frames' | 'sunglasses' | 'company';
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

const ImageGalleryUpload: React.FC<ImageGalleryUploadProps> = ({
  images,
  folder,
  onImagesChange,
  maxImages = 5,
  className = ''
}) => {
  // Helper function to convert image paths to full URLs if needed
  const getImageUrl = (imagePath: string): string => {
    if (imagePath.startsWith('data:') || imagePath.startsWith('http')) {
      return imagePath; // Already a full URL or base64
    }
    // Convert relative path to full URL
    return `http://localhost:3001${imagePath}`;
  };
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFileSelect = async (files: FileList) => {
    // Convert FileList to array immediately to prevent it from being cleared
    const fileArray = Array.from(files);

    if (images.length + fileArray.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setError(null);
    setSuccess(false);
    setUploading(true);

    const newImages: string[] = [];
    const errors: string[] = [];

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        
        // Validate file - continue with other files if one fails
        if (!file.type.startsWith('image/')) {
          errors.push(`${file.name} is not a valid image file`);
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          errors.push(`${file.name} is too large. Max size is 10MB`);
          continue;
        }

        try {
          // Upload image
          const imagePath = await dataService.saveImage(file, folder);
          if (imagePath) {
            newImages.push(imagePath);
          } else {
            errors.push(`Failed to upload ${file.name}`);
          }
        } catch (fileError) {
          errors.push(`Error uploading ${file.name}: ${(fileError as Error).message}`);
        }
      }

      // Show errors if any
      if (errors.length > 0) {
        setError(errors.join(', '));
      }

      // Add successfully uploaded images
      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages];
        onImagesChange(updatedImages);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else if (errors.length === 0) {
        setError('No images were processed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload images: ' + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
    // Reset input
    e.target.value = '';
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
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const removeImage = async (index: number) => {
    const imageToDelete = images[index];
    
    // Delete the actual image file from the server
    if (imageToDelete) {
      try {
        await dataService.deleteImage(imageToDelete);
        console.log('✅ Image deleted from server:', imageToDelete);
      } catch (error) {
        console.error('❌ Failed to delete image from server:', error);
        // Still continue to remove from array even if server deletion fails
      }
    }
    
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <img
                  src={getImageUrl(image)}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    console.error('Image failed to load:', image);
                    (e.target as HTMLImageElement).style.display = 'none';
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
                onClick={() => removeImage(index)}
                disabled={uploading}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50 opacity-0 group-hover:opacity-100"
                title="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
              {/* Image number indicator */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area - Only show if not at max images */}
      {images.length < maxImages && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer ${
            dragOver
              ? 'border-primary-500 bg-primary-50'
              : uploading
              ? 'border-gray-300 bg-gray-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="text-center">
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
                <p className="text-sm text-gray-600">Uploading images...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {images.length === 0 ? (
                  <Camera className="h-12 w-12 text-gray-400 mb-4" />
                ) : (
                  <Plus className="h-8 w-8 text-gray-400 mb-2" />
                )}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openFileDialog();
                    }}
                    className="font-medium text-primary-600 hover:text-primary-700 underline"
                  >
                    Click to upload
                  </button>
                  <p className="text-sm text-gray-600">
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WebP up to 10MB ({images.length}/{maxImages} images)
                  </p>
                </div>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* Status Messages */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">Images uploaded successfully!</span>
        </div>
      )}

      {/* Helper Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• You can upload multiple images at once</p>
        <p>• First image will be used as the main product image</p>
        <p>• Images will be displayed in a gallery on the product page</p>
      </div>
    </div>
  );
};

export default ImageGalleryUpload;