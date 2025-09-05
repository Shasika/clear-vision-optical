import { useState, useEffect } from 'react';
import { dataService, type CompanyData } from '../services/dataService';

export const useCompanyData = () => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      const data = await dataService.getCompanyData();
      setCompanyData(data);
    } catch (err) {
      setError('Failed to load company data');
      console.error('Error loading company data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyData = async (updatedData: CompanyData): Promise<boolean> => {
    try {
      const success = await dataService.saveCompanyData(updatedData);
      if (success) {
        setCompanyData(updatedData);
        
        // Notify other components of the update
        window.dispatchEvent(new CustomEvent('companyDataUpdated', { 
          detail: updatedData 
        }));
        
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating company data:', err);
      setError('Failed to update company data');
      return false;
    }
  };

  const updateCompanyInfo = async (companyInfo: Partial<CompanyData['companyInfo']>): Promise<boolean> => {
    if (!companyData) return false;
    
    const updatedData = {
      ...companyData,
      companyInfo: { ...companyData.companyInfo, ...companyInfo }
    };
    
    return await updateCompanyData(updatedData);
  };

  const updateContactInfo = async (contactInfo: Partial<CompanyData['contact']>): Promise<boolean> => {
    if (!companyData) return false;
    
    const updatedData = {
      ...companyData,
      contact: { ...companyData.contact, ...contactInfo }
    };
    
    return await updateCompanyData(updatedData);
  };

  const updateBusinessHours = async (businessHours: CompanyData['businessHours']): Promise<boolean> => {
    if (!companyData) return false;
    
    const updatedData = {
      ...companyData,
      businessHours
    };
    
    return await updateCompanyData(updatedData);
  };

  const updateServices = async (services: CompanyData['services']): Promise<boolean> => {
    if (!companyData) return false;
    
    const updatedData = {
      ...companyData,
      services
    };
    
    return await updateCompanyData(updatedData);
  };

  const updateFeatures = async (features: CompanyData['features']): Promise<boolean> => {
    if (!companyData) return false;
    
    const updatedData = {
      ...companyData,
      features
    };
    
    return await updateCompanyData(updatedData);
  };

  const updateAboutPage = async (aboutPage: CompanyData['aboutPage']): Promise<boolean> => {
    if (!companyData) return false;
    
    const updatedData = {
      ...companyData,
      aboutPage
    };
    
    return await updateCompanyData(updatedData);
  };

  const updateFooter = async (footer: CompanyData['footer']): Promise<boolean> => {
    if (!companyData) return false;
    
    const updatedData = {
      ...companyData,
      footer
    };
    
    return await updateCompanyData(updatedData);
  };

  const updateHomePage = async (homePage: CompanyData['homePage']): Promise<boolean> => {
    if (!companyData) return false;
    
    const updatedData = {
      ...companyData,
      homePage
    };
    
    return await updateCompanyData(updatedData);
  };

  const updateContactPage = async (contactPage: CompanyData['contactPage']): Promise<boolean> => {
    if (!companyData) return false;
    
    const updatedData = {
      ...companyData,
      contactPage
    };
    
    return await updateCompanyData(updatedData);
  };

  const updateSiteContent = async (siteContent: CompanyData['siteContent']): Promise<boolean> => {
    if (!companyData) return false;
    
    const updatedData = {
      ...companyData,
      siteContent
    };
    
    return await updateCompanyData(updatedData);
  };

  const addService = async (service: Omit<CompanyData['services'][0], 'id'>): Promise<boolean> => {
    if (!companyData) return false;
    
    const newService = {
      ...service,
      id: `service-${Date.now()}`
    };
    
    const updatedServices = [...companyData.services, newService];
    return await updateServices(updatedServices);
  };

  const updateService = async (serviceId: string, serviceData: Partial<CompanyData['services'][0]>): Promise<boolean> => {
    if (!companyData) return false;
    
    const updatedServices = companyData.services.map(service =>
      service.id === serviceId ? { ...service, ...serviceData } : service
    );
    
    return await updateServices(updatedServices);
  };

  const deleteService = async (serviceId: string): Promise<boolean> => {
    if (!companyData) return false;
    
    const updatedServices = companyData.services.filter(service => service.id !== serviceId);
    return await updateServices(updatedServices);
  };

  const addTestimonial = async (testimonial: Omit<CompanyData['testimonials'][0], 'id'>): Promise<boolean> => {
    if (!companyData) return false;
    
    const newTestimonial = {
      ...testimonial,
      id: `testimonial-${Date.now()}`
    };
    
    const updatedTestimonials = [...companyData.testimonials, newTestimonial];
    const updatedData = {
      ...companyData,
      testimonials: updatedTestimonials
    };
    
    return await updateCompanyData(updatedData);
  };

  const deleteTestimonial = async (testimonialId: string): Promise<boolean> => {
    if (!companyData) return false;
    
    const updatedTestimonials = companyData.testimonials.filter(t => t.id !== testimonialId);
    const updatedData = {
      ...companyData,
      testimonials: updatedTestimonials
    };
    
    return await updateCompanyData(updatedData);
  };

  return {
    companyData,
    loading,
    error,
    updateCompanyInfo,
    updateContactInfo,
    updateBusinessHours,
    updateFeatures,
    updateAboutPage,
    updateFooter,
    updateHomePage,
    updateContactPage,
    updateSiteContent,
    addService,
    updateService,
    deleteService,
    addTestimonial,
    deleteTestimonial,
    refreshData: loadCompanyData,
  };
};