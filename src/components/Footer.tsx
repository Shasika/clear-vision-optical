import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { useCompanyData } from '../hooks/useCompanyData';
import ImageWithPlaceholder from './ImageWithPlaceholder';

const Footer: React.FC = () => {
  const { companyData } = useCompanyData();

  const defaultQuickLinks = [
    { title: 'Home', url: '/' },
    { title: 'About Us', url: '/about' },
    { title: 'Frames Collection', url: '/frames' },
    { title: 'Services', url: '/services' },
    { title: 'Contact', url: '/contact' }
  ];

  const quickLinks = companyData?.footer?.quickLinks?.length ? 
    companyData.footer.quickLinks : defaultQuickLinks;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8">
                <ImageWithPlaceholder
                  src={companyData?.companyInfo?.logo} 
                  alt={companyData?.companyInfo?.name || 'Company Logo'}
                  placeholderType="company"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold">
                {companyData?.companyInfo?.name || 'OpticalVision'}
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              {companyData?.footer?.aboutText || 
               'Your trusted optical partner providing premium eyewear solutions with over 20 years of experience. We offer the latest in frame designs and lens technology.'}
            </p>
            <div className="flex space-x-4">
              {companyData?.contact?.socialMedia?.facebook && (
                <a 
                  href={companyData.contact.socialMedia.facebook} 
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-6 w-6" />
                </a>
              )}
              {companyData?.contact?.socialMedia?.instagram && (
                <a 
                  href={companyData.contact.socialMedia.instagram} 
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              )}
              {companyData?.contact?.socialMedia?.twitter && (
                <a 
                  href={companyData.contact.socialMedia.twitter} 
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.url} 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              {companyData?.contact && (
                <>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary-500 flex-shrink-0" />
                    <span className="text-gray-300">
                      {companyData.contact.address.street}, {companyData.contact.address.city}, {companyData.contact.address.country}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary-500 flex-shrink-0" />
                    <span className="text-gray-300">{companyData.contact.phone.primary}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary-500 flex-shrink-0" />
                    <span className="text-gray-300">{companyData.contact.email.primary}</span>
                  </div>
                  {companyData?.businessHours && (
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-primary-500 flex-shrink-0 mt-1" />
                      <div className="text-gray-300">
                        {Object.entries(companyData.businessHours).slice(0, 3).map(([day, hours]) => {
                          const dayName = day.charAt(0).toUpperCase() + day.slice(1, 3);
                          const hourText = hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`;
                          return (
                            <div key={day}>{dayName}: {hourText}</div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {companyData?.footer?.copyrightText || 
               `© ${new Date().getFullYear()} ${companyData?.companyInfo?.name || 'OpticalVision'}. All rights reserved.`}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;