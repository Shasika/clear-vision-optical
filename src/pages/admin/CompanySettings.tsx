import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Save,
  Plus,
  Trash2,
  Star,
  Globe,
  Target,
  FileText,
  Layout,
  Home,
  MessageSquare,
  Menu
} from 'lucide-react';
import { useCompanyData } from '../../hooks/useCompanyData';
import ImageUpload from '../../components/admin/ImageUpload';

const CompanySettings: React.FC = () => {
  const { companyData, loading, error, updateCompanyInfo, updateContactInfo, updateBusinessHours, updateFeatures, updateAboutPage, updateFooter, updateHomePage, updateContactPage, updateSiteContent } = useCompanyData();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'company' | 'contact' | 'hours' | 'services' | 'features' | 'about' | 'footer' | 'homepage' | 'contactpage' | 'navigation'>('company');
  const [currentLogo, setCurrentLogo] = useState('');
  const [teamMembers, setTeamMembers] = useState(companyData?.aboutPage?.team || [
    { name: '', position: '', description: '', image: '' },
    { name: '', position: '', description: '', image: '' },
    { name: '', position: '', description: '', image: '' }
  ]);
  const [removedTeamImages, setRemovedTeamImages] = useState<string[]>([]);

  // Initialize logo state when company data loads
  React.useEffect(() => {
    if (companyData?.companyInfo.logo) {
      setCurrentLogo(companyData.companyInfo.logo);
    }
  }, [companyData]);

  // Update team members when company data loads
  React.useEffect(() => {
    if (companyData?.aboutPage?.team) {
      const teamData = companyData.aboutPage.team;
      // Ensure we always have 3 team member slots
      const fullTeam = [
        teamData[0] || { name: '', position: '', description: '', image: '' },
        teamData[1] || { name: '', position: '', description: '', image: '' },
        teamData[2] || { name: '', position: '', description: '', image: '' }
      ];
      setTeamMembers(fullTeam);
    }
  }, [companyData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading company settings...</span>
      </div>
    );
  }

  if (error || !companyData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">{error || 'Failed to load company data'}</p>
      </div>
    );
  }

  const tabs = [
    { id: 'company', name: 'Company Info', icon: Building },
    { id: 'contact', name: 'Contact Info', icon: MapPin },
    { id: 'hours', name: 'Business Hours', icon: Clock },
    { id: 'services', name: 'Services', icon: Star },
    { id: 'features', name: 'Why Choose Us', icon: Target },
    { id: 'about', name: 'About Page', icon: FileText },
    { id: 'homepage', name: 'Home Page', icon: Home },
    { id: 'contactpage', name: 'Contact Page', icon: MessageSquare },
    { id: 'navigation', name: 'Navigation', icon: Menu },
    { id: 'footer', name: 'Footer Content', icon: Layout },
  ];

  const handleCompanyInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedInfo = {
      name: formData.get('name') as string,
      tagline: formData.get('tagline') as string,
      description: formData.get('description') as string,
      established: formData.get('established') as string,
      logo: currentLogo, // Use the current logo state
    };

    const success = await updateCompanyInfo(updatedInfo);
    if (success) {
      console.log('Company info updated successfully');
    }
    setSaving(false);
  };

  const handleContactInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedContact = {
      ...companyData.contact,
      address: {
        street: formData.get('street') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zipCode: formData.get('zipCode') as string,
        country: formData.get('country') as string,
      },
      phone: {
        primary: formData.get('primaryPhone') as string,
        secondary: formData.get('secondaryPhone') as string,
      },
      email: {
        primary: formData.get('primaryEmail') as string,
        support: formData.get('supportEmail') as string,
      },
      website: formData.get('website') as string,
      socialMedia: {
        facebook: formData.get('facebook') as string,
        instagram: formData.get('instagram') as string,
        twitter: formData.get('twitter') as string,
      }
    };

    const success = await updateContactInfo(updatedContact);
    if (success) {
      console.log('Contact info updated successfully');
    }
    setSaving(false);
  };

  const handleBusinessHoursSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    const updatedHours = days.reduce((hours, day) => {
      hours[day] = {
        open: formData.get(`${day}_open`) as string,
        close: formData.get(`${day}_close`) as string,
        closed: formData.get(`${day}_closed`) === 'on',
      };
      return hours;
    }, {} as typeof companyData.businessHours);

    const success = await updateBusinessHours(updatedHours);
    if (success) {
      console.log('Business hours updated successfully');
    }
    setSaving(false);
  };

  const handleFeaturesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const features = [];
    
    for (let i = 0; i < 4; i++) {
      const title = formData.get(`feature_${i}_title`) as string;
      const description = formData.get(`feature_${i}_description`) as string;
      const icon = formData.get(`feature_${i}_icon`) as string;
      
      if (title && description) {
        features.push({ title, description, icon: icon || 'Star' });
      }
    }

    const success = await updateFeatures(features);
    if (success) {
      console.log('Features updated successfully');
    }
    setSaving(false);
  };

  const handleHomePageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedHomePage = {
      heroTitle: formData.get('heroTitle') as string,
      heroSubtitle: formData.get('heroSubtitle') as string,
      ctaButtons: {
        frames: formData.get('ctaFrames') as string,
        sunglasses: formData.get('ctaSunglasses') as string,
        appointment: formData.get('ctaAppointment') as string,
      },
      sectionsHeadings: {
        whyChoose: formData.get('whyChoose') as string,
        whyChooseDescription: formData.get('whyChooseDescription') as string,
        featuredProducts: formData.get('featuredProducts') as string,
        featuredProductsDescription: formData.get('featuredProductsDescription') as string,
        visitUs: formData.get('visitUs') as string,
        visitUsDescription: formData.get('visitUsDescription') as string,
        finalCta: formData.get('finalCta') as string,
        finalCtaDescription: formData.get('finalCtaDescription') as string,
      }
    };

    const success = await updateHomePage(updatedHomePage);
    if (success) {
      console.log('Home page updated successfully');
    }
    setSaving(false);
  };

  const handleContactPageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedContactPage = {
      heroTitle: formData.get('heroTitle') as string,
      heroDescription: formData.get('heroDescription') as string,
      formLabels: {
        name: formData.get('labelName') as string,
        email: formData.get('labelEmail') as string,
        phone: formData.get('labelPhone') as string,
        service: formData.get('labelService') as string,
        message: formData.get('labelMessage') as string,
        submit: formData.get('labelSubmit') as string,
      },
      mapSection: {
        title: formData.get('mapTitle') as string,
        description: formData.get('mapDescription') as string,
      }
    };

    const success = await updateContactPage(updatedContactPage);
    if (success) {
      console.log('Contact page updated successfully');
    }
    setSaving(false);
  };

  const handleNavigationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const navigation = [];
    
    for (let i = 0; i < 6; i++) {
      const name = formData.get(`nav_${i}_name`) as string;
      const href = formData.get(`nav_${i}_href`) as string;
      
      if (name && href) {
        navigation.push({ name, href });
      }
    }

    const updatedSiteContent = {
      navigation: navigation
    };

    const success = await updateSiteContent(updatedSiteContent);
    if (success) {
      console.log('Navigation updated successfully');
    }
    setSaving(false);
  };

  const handleTeamImageChange = (index: number, imageUrl: string | null) => {
    console.log(`Updating team member ${index} image:`, imageUrl);
    
    setTeamMembers(prevTeamMembers => {
      const updatedTeam = [...prevTeamMembers];
      
      // Ensure the team member object exists at this index
      if (!updatedTeam[index]) {
        updatedTeam[index] = { name: '', position: '', description: '', image: '' };
      }
      
      // Track removed images for cleanup
      const oldImage = updatedTeam[index].image;
      if (oldImage && oldImage !== imageUrl && !oldImage.startsWith('http') && !oldImage.startsWith('data:')) {
        console.log(`Tracking removed team image for cleanup: ${oldImage}`);
        setRemovedTeamImages(prev => [...prev, oldImage]);
      }
      
      updatedTeam[index] = { ...updatedTeam[index], image: imageUrl || '' };
      console.log(`Team member ${index} updated:`, updatedTeam[index]);
      
      return updatedTeam;
    });
  };

  const handleAboutPageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const values = [];
    
    for (let i = 0; i < 5; i++) {
      const value = formData.get(`value_${i}`) as string;
      if (value) values.push(value);
    }

    // Get team member data from form
    const team = [];
    for (let i = 0; i < 3; i++) {
      const name = formData.get(`team_${i}_name`) as string;
      const position = formData.get(`team_${i}_position`) as string;
      const description = formData.get(`team_${i}_description`) as string;
      
      if (name && position) {
        team.push({
          name,
          position,
          description: description || '',
          image: teamMembers[i]?.image || ''
        });
      }
    }

    const updatedAboutPage = {
      mission: formData.get('mission') as string,
      vision: formData.get('vision') as string,
      values: values,
      history: formData.get('history') as string,
      team: team
    };

    const success = await updateAboutPage(updatedAboutPage);
    if (success) {
      console.log('About page updated successfully');
      
      // Clean up removed team images after successful save
      if (removedTeamImages.length > 0) {
        console.log(`🧹 Cleaning up ${removedTeamImages.length} removed team images...`);
        
        for (const imageUrl of removedTeamImages) {
          try {
            console.log(`   - Deleting: ${imageUrl}`);
            await dataService.deleteImage(imageUrl);
          } catch (error) {
            console.warn(`   - Failed to delete ${imageUrl}:`, error);
          }
        }
        
        // Clear the removed images list
        setRemovedTeamImages([]);
        console.log('✅ Team image cleanup completed');
      }
    }
    setSaving(false);
  };

  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const quickLinks = [];
    
    for (let i = 0; i < 6; i++) {
      const title = formData.get(`link_${i}_title`) as string;
      const url = formData.get(`link_${i}_url`) as string;
      
      if (title && url) {
        quickLinks.push({ title, url });
      }
    }

    const updatedFooter = {
      quickLinks: quickLinks,
      aboutText: formData.get('aboutText') as string,
      copyrightText: formData.get('copyrightText') as string
    };

    const success = await updateFooter(updatedFooter);
    if (success) {
      console.log('Footer updated successfully');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
        <p className="text-gray-600">Manage your company information and settings</p>
      </div>

      {/* Tab Navigation - Mobile Responsive */}
      <div className="border-b border-gray-200">
        {/* Mobile Dropdown */}
        <div className="sm:hidden">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Desktop/Tablet Tabs */}
        <nav className="hidden sm:flex sm:-mb-px sm:flex-wrap">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-2 px-3 mr-2 mb-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="hidden md:inline">{tab.name}</span>
                <span className="md:hidden text-xs">{tab.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'company' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
          
          <form onSubmit={handleCompanyInfoSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={companyData.companyInfo.name}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  name="tagline"
                  defaultValue={companyData.companyInfo.tagline}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                <input
                  type="text"
                  name="established"
                  defaultValue={companyData.companyInfo.established}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                defaultValue={companyData.companyInfo.description}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
              <ImageUpload
                currentImage={currentLogo}
                folder="company"
                onImageChange={(imageUrl) => {
                  // Update local logo state - will be saved when form is submitted
                  setCurrentLogo(imageUrl || '');
                }}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          
          <form onSubmit={handleContactInfoSubmit} className="space-y-6">
            {/* Address */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    defaultValue={companyData.contact.address.street}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    defaultValue={companyData.contact.address.city}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                  <input
                    type="text"
                    name="state"
                    defaultValue={companyData.contact.address.state}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    defaultValue={companyData.contact.address.zipCode}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    defaultValue={companyData.contact.address.country}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Phone Numbers
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone</label>
                    <input
                      type="tel"
                      name="primaryPhone"
                      defaultValue={companyData.contact.phone.primary}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Phone</label>
                    <input
                      type="tel"
                      name="secondaryPhone"
                      defaultValue={companyData.contact.phone.secondary}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Addresses
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Email</label>
                    <input
                      type="email"
                      name="primaryEmail"
                      defaultValue={companyData.contact.email.primary}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                    <input
                      type="email"
                      name="supportEmail"
                      defaultValue={companyData.contact.email.support}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Website & Social Media */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Website & Social Media
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    name="website"
                    defaultValue={companyData.contact.website}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <input
                    type="url"
                    name="facebook"
                    defaultValue={companyData.contact.socialMedia.facebook}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input
                    type="url"
                    name="instagram"
                    defaultValue={companyData.contact.socialMedia.instagram}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                  <input
                    type="url"
                    name="twitter"
                    defaultValue={companyData.contact.socialMedia.twitter}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'hours' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h2>
          
          <form onSubmit={handleBusinessHoursSubmit} className="space-y-4">
            {Object.entries(companyData.businessHours).map(([day, hours]) => (
              <div key={day} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center py-3 border-b border-gray-200">
                <div className="font-medium text-gray-900 capitalize">{day}</div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={`${day}_closed`}
                    defaultChecked={hours.closed}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label className="text-sm text-gray-700">Closed</label>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Open</label>
                  <input
                    type="time"
                    name={`${day}_open`}
                    defaultValue={hours.open}
                    disabled={hours.closed}
                    className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Close</label>
                  <input
                    type="time"
                    name={`${day}_close`}
                    defaultValue={hours.close}
                    disabled={hours.closed}
                    className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Services</h2>
            <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </button>
          </div>
          
          <div className="space-y-4">
            {companyData.services.map((service) => (
              <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Price: {service.price}</span>
                      <span>Duration: {service.duration}</span>
                    </div>
                  </div>
                  <button className="text-red-600 hover:text-red-800 p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'features' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Us - Features</h2>
          
          <form onSubmit={handleFeaturesSubmit} className="space-y-6">
            {[0, 1, 2, 3].map((index) => {
              const feature = companyData?.features?.[index];
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Feature {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        name={`feature_${index}_title`}
                        defaultValue={feature?.title || ''}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Feature title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name</label>
                      <input
                        type="text"
                        name={`feature_${index}_icon`}
                        defaultValue={feature?.icon || 'Star'}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Icon name (e.g., Eye, Users, Award)"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        name={`feature_${index}_description`}
                        defaultValue={feature?.description || ''}
                        rows={2}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Feature description"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Features
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">About Page Content</h2>
          
          <form onSubmit={handleAboutPageSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mission Statement</label>
              <textarea
                name="mission"
                defaultValue={companyData?.aboutPage?.mission || ''}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Your company's mission statement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vision Statement</label>
              <textarea
                name="vision"
                defaultValue={companyData?.aboutPage?.vision || ''}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Your company's vision statement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Values</label>
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    name={`value_${index}`}
                    defaultValue={companyData?.aboutPage?.values?.[index] || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder={`Value ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company History</label>
              <textarea
                name="history"
                defaultValue={companyData?.aboutPage?.history || ''}
                rows={5}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Tell your company's story and history"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Team Members</label>
              {[0, 1, 2].map((index) => {
                // Prioritize teamMembers state over companyData for current session
                const member = teamMembers[index] || companyData?.aboutPage?.team?.[index] || { name: '', position: '', description: '', image: '' };
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <h3 className="text-md font-medium text-gray-900 mb-3">Team Member {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          name={`team_${index}_name`}
                          defaultValue={member?.name || ''}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Team member name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                        <input
                          type="text"
                          name={`team_${index}_position`}
                          defaultValue={member?.position || ''}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Job title/position"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          name={`team_${index}_description`}
                          defaultValue={member?.description || ''}
                          rows={2}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Brief description or experience"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                        <ImageUpload
                          key={`team-member-image-${index}`}
                          currentImage={member?.image || ''}
                          folder="team"
                          onImageChange={(imageUrl) => handleTeamImageChange(index, imageUrl)}
                          uniqueId={`team-member-${index}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save About Page
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'footer' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Footer Content</h2>
          
          <form onSubmit={handleFooterSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">About Text</label>
              <textarea
                name="aboutText"
                defaultValue={companyData?.footer?.aboutText || ''}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Brief description for footer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Links</label>
              {[0, 1, 2, 3, 4, 5].map((index) => {
                const link = companyData?.footer?.quickLinks?.[index];
                return (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <input
                        type="text"
                        name={`link_${index}_title`}
                        defaultValue={link?.title || ''}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder={`Link ${index + 1} title`}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name={`link_${index}_url`}
                        defaultValue={link?.url || ''}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder={`Link ${index + 1} URL`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
              <input
                type="text"
                name="copyrightText"
                defaultValue={companyData?.footer?.copyrightText || ''}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Copyright text (e.g., © 2024 Your Company Name. All rights reserved.)"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Footer
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'homepage' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Home Page Content</h2>
          
          <form onSubmit={handleHomePageSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                <input
                  type="text"
                  name="heroTitle"
                  defaultValue={companyData?.homePage?.heroTitle || ''}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Main hero title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                <input
                  type="text"
                  name="heroSubtitle"
                  defaultValue={companyData?.homePage?.heroSubtitle || ''}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Hero subtitle"
                />
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">CTA Button Labels</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frames Button</label>
                  <input
                    type="text"
                    name="ctaFrames"
                    defaultValue={companyData?.homePage?.ctaButtons?.frames || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Browse Frames"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sunglasses Button</label>
                  <input
                    type="text"
                    name="ctaSunglasses"
                    defaultValue={companyData?.homePage?.ctaButtons?.sunglasses || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="View Sunglasses"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Button</label>
                  <input
                    type="text"
                    name="ctaAppointment"
                    defaultValue={companyData?.homePage?.ctaButtons?.appointment || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Book Appointment"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">Section Headings</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Why Choose Title</label>
                    <input
                      type="text"
                      name="whyChoose"
                      defaultValue={companyData?.homePage?.sectionsHeadings?.whyChoose || ''}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Why Choose Description</label>
                    <input
                      type="text"
                      name="whyChooseDescription"
                      defaultValue={companyData?.homePage?.sectionsHeadings?.whyChooseDescription || ''}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Featured Products Title</label>
                    <input
                      type="text"
                      name="featuredProducts"
                      defaultValue={companyData?.homePage?.sectionsHeadings?.featuredProducts || ''}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Featured Products Description</label>
                    <input
                      type="text"
                      name="featuredProductsDescription"
                      defaultValue={companyData?.homePage?.sectionsHeadings?.featuredProductsDescription || ''}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visit Us Title</label>
                    <input
                      type="text"
                      name="visitUs"
                      defaultValue={companyData?.homePage?.sectionsHeadings?.visitUs || ''}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visit Us Description</label>
                    <input
                      type="text"
                      name="visitUsDescription"
                      defaultValue={companyData?.homePage?.sectionsHeadings?.visitUsDescription || ''}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Final CTA Title</label>
                    <input
                      type="text"
                      name="finalCta"
                      defaultValue={companyData?.homePage?.sectionsHeadings?.finalCta || ''}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Final CTA Description</label>
                    <input
                      type="text"
                      name="finalCtaDescription"
                      defaultValue={companyData?.homePage?.sectionsHeadings?.finalCtaDescription || ''}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Home Page
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'contactpage' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Page Content</h2>
          
          <form onSubmit={handleContactPageSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                <input
                  type="text"
                  name="heroTitle"
                  defaultValue={companyData?.contactPage?.heroTitle || ''}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Contact page hero title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Description</label>
                <textarea
                  name="heroDescription"
                  defaultValue={companyData?.contactPage?.heroDescription || ''}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Contact page description"
                />
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">Form Labels</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name Field Label</label>
                  <input
                    type="text"
                    name="labelName"
                    defaultValue={companyData?.contactPage?.formLabels?.name || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Field Label</label>
                  <input
                    type="text"
                    name="labelEmail"
                    defaultValue={companyData?.contactPage?.formLabels?.email || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Field Label</label>
                  <input
                    type="text"
                    name="labelPhone"
                    defaultValue={companyData?.contactPage?.formLabels?.phone || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Field Label</label>
                  <input
                    type="text"
                    name="labelService"
                    defaultValue={companyData?.contactPage?.formLabels?.service || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message Field Label</label>
                  <input
                    type="text"
                    name="labelMessage"
                    defaultValue={companyData?.contactPage?.formLabels?.message || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Submit Button Label</label>
                  <input
                    type="text"
                    name="labelSubmit"
                    defaultValue={companyData?.contactPage?.formLabels?.submit || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">Map Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Map Section Title</label>
                  <input
                    type="text"
                    name="mapTitle"
                    defaultValue={companyData?.contactPage?.mapSection?.title || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Map Section Description</label>
                  <input
                    type="text"
                    name="mapDescription"
                    defaultValue={companyData?.contactPage?.mapSection?.description || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Contact Page
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'navigation' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Site Navigation</h2>
          
          <form onSubmit={handleNavigationSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Navigation Menu Items</label>
              {[0, 1, 2, 3, 4, 5].map((index) => {
                const navItem = companyData?.siteContent?.navigation?.[index];
                return (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Menu Item {index + 1} - Name</label>
                      <input
                        type="text"
                        name={`nav_${index}_name`}
                        defaultValue={navItem?.name || ''}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Menu item name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Menu Item {index + 1} - URL</label>
                      <input
                        type="text"
                        name={`nav_${index}_href`}
                        defaultValue={navItem?.href || ''}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="/page-url"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Navigation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CompanySettings;