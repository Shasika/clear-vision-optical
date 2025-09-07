import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Glasses, Sun } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  productName: string;
  className?: string;
  productType?: 'frames' | 'sunglasses' | 'glasses';
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  productName, 
  className = '',
  productType = 'glasses'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Helper function to convert image paths to full URLs if needed
  const getImageUrl = (imagePath: string): string => {
    if (imagePath.startsWith('data:') || imagePath.startsWith('http')) {
      return imagePath; // Already a full URL or base64
    }
    // For relative paths, use the current domain with the API port
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const apiBaseUrl = isLocalhost 
      ? 'http://localhost:3007'
      : '';  // Use relative path in production (Nginx will handle it)
    return `${apiBaseUrl}${imagePath}`;
  };

  // Get placeholder content based on product type
  const getPlaceholderContent = () => {
    switch (productType) {
      case 'sunglasses':
        return {
          icon: <Sun className="h-8 w-8 text-amber-400" />,
          bgGradient: 'from-amber-50 to-orange-50',
          iconBg: 'bg-amber-100',
          text: 'Sunglasses',
          textColor: 'text-amber-600'
        };
      case 'frames':
        return {
          icon: <Glasses className="h-8 w-8 text-blue-400" />,
          bgGradient: 'from-blue-50 to-indigo-50',
          iconBg: 'bg-blue-100',
          text: 'Frames',
          textColor: 'text-blue-600'
        };
      default:
        return {
          icon: <Glasses className="h-8 w-8 text-gray-400" />,
          bgGradient: 'from-gray-50 to-gray-100',
          iconBg: 'bg-gray-100',
          text: 'Optical',
          textColor: 'text-gray-500'
        };
    }
  };

  // No images - show enhanced product-specific placeholder
  if (!images || images.length === 0) {
    const placeholder = getPlaceholderContent();
    
    return (
      <div className={`bg-gradient-to-br ${placeholder.bgGradient} flex items-center justify-center border border-gray-200 rounded-lg relative overflow-hidden ${className}`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-4 gap-4 h-full w-full p-8">
            {[...Array(16)].map((_, i) => (
              <div key={i} className={`${placeholder.iconBg} rounded-full flex items-center justify-center`}>
                {React.cloneElement(placeholder.icon, { className: "h-4 w-4 text-gray-300" })}
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="text-center p-6 relative z-10">
          <div className={`w-16 h-16 mx-auto mb-3 ${placeholder.iconBg} rounded-full flex items-center justify-center shadow-sm`}>
            {placeholder.icon}
          </div>
          <p className={`text-sm font-semibold ${placeholder.textColor} mb-1`}>No Image Available</p>
          <p className="text-xs text-gray-400">{placeholder.text} placeholder</p>
        </div>
      </div>
    );
  }

  // If only one image, show simple display
  if (images.length === 1) {
    return (
      <div className={`${className}`}>
        <div className="h-full rounded-lg overflow-hidden bg-gray-100">
          <img
            src={getImageUrl(images[0])}
            alt={productName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Multiple images - show with navigation arrows only (NO thumbnail previews)
  return (
    <div className={`${className}`}>
      <div className="relative h-full rounded-lg overflow-hidden bg-gray-100 group">
        <img
          src={getImageUrl(images[currentIndex])}
          alt={`${productName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Image counter */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Navigation Arrows - Only these, no thumbnails */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-opacity-75 transition-opacity"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-opacity-75 transition-opacity"
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      {/* NO thumbnail strip here - removed completely */}
    </div>
  );
};

export default ImageGallery;