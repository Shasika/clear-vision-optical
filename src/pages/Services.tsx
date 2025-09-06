import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Glasses, Settings, Shield, Clock, CheckCircle, Phone, Star } from 'lucide-react';
import { useCompanyData } from '../hooks/useCompanyData';

const Services: React.FC = () => {
  const { companyData, loading } = useCompanyData();

  // Icon mapping for dynamic services
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Eye, Glasses, Settings, Shield, Star, Clock, CheckCircle, Phone
  };

  // Use dynamic services from backend or fallback to default
  const services = companyData?.services?.length ? 
    companyData.services.map(service => ({
      icon: iconMap[service.icon] || Star,
      title: service.name,
      description: service.description,
      features: [], // Services from backend don't have features array
      price: typeof service.price === 'string' ? service.price : `LKR ${service.price.toLocaleString()}`,
      ...(service.duration && { duration: service.duration })
    })) :
    [
      {
        icon: Eye,
        title: 'Comprehensive Eye Examination',
        description: 'Complete eye health assessment using advanced diagnostic equipment',
        features: [
          'Visual acuity testing',
          'Retinal examination',
          'Glaucoma screening',
          'Color vision testing'
        ],
        price: 'From LKR 2,500',
        duration: '45-60 minutes'
      },
      {
        icon: Glasses,
        title: 'Prescription Eyewear',
        description: 'Custom-made glasses tailored to your specific vision needs',
        features: [
          'Single vision lenses',
          'Progressive lenses',
          'Bifocal lenses',
          'Computer glasses'
        ],
        price: 'From LKR 8,500',
        duration: '30-45 minutes'
      },
      {
        icon: Settings,
        title: 'Frame Fitting & Adjustment',
        description: 'Professional fitting and ongoing adjustments for optimal comfort',
        features: [
          'Precise frame fitting',
          'Nose pad adjustments',
          'Temple adjustments',
          'Free maintenance'
        ],
        price: 'Complimentary',
        duration: '15-20 minutes'
      },
      {
        icon: Shield,
        title: 'Lens Replacement',
        description: 'Replace damaged or outdated lenses in your existing frames',
        features: [
          'Scratch-resistant coating',
          'Anti-reflective coating',
          'UV protection',
          'Blue light filtering'
        ],
        price: 'From LKR 4,500',
        duration: '20-30 minutes'
      }
    ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  const specialServices = [
    {
      title: 'Contact Lens Consultation',
      description: 'Expert fitting and training for first-time contact lens wearers',
      duration: '45 minutes'
    },
    {
      title: 'Children\'s Eye Care',
      description: 'Specialized eye examinations designed for children and teenagers',
      duration: '30 minutes'
    },
    {
      title: 'Sports Vision Assessment',
      description: 'Performance-focused eye care for athletes and active individuals',
      duration: '60 minutes'
    },
    {
      title: 'Emergency Repairs',
      description: 'Same-day repair services for broken frames and damaged lenses',
      duration: 'Within hours'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Comprehensive vision care services designed to keep your eyes healthy 
              and your vision crystal clear.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional eye care services backed by years of experience and state-of-the-art technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mr-4">
                      <IconComponent className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-primary-600 font-medium">{service.price}</p>
                        {service.duration && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {service.duration}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Special Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Specialized Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Additional services tailored to specific needs and circumstances.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specialServices.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                  <div className="flex items-center text-sm text-primary-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.duration}
                  </div>
                </div>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A simple, straightforward approach to getting you the perfect vision solution.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Book Appointment', description: 'Schedule your visit at a convenient time' },
              { step: '02', title: 'Eye Examination', description: 'Comprehensive assessment by our experts' },
              { step: '03', title: 'Frame Selection', description: 'Choose from our extensive collection' },
              { step: '04', title: 'Delivery & Fitting', description: 'Professional fitting and aftercare' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Experience Better Vision?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Book your appointment today and take the first step towards clearer, healthier vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Book Appointment
            </Link>
            <a
              href="tel:+94111234567"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-600 hover:text-white transition-colors"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;