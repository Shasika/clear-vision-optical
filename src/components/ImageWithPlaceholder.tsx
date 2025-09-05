import React, { useState } from 'react';
import { Glasses, Sun, Building2, User, Image } from 'lucide-react';

interface ImageWithPlaceholderProps {
  src?: string | null;
  alt: string;
  className?: string;
  placeholderType?: 'frames' | 'sunglasses' | 'company' | 'person' | 'product' | 'general';
  onError?: () => void;
}

const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({
  src,
  alt,
  className = '',
  placeholderType = 'general',
  onError
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleImageLoad = () => {
    setHasError(false);
    setIsLoading(false);
  };

  const getPlaceholderContent = () => {
    switch (placeholderType) {
      case 'sunglasses':
        return {
          icon: <Sun className="h-1/2 w-1/2 text-amber-400" />,
          bgGradient: 'from-amber-50 to-orange-50',
          iconBg: 'bg-amber-100',
          text: 'Sunglasses',
          textColor: 'text-amber-600'
        };
      case 'frames':
        return {
          icon: <Glasses className="h-1/2 w-1/2 text-blue-400" />,
          bgGradient: 'from-blue-50 to-indigo-50',
          iconBg: 'bg-blue-100',
          text: 'Frames',
          textColor: 'text-blue-600'
        };
      case 'company':
        return {
          icon: <Building2 className="h-1/2 w-1/2 text-primary-400" />,
          bgGradient: 'from-primary-50 to-primary-100',
          iconBg: 'bg-primary-100',
          text: 'Company',
          textColor: 'text-primary-600'
        };
      case 'person':
        return {
          icon: <User className="h-1/2 w-1/2 text-gray-400" />,
          bgGradient: 'from-gray-50 to-gray-100',
          iconBg: 'bg-gray-100',
          text: 'Person',
          textColor: 'text-gray-600'
        };
      case 'product':
        return {
          icon: <Image className="h-1/2 w-1/2 text-purple-400" />,
          bgGradient: 'from-purple-50 to-purple-100',
          iconBg: 'bg-purple-100',
          text: 'Product',
          textColor: 'text-purple-600'
        };
      default:
        return {
          icon: <Image className="h-1/2 w-1/2 text-gray-400" />,
          bgGradient: 'from-gray-50 to-gray-100',
          iconBg: 'bg-gray-100',
          text: 'Image',
          textColor: 'text-gray-600'
        };
    }
  };

  // Show placeholder if no src, has error, or is empty string
  if (!src || hasError || src.trim() === '') {
    const placeholder = getPlaceholderContent();
    
    return (
      <div className={`bg-gradient-to-br ${placeholder.bgGradient} flex items-center justify-center border border-gray-200 relative overflow-hidden ${className}`}>
        {/* Background Pattern for larger placeholders */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-3 gap-2 h-full w-full p-2">
            {[...Array(9)].map((_, i) => (
              <div key={i} className={`${placeholder.iconBg} rounded-full flex items-center justify-center`}>
                {React.cloneElement(placeholder.icon, { className: "h-3 w-3 text-gray-300" })}
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Icon */}
        <div className={`${placeholder.iconBg} rounded-full flex items-center justify-center relative z-10 aspect-square`} style={{ width: '40%', height: '40%' }}>
          {placeholder.icon}
        </div>
      </div>
    );
  }

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      {isLoading && (
        <div className={`absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center ${className}`}>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <Image className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageWithPlaceholder;