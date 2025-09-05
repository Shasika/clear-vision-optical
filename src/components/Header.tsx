import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Eye, Phone, MapPin } from 'lucide-react';
import { useCompanyData } from '../hooks/useCompanyData';
import ImageWithPlaceholder from './ImageWithPlaceholder';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { companyData } = useCompanyData();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Frames', href: '/frames' },
    { name: 'Sunglasses', href: '/sunglasses' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4 min-h-16">
          <div className="flex items-center flex-shrink-0 min-w-0">
            <Link to="/" className="flex items-center space-x-2 min-w-0">
              <div className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                <ImageWithPlaceholder
                  src={companyData?.companyInfo?.logo} 
                  alt={companyData?.companyInfo?.name || 'Company Logo'}
                  placeholderType="company"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                {companyData?.companyInfo.name || 'OpticalVision'}
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex space-x-4 xl:space-x-8 flex-shrink-0">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-3 text-xs xl:text-sm text-gray-600 flex-shrink-0">
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3 xl:h-4 xl:w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{companyData?.contact.phone.primary || '+94 11 123 4567'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3 xl:h-4 xl:w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{companyData?.contact.address.city || 'Colombo'}, {companyData?.contact.address.country || 'Sri Lanka'}</span>
            </div>
          </div>

          <div className="lg:hidden flex-shrink-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-1.5 sm:p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
            >
              {isMenuOpen ? (
                <X className="block h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="block h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden w-full overflow-hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mx-1 sm:mx-0">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-100'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 min-w-0">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{companyData?.contact.phone.primary || '+94 11 123 4567'}</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 min-w-0">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{companyData?.contact.address.city || 'Colombo'}, {companyData?.contact.address.country || 'Sri Lanka'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;