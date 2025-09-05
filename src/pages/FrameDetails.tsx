import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Share2, Heart, Check, X, Star, Shield, Award } from 'lucide-react';
import { useFrames } from '../hooks/useFrames';
import ImageGallery from '../components/ImageGallery';
import InquiryModal from '../components/InquiryModal';

const FrameDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFrameById } = useFrames();
  const [showInquiry, setShowInquiry] = useState(false);

  const frame = getFrameById(id || '');

  if (!frame) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frame Not Found</h2>
          <p className="text-gray-600 mb-6">The frame you're looking for doesn't exist.</p>
          <Link to="/frames" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
            Back to Frames
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `LKR ${price.toLocaleString()}`;
  };

  const handleInquiry = () => {
    setShowInquiry(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: frame.name,
          text: `Check out this ${frame.brand} frame: ${frame.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <ImageGallery
              images={frame.images && frame.images.length > 0 ? frame.images : frame.imageUrl ? [frame.imageUrl] : []}
              productName={frame.name}
              productType="frames"
              className="h-96 rounded-xl overflow-hidden"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Brand */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-primary-600">{frame.brand}</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(4.8)</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{frame.name}</h1>
              <p className="text-gray-600 mt-2">{frame.description}</p>
            </div>

            {/* Price & Stock */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-gray-900">{formatPrice(frame.price)}</span>
                <span className="text-sm text-gray-500 ml-2">Starting price</span>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                frame.inStock 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {frame.inStock ? (
                  <>
                    <Check className="h-4 w-4 inline mr-1" />
                    In Stock
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 inline mr-1" />
                    Out of Stock
                  </>
                )}
              </div>
            </div>

            {/* Frame Specifications */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Material</span>
                  <p className="font-medium capitalize">{frame.material}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Shape</span>
                  <p className="font-medium capitalize">{frame.shape}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Color</span>
                  <p className="font-medium">{frame.color}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Category</span>
                  <p className="font-medium capitalize">{frame.category.replace('-', ' ')}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Gender</span>
                  <p className="font-medium capitalize">{frame.gender}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Size (L-B-T)</span>
                  <p className="font-medium">
                    {frame.frameSize.lens_width}-{frame.frameSize.bridge_width}-{frame.frameSize.temple_length}mm
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <div className="flex flex-wrap gap-2">
                {frame.features.map((feature, index) => (
                  <span 
                    key={index}
                    className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium border border-primary-100"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Warranty</p>
                  <p className="text-xs text-gray-600">1 Year</p>
                </div>
                <div>
                  <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Certified</p>
                  <p className="text-xs text-gray-600">Quality Assured</p>
                </div>
                <div>
                  <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Premium</p>
                  <p className="text-xs text-gray-600">Brand</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                onClick={handleInquiry}
                disabled={!frame.inStock}
                className={`flex-1 lg:flex-initial lg:w-48 inline-flex items-center justify-center px-6 py-3 lg:py-2 text-base lg:text-base font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all ${
                  frame.inStock
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {frame.inStock ? 'Inquire Now' : 'Out of Stock'}
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button className="px-4 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiry && (
        <InquiryModal
          product={frame}
          productType="frame"
          onClose={() => setShowInquiry(false)}
        />
      )}
    </div>
  );
};

export default FrameDetails;