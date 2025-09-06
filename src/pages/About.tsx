import React from 'react';
import { Award, Users, Clock, Target, Eye, Star, Shield, Heart } from 'lucide-react';
import { useCompanyData } from '../hooks/useCompanyData';
import ImageWithPlaceholder from '../components/ImageWithPlaceholder';

const About: React.FC = () => {
  const { companyData, loading } = useCompanyData();

  // Icon mapping for dynamic values
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Target, Award, Users, Clock, Eye, Star, Shield, Heart
  };

  const stats = [
    { number: '20+', label: 'Years Experience' },
    { number: '5000+', label: 'Happy Customers' },
    { number: '50+', label: 'Frame Brands' },
    { number: '24/7', label: 'Support' }
  ];

  // Use dynamic values from backend or fallback to default
  const values = companyData?.aboutPage?.values?.length ? 
    companyData.aboutPage.values.slice(0, 4).map((value, index) => ({
      icon: iconMap[['Target', 'Award', 'Users', 'Clock'][index]] || Star,
      title: ['Our Mission', 'Quality Commitment', 'Customer First', 'Trusted Legacy'][index],
      description: value
    })) :
    [
      {
        icon: Target,
        title: 'Our Mission',
        description: 'To provide exceptional vision care and premium eyewear solutions that enhance our customers\' quality of life.'
      },
      {
        icon: Award,
        title: 'Quality Commitment',
        description: 'We partner with world-renowned brands to ensure every product meets the highest standards of quality and durability.'
      },
      {
        icon: Users,
        title: 'Customer First',
        description: 'Our experienced team is dedicated to providing personalized service and expert guidance for every customer.'
      },
      {
        icon: Clock,
        title: 'Trusted Legacy',
        description: 'Over two decades of serving the community has built our reputation as Sri Lanka\'s trusted optical partner.'
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

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              About {companyData?.companyInfo?.name || 'OpticalVision'}
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              {companyData?.aboutPage?.mission || 
               'For over 20 years, we\'ve been dedicated to providing exceptional vision care and premium eyewear solutions to the Sri Lankan community.'}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                {companyData?.aboutPage?.history ? (
                  <div dangerouslySetInnerHTML={{ 
                    __html: companyData.aboutPage.history.replace(/\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>') 
                  }} />
                ) : (
                  <>
                    <p>
                      OpticalVision was founded in 2004 with a simple yet powerful vision: to make quality 
                      eyewear accessible to everyone while providing exceptional customer service. What started 
                      as a small family business has grown into one of Sri Lanka's most trusted optical retailers.
                    </p>
                    <p>
                      Our founder, Dr. Saman Perera, a qualified optometrist with over 25 years of experience, 
                      recognized the need for a comprehensive optical service that combined professional eye care 
                      with a wide selection of quality frames and lenses.
                    </p>
                    <p>
                      Today, we continue to uphold these founding principles while embracing the latest 
                      technology and trends in eyewear. From our flagship store in Colombo, we serve 
                      customers across the island with the same dedication to quality and service that 
                      has defined us from the beginning.
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-primary-100 rounded-3xl flex items-center justify-center">
                <div className="text-primary-600 text-center">
                  <Award className="h-24 w-24 mx-auto mb-4" />
                  <p className="text-lg font-semibold">Excellence in Vision Care</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape the experience we provide to our customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our experienced professionals are here to help you find the perfect vision solution.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(companyData?.aboutPage?.team?.length ? companyData.aboutPage.team : [
              { name: 'Dr. Saman Perera', position: 'Founder & Chief Optometrist', description: '25+ years experience', image: '' },
              { name: 'Priya Jayawardena', position: 'Senior Optical Consultant', description: '15+ years experience', image: '' },
              { name: 'Rajesh Kumar', position: 'Frame Specialist', description: '12+ years experience', image: '' }
            ]).map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                  <ImageWithPlaceholder
                    src={member.image} 
                    alt={member.name}
                    placeholderType="person"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-2">{member.position}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;