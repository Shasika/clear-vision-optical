import React from 'react';
import type { Frame } from '../types/frames';
import { ShoppingCart, Info } from 'lucide-react';
import ImageGallery from './ImageGallery';

interface FrameCardProps {
  frame: Frame;
  onViewDetails?: (frame: Frame) => void;
  onAddToCart?: (frame: Frame) => void;
}

const FrameCard: React.FC<FrameCardProps> = ({ frame, onViewDetails, onAddToCart }) => {
  const formatPrice = (price: number) => {
    return `LKR ${price.toLocaleString()}`;
  };


  const getStockColor = (inStock: boolean) => {
    return inStock ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
      {/* Image Gallery */}
      <div className="relative">
        <ImageGallery
          images={frame.images && frame.images.length > 0 ? frame.images : frame.imageUrl ? [frame.imageUrl] : []}
          productName={frame.name}
          productType="frames"
          className="h-48"
        />
        
        {/* Stock Status Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${getStockColor(frame.inStock)} z-10 shadow-lg backdrop-blur-sm`}>
          {frame.inStock ? '✓ In Stock' : '✗ Out of Stock'}
        </div>
      </div>

      {/* Frame Info - Flex grow to fill space */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title Section */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 leading-tight">{frame.name}</h3>
          <p className="text-primary-600 font-semibold text-sm">{frame.brand}</p>
        </div>

        {/* Frame Details Grid */}
        <div className="mb-4 bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium mb-1">Material</span>
            <span className="text-gray-900 font-bold capitalize">{frame.material}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium mb-1">Shape</span>
            <span className="text-gray-900 font-bold capitalize">{frame.shape}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium mb-1">Color</span>
            <span className="text-gray-900 font-bold">{frame.color}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium mb-1">Size</span>
            <span className="text-gray-900 font-bold text-xs">
              {frame.frameSize.lens_width}-{frame.frameSize.bridge_width}-{frame.frameSize.temple_length}mm
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4 min-h-[2rem]">
          <div className="flex flex-wrap gap-1">
            {frame.features.slice(0, 3).map((feature, index) => (
              <span 
                key={index}
                className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-md font-medium border border-primary-100"
              >
                {feature}
              </span>
            ))}
            {frame.features.length > 3 && (
              <span className="text-xs text-gray-400 font-medium">+{frame.features.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Price Section */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(frame.price)}
            </span>
            <span className="text-xs text-gray-500">Starting price</span>
          </div>
          {!frame.inStock && (
            <div className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-1 rounded border border-red-100">
              Unavailable
            </div>
          )}
        </div>

        {/* Action Buttons - Always at bottom */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onViewDetails?.(frame)}
            className="flex-1 lg:flex-none lg:px-3 inline-flex items-center justify-center px-4 py-2 lg:py-1.5 text-sm border-2 border-gray-200 text-gray-700 bg-white rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all font-medium"
          >
            <Info className="h-4 w-4 mr-1.5" />
            Details
          </button>
          <button
            onClick={() => onAddToCart?.(frame)}
            disabled={!frame.inStock}
            className={`flex-1 lg:flex-none lg:px-3 inline-flex items-center justify-center px-4 py-2 lg:py-1.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all font-semibold ${
              frame.inStock
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4 mr-1.5" />
            {frame.inStock ? 'Inquire Now' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrameCard;