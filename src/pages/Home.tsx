import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Eye, 
  Users, 
  Award, 
  ShoppingBag,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  ChevronLeft,
  ChevronRight,
  Building,
  Calendar,
  Sparkles,
  Target,
  TrendingUp,
  Shield,
  Zap,
  Heart
} from 'lucide-react';
import { useCompanyData } from '../hooks/useCompanyData';
import { useFrames } from '../hooks/useFrames';
import { useSunglasses } from '../hooks/useSunglasses';
import ImageWithPlaceholder from '../components/ImageWithPlaceholder';

const Home: React.FC = () => {
  const { companyData, loading: companyLoading } = useCompanyData();
  const { frames } = useFrames();
  const { sunglasses } = useSunglasses();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [inquiryStats, setInquiryStats] = useState({ total: 0, thisMonth: 0, completed: 0 });

  // Fetch inquiry statistics for stats display
  useEffect(() => {
    const fetchInquiryStats = async () => {
      try {
        const response = await fetch('/api/inquiries/stats');
        if (response.ok) {
          const data = await response.json();
          setInquiryStats(data);
        }
      } catch (error) {
        console.error('Error fetching inquiry stats:', error);
      }
    };
    
    fetchInquiryStats();
  }, []);

  // Get recent products for showcase
  const recentFrames = frames.slice(0, 3).map(frame => ({ ...frame, type: 'frame' }));
  const recentSunglasses = sunglasses.slice(0, 3).map(sg => ({ ...sg, type: 'sunglasses' }));
  const featuredProducts = [...recentFrames, ...recentSunglasses].slice(0, 4);

  // Icon mapping for dynamic features
  const iconMap: Record<string, any> = {
    Eye, Users, Award, ShoppingBag, Star, Building, Target, Shield, Zap, Heart, Clock, MapPin, Phone, Mail
  };

  // Use dynamic features from backend or fallback to default
  const features = companyData?.features?.length ? 
    companyData.features.map(feature => ({
      ...feature,
      icon: iconMap[feature.icon] || Star
    })) : 
    [
      {
        icon: Eye,
        title: 'Premium Quality',
        description: 'High-quality lenses and frames from trusted brands worldwide'
      },
      {
        icon: Users,
        title: 'Expert Service',
        description: 'Professional eye care specialists with over 20 years of experience'
      },
      {
        icon: Award,
        title: 'Latest Technology',
        description: 'State-of-the-art equipment for precise eye examinations'
      },
      {
        icon: ShoppingBag,
        title: 'Wide Selection',
        description: 'Extensive collection of frames for every style and budget'
      }
    ];

  if (companyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-white/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/3 w-16 h-16 border border-white/20 rounded-full animate-ping"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* Company branding */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative h-16 w-16 rounded-lg bg-white/10 p-2">
                  <ImageWithPlaceholder
                    src={companyData?.companyInfo?.logo} 
                    alt={companyData?.companyInfo?.name || 'Company Logo'}
                    placeholderType="company"
                    className="h-full w-full object-contain rounded-lg"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{companyData?.companyInfo?.name}</h2>
                  {companyData?.companyInfo?.tagline && (
                    <p className="text-primary-200">{companyData.companyInfo.tagline}</p>
                  )}
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                  {companyData?.homePage?.heroTitle || 'Clear Vision'},
                </span>
                <br />
                <span className="text-primary-200"> {companyData?.homePage?.heroSubtitle || 'Better Life'}</span>
              </h1>
              
              <p className="text-xl leading-relaxed text-primary-100">
                {companyData?.companyInfo?.description || 
                 'Discover our premium collection of eyewear designed to enhance your vision and complement your style. From classic frames to the latest trends.'}
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-6 py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{frames.length + sunglasses.length}+</div>
                  <div className="text-sm text-primary-200">Premium Products</div>
                </div>
                {companyData?.companyInfo?.established && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{companyData.companyInfo.established}</div>
                    <div className="text-sm text-primary-200">Established</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{inquiryStats.completed}+</div>
                  <div className="text-sm text-primary-200">Happy Customers</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/frames"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {companyData?.homePage?.ctaButtons?.frames || 'Browse Frames'}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/sunglasses"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {companyData?.homePage?.ctaButtons?.sunglasses || 'View Sunglasses'}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:-translate-y-1"
                >
                  {companyData?.homePage?.ctaButtons?.appointment || 'Book Appointment'}
                  <Calendar className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-3xl transform rotate-6 animate-pulse"></div>
                <div className="relative w-full h-96 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 flex items-center justify-center transform hover:rotate-1 transition-transform duration-500">
                  {featuredProducts.length > 0 ? (
                    <div className="text-center">
                      <div className="h-48 w-48 mx-auto mb-4 rounded-lg relative">
                        <ImageWithPlaceholder
                          src={featuredProducts[0]?.imageUrl} 
                          alt="Featured Product"
                          placeholderType="product"
                          className="h-full w-full object-contain rounded-lg"
                        />
                      </div>
                      <p className="text-white/80 font-medium">{featuredProducts[0].name}</p>
                      <p className="text-primary-200">LKR {featuredProducts[0].price.toLocaleString()}</p>
                    </div>
                  ) : (
                    <Eye className="h-32 w-32 text-white/80" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {companyData?.homePage?.sectionsHeadings?.whyChoose || `Why Choose ${companyData?.companyInfo?.name || 'OpticalVision'}?`}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {companyData?.homePage?.sectionsHeadings?.whyChooseDescription || 'We combine years of expertise with cutting-edge technology to provide you with the best optical solutions.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 group-hover:bg-primary-600 group-hover:scale-110 transition-all duration-300">
                    <IconComponent className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      {companyData?.services && companyData.services.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Professional optical services tailored to your needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companyData.services.map((service, index) => (
                <div key={service.id} className="group bg-gray-50 rounded-xl p-6 hover:bg-primary-50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-600 transition-colors duration-300">
                      <Star className="h-6 w-6 text-primary-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">{service.price}</div>
                      <div className="text-sm text-gray-500">{service.duration}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-800 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                  <div className="mt-4 pt-4 border-t border-gray-200 group-hover:border-primary-200 transition-colors">
                    <Link 
                      to="/contact"
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center group-hover:translate-x-1 transition-transform duration-300"
                    >
                      Book Now <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {companyData?.homePage?.sectionsHeadings?.featuredProducts || 'Featured Products'}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {companyData?.homePage?.sectionsHeadings?.featuredProductsDescription || 'Discover our latest and most popular eyewear collection'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <Link 
                  key={`${product.type}-${product.id}`} 
                  to={`/${product.type === 'frame' ? 'frames' : 'sunglasses'}/${product.id}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden block"
                >
                  <div className="relative overflow-hidden h-48">
                    <ImageWithPlaceholder
                      src={product.imageUrl} 
                      alt={product.name}
                      placeholderType={product.type === 'frame' ? 'frames' : 'sunglasses'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium text-white ${
                      product.type === 'frame' ? 'bg-primary-600' : 'bg-orange-600'
                    }`}>
                      {product.type === 'frame' ? 'Frames' : 'Sunglasses'}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-primary-600">
                        LKR {product.price.toLocaleString()}
                      </div>
                      <div className="text-primary-600 font-medium text-sm inline-flex items-center group-hover:translate-x-1 transition-transform duration-300">
                        View Details
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/frames"
                  className="inline-flex items-center justify-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  View All Frames
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/sunglasses"
                  className="inline-flex items-center justify-center px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  View All Sunglasses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Business Hours & Contact Section */}
      {companyData && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Us Today</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience our premium eyewear collection and professional service
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <MapPin className="h-6 w-6 text-primary-600 mr-2" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Building className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{companyData.contact.address.street}</p>
                      <p className="text-gray-600">
                        {companyData.contact.address.city}, {companyData.contact.address.state} {companyData.contact.address.zipCode}
                      </p>
                      <p className="text-gray-600">{companyData.contact.address.country}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary-600 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900">{companyData.contact.phone.primary}</p>
                      {companyData.contact.phone.secondary && (
                        <p className="text-gray-600 text-sm">{companyData.contact.phone.secondary}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary-600 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900">{companyData.contact.email.primary}</p>
                      {companyData.contact.email.support && (
                        <p className="text-gray-600 text-sm">{companyData.contact.email.support}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Business Hours */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Clock className="h-6 w-6 text-orange-600 mr-2" />
                  Business Hours
                </h3>
                <div className="space-y-2">
                  {Object.entries(companyData.businessHours).map(([day, hours]) => {
                    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
                    const isToday = day === today;
                    
                    return (
                      <div key={day} className={`flex justify-between items-center py-2 ${isToday ? 'bg-white/50 rounded-lg px-3 font-semibold' : ''}`}>
                        <span className={`capitalize ${isToday ? 'text-orange-800' : 'text-gray-700'}`}>
                          {day}
                        </span>
                        <span className={`${isToday ? 'text-orange-800' : 'text-gray-600'}`}>
                          {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 text-emerald-600 mr-2" />
                  Why Choose Us
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{frames.length + sunglasses.length}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Premium Products</p>
                      <p className="text-gray-600 text-sm">Latest eyewear collection</p>
                    </div>
                  </div>
                  
                  {companyData.companyInfo.established && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Since {companyData.companyInfo.established}</p>
                        <p className="text-gray-600 text-sm">Years of experience</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{inquiryStats.completed}+ Happy Customers</p>
                      <p className="text-gray-600 text-sm">Satisfied clients served</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute -top-4 -left-4 w-24 h-24 border border-white rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-white rounded-full animate-bounce"></div>
            </div>
            
            <div className="relative">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Find Your Perfect Frames?
              </h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Visit our showroom today and let our experts help you choose the perfect eyewear for your needs and style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/frames"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  View Frames
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/sunglasses"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {companyData?.homePage?.ctaButtons?.sunglasses || 'View Sunglasses'}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Contact Us
                  <Mail className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;