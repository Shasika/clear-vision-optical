import React, { useState } from 'react';
import { X, Send, Check, Phone, Mail, MapPin } from 'lucide-react';
import type { Frame } from '../types/frames';
import type { Sunglasses } from '../types/sunglasses';
import { useCompanyData } from '../hooks/useCompanyData';

interface InquiryModalProps {
  product: Frame | Sunglasses;
  productType: 'frame' | 'sunglasses';
  onClose: () => void;
}

const InquiryModal: React.FC<InquiryModalProps> = ({ product, productType, onClose }) => {
  const { companyData } = useCompanyData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in the ${product.brand} ${product.name}. Could you please provide more information about pricing and availability?`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare inquiry data
      const inquiryData = {
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined
        },
        product: {
          id: product.id,
          name: product.name,
          brand: product.brand,
          type: productType,
          price: product.price,
          imageUrl: (product.images && product.images.length > 0) ? product.images[0] : product.imageUrl
        },
        message: formData.message
      };

      // Submit to backend
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      const result = await response.json();
      console.log('Inquiry submitted successfully:', result);
      
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Close modal after showing success message
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setIsSubmitting(false);
      // You might want to show an error message here
      alert('Failed to submit inquiry. Please try again.');
    }
  };

  const generateWhatsAppLink = () => {
    const phone = companyData?.contact?.phone?.primary?.replace(/[^0-9]/g, '') || '94111234567';
    const message = `Hi, I'm interested in the ${product.brand} ${product.name} (${productType}). Could you please provide more information about pricing and availability?`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const generateEmailLink = () => {
    const email = companyData?.contact?.email?.primary || 'info@opticalvision.lk';
    const subject = `Inquiry about ${product.brand} ${product.name}`;
    const body = `Hi,\n\nI'm interested in the ${product.brand} ${product.name} (${productType}). Could you please provide more information about pricing and availability?\n\nThank you.`;
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Inquiry Sent!</h3>
          <p className="text-gray-600 mb-4">
            Thank you for your interest. We'll get back to you soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Inquiry Form</h2>
            <p className="text-sm text-gray-600">
              {product.brand} {product.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Product Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-4">
              {((product.images && product.images.length > 0) || product.imageUrl) && (
                <img
                  src={(product.images && product.images.length > 0) ? product.images[0] : product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{product.brand} {product.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{product.material} • {product.shape}</p>
                <p className="text-lg font-bold text-gray-900">LKR {product.price.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="+94 77 123 4567"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center px-6 py-3 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : productType === 'sunglasses'
                  ? 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
                  : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send Inquiry
                </>
              )}
            </button>
          </form>

          {/* Alternative Contact Methods */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Or contact us directly:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <Phone className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                  <p className="text-xs text-gray-600">{companyData?.contact?.phone?.primary || '+94 11 123 4567'}</p>
                </div>
              </a>
              <a
                href={generateEmailLink()}
                className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Mail className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-xs text-gray-600">{companyData?.contact?.email?.primary || 'info@opticalvision.lk'}</p>
                </div>
              </a>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Visit Us</p>
                  <p className="text-xs text-gray-600">
                    {companyData?.contact?.address?.city || 'Colombo'}, {companyData?.contact?.address?.country || 'Sri Lanka'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;