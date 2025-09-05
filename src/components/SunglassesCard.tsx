import React from 'react';
import type { Sunglasses } from '../types/sunglasses';
import { Eye, ShoppingCart, Info, Sun, Shield } from 'lucide-react';
import ImageGallery from './ImageGallery';

interface SunglassesCardProps {
  sunglasses: Sunglasses;
  onViewDetails?: (sunglasses: Sunglasses) => void;
  onAddToCart?: (sunglasses: Sunglasses) => void;
}

const SunglassesCard: React.FC<SunglassesCardProps> = ({ sunglasses, onViewDetails, onAddToCart }) => {
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
          images={sunglasses.images && sunglasses.images.length > 0 ? sunglasses.images : sunglasses.imageUrl ? [sunglasses.imageUrl] : []}
          productName={sunglasses.name}
          productType="sunglasses"
          className="h-48"
        />
        
        {/* Stock Status Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${getStockColor(sunglasses.inStock)} z-10 shadow-lg backdrop-blur-sm`}>
          {sunglasses.inStock ? '✓ In Stock' : '✗ Out of Stock'}
        </div>

        {/* UV Protection Badge */}
        {sunglasses.lensFeatures.uvProtection && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold flex items-center z-10 shadow-lg backdrop-blur-sm border border-blue-200">
            <Shield className="h-3 w-3 mr-1" />
            UV400
          </div>
        )}

        {/* Polarized Badge */}
        {sunglasses.lensFeatures.polarized && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-semibold z-10 shadow-lg backdrop-blur-sm border border-purple-200">
            ✨ Polarized
          </div>
        )}
      </div>

      {/* Sunglasses Info - Flex grow to fill space */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 leading-tight">{sunglasses.name}</h3>
          <p className="text-primary-600 font-semibold text-sm">{sunglasses.brand}</p>
        </div>

        {/* Sunglasses Details Grid */}
        <div className="mb-4 bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium mb-1">Category</span>
            <span className="text-gray-900 font-bold capitalize">{sunglasses.category}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium mb-1">Material</span>
            <span className="text-gray-900 font-bold capitalize">{sunglasses.material}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium mb-1">Shape</span>
            <span className="text-gray-900 font-bold capitalize">{sunglasses.shape}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium mb-1">Color</span>
            <span className="text-gray-900 font-bold">{sunglasses.color}</span>
          </div>
        </div>

        {/* Lens Features */}
        <div className="mb-4 min-h-[2rem]">
          <div className="flex flex-wrap gap-1">
            {sunglasses.lensFeatures.uvProtection && (
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium border border-blue-100">
                🛡️ UV Protection
              </span>
            )}
            {sunglasses.lensFeatures.polarized && (
              <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-md font-medium border border-purple-100">
                ✨ Polarized
              </span>
            )}
            {sunglasses.lensFeatures.tinted && (
              <span className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-md font-medium border border-gray-100">
                🌑 Tinted
              </span>
            )}
            {sunglasses.features.slice(0, 1).map((feature, index) => (
              <span 
                key={index}
                className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-md font-medium border border-primary-100"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Price Section */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(sunglasses.price)}
            </span>
            <span className="text-xs text-gray-500">Starting price</span>
          </div>
          {!sunglasses.inStock && (
            <div className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-1 rounded border border-red-100">
              Unavailable
            </div>
          )}
        </div>

        {/* Action Buttons - Always at bottom */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onViewDetails?.(sunglasses)}
            className="flex-1 lg:flex-none lg:px-3 inline-flex items-center justify-center px-4 py-2 lg:py-1.5 text-sm border-2 border-gray-200 text-gray-700 bg-white rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all font-medium"
          >
            <Info className="h-4 w-4 mr-1.5" />
            Details
          </button>
          <button
            onClick={() => onAddToCart?.(sunglasses)}
            disabled={!sunglasses.inStock}
            className={`flex-1 lg:flex-none lg:px-3 inline-flex items-center justify-center px-4 py-2 lg:py-1.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all font-semibold ${
              sunglasses.inStock
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4 mr-1.5" />
            {sunglasses.inStock ? 'Inquire Now' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SunglassesCard;