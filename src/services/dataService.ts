import type { Frame } from '../types/frames';
import type { Sunglasses } from '../types/sunglasses';

// Company data types
export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  established: string;
  logo: string;
}

export interface ContactInfo {
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: {
    primary: string;
    secondary: string;
  };
  email: {
    primary: string;
    support: string;
  };
  website: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

export interface BusinessHours {
  [key: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
}

export interface ServiceInfo {
  id: string;
  name: string;
  description: string;
  price: string | number;
  duration: string;
  icon: string;
}

export interface FeatureInfo {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface AboutPageContent {
  mission: string;
  vision: string;
  values: string[];
  history: string;
  team: {
    name: string;
    position: string;
    description: string;
    image: string;
  }[];
}

export interface FooterContent {
  quickLinks: {
    title: string;
    url: string;
  }[];
  aboutText: string;
  copyrightText: string;
}

export interface HomePageContent {
  heroTitle: string;
  heroSubtitle: string;
  ctaButtons: {
    frames: string;
    sunglasses: string;
    appointment: string;
  };
  sectionsHeadings: {
    whyChoose: string;
    whyChooseDescription: string;
    featuredProducts: string;
    featuredProductsDescription: string;
    visitUs: string;
    visitUsDescription: string;
    finalCta: string;
    finalCtaDescription: string;
  };
}

export interface ContactPageContent {
  heroTitle: string;
  heroDescription: string;
  formLabels: {
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
    submit: string;
  };
  mapSection: {
    title: string;
    description: string;
  };
}

export interface NavigationItem {
  name: string;
  href: string;
}

export interface SiteContent {
  navigation: NavigationItem[];
}

export interface CompanyData {
  companyInfo: CompanyInfo;
  contact: ContactInfo;
  businessHours: BusinessHours;
  services: ServiceInfo[];
  features: FeatureInfo[];
  testimonials: Testimonial[];
  aboutPage: AboutPageContent;
  footer: FooterContent;
  homePage: HomePageContent;
  contactPage: ContactPageContent;
  siteContent: SiteContent;
}

class DataService {
  private framesCache: Frame[] | null = null;
  private sunglassesCache: Sunglasses[] | null = null;
  private companyCache: CompanyData | null = null;
  private get apiBaseUrl(): string {
    // Use current domain for API calls in production, localhost for development
    if (typeof window !== 'undefined') {
      // In production, assume API is on same domain with port 3001
      // In development, use localhost:3001
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const baseUrl = isLocalhost 
        ? 'http://localhost:3001'
        : `${window.location.protocol}//${window.location.hostname}:3001`;
      return `${baseUrl}/api`;
    }
    
    // Default fallback for development
    return 'http://localhost:3001/api';
  }

  // Frames management
  async getFrames(): Promise<Frame[]> {
    if (this.framesCache) {
      return this.framesCache;
    }

    try {
      console.log('📖 Loading frames from backend API...');
      
      const response = await fetch(`${this.apiBaseUrl}/frames`);
      if (!response.ok) {
        throw new Error('Failed to fetch frames from API');
      }
      
      this.framesCache = await response.json();
      console.log(`✅ Loaded ${this.framesCache?.length || 0} frames from backend API`);
      
      return this.framesCache || [];
    } catch (error) {
      console.error('Error loading frames from backend API:', error);
      
      // Fallback to localStorage if API fails
      const localData = localStorage.getItem('frames_data');
      if (localData) {
        console.log('📱 Final fallback: Loading frames from localStorage');
        try {
          this.framesCache = JSON.parse(localData);
          return this.framesCache;
        } catch (parseError) {
          console.error('Failed to parse frames from localStorage:', parseError);
        }
      }
      
      console.warn('No frames data available, returning empty array');
      return [];
    }
  }

  async saveFrames(frames: Frame[]): Promise<boolean> {
    try {
      this.framesCache = frames;
      
      console.log('💾 Saving frames to backend API...');
      
      const response = await fetch(`${this.apiBaseUrl}/frames`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(frames),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save frames to API');
      }
      
      const result = await response.json();
      console.log(`✅ Saved ${frames.length} frames to backend API`);
      console.log('📊 Database Operation Complete:');
      console.log(`   - Table: frames`);
      console.log(`   - Operation: UPDATE`);
      console.log(`   - Records: ${frames.length}`);
      console.log(`   - Status: ✅ SUCCESS`);
      console.log(`   - Automatic JSON file update: ✅ COMPLETE`);
      
      // Clear cache to ensure fresh data on next load
      this.framesCache = null;
      
      return true;
    } catch (error) {
      console.error('❌ Backend API Error:', error);
      
      // Fallback: Save to localStorage and create downloadable JSON
      try {
        console.log('🔄 Fallback: Saving to localStorage...');
        const jsonContent = JSON.stringify(frames, null, 2);
        localStorage.setItem('frames_data', jsonContent);
        this.createDownloadableJSON(jsonContent, 'frames.json');
        
        console.log('📊 Fallback Operation Complete:');
        console.log(`   - Saved to localStorage: ✅`);
        console.log(`   - JSON file available for download: ✅`);
        console.log(`   - Note: Backend API unavailable, manual JSON update required`);
        
        return true;
      } catch (fallbackError) {
        console.error('❌ Fallback Error:', fallbackError);
        return false;
      }
    }
  }

  private createDownloadableJSON(content: string, filename: string): void {
    try {
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Store the download info for later use
      const downloadInfo = {
        url,
        filename,
        content,
        timestamp: Date.now()
      };
      
      localStorage.setItem(`download_${filename}`, JSON.stringify(downloadInfo));
      
      // Automatically trigger download
      this.autoDownloadJSON(url, filename);
      
      console.log(`📁 ${filename} has been updated and downloaded!`);
      console.log(`📋 Next steps:`);
      console.log(`1. Check your Downloads folder for ${filename}`);
      console.log(`2. Replace the file in public/data/${filename}`);
      console.log(`3. Refresh the page to see changes`);
      console.log(`\n🔄 Alternative: Copy this JSON content to public/data/${filename}:`);
      console.log(content);
      
      // Auto-cleanup URL after 5 minutes
      setTimeout(() => {
        URL.revokeObjectURL(url);
        localStorage.removeItem(`download_${filename}`);
      }, 5 * 60 * 1000);
      
    } catch (error) {
      console.error('Error creating downloadable JSON:', error);
    }
  }

  private autoDownloadJSON(url: string, filename: string): void {
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error auto-downloading JSON:', error);
    }
  }

  async createFrame(frameData: Omit<Frame, 'id'>): Promise<Frame | null> {
    try {
      const frames = await this.getFrames();
      const newFrame: Frame = {
        ...frameData,
        id: `frame-${Date.now()}`,
      };
      
      const updatedFrames = [...frames, newFrame];
      const success = await this.saveFrames(updatedFrames);
      
      return success ? newFrame : null;
    } catch (error) {
      console.error('Error creating frame:', error);
      return null;
    }
  }

  async updateFrame(id: string, frameData: Partial<Frame>): Promise<boolean> {
    try {
      const frames = await this.getFrames();
      const originalFrame = frames.find(frame => frame.id === id);
      
      if (originalFrame && frameData.images) {
        // Compare old and new images to find removed images
        const originalImages = originalFrame.images || (originalFrame.imageUrl ? [originalFrame.imageUrl] : []);
        const newImages = frameData.images;
        
        // Find images that were removed
        const removedImages = originalImages.filter(img => !newImages.includes(img));
        
        // Delete removed images from server
        for (const removedImage of removedImages) {
          try {
            await this.deleteImage(removedImage);
            console.log('✅ Removed image during frame update:', removedImage);
          } catch (error) {
            console.error('❌ Failed to delete removed image:', removedImage, error);
          }
        }
      }
      
      const updatedFrames = frames.map(frame => 
        frame.id === id ? { ...frame, ...frameData } : frame
      );
      
      return await this.saveFrames(updatedFrames);
    } catch (error) {
      console.error('Error updating frame:', error);
      return false;
    }
  }

  async deleteFrame(id: string): Promise<boolean> {
    try {
      const frames = await this.getFrames();
      const frameToDelete = frames.find(f => f.id === id);
      
      if (frameToDelete) {
        // Delete all associated images
        const imagesToDelete = frameToDelete.images || (frameToDelete.imageUrl ? [frameToDelete.imageUrl] : []);
        
        for (const image of imagesToDelete) {
          try {
            await this.deleteImage(image);
            console.log('✅ Deleted frame image:', image);
          } catch (error) {
            console.error('❌ Failed to delete frame image:', image, error);
          }
        }
      }
      
      const updatedFrames = frames.filter(frame => frame.id !== id);
      return await this.saveFrames(updatedFrames);
    } catch (error) {
      console.error('Error deleting frame:', error);
      return false;
    }
  }

  // Sunglasses management
  async getSunglasses(): Promise<Sunglasses[]> {
    // Force fresh load - clear cache
    this.sunglassesCache = null;

    try {
      console.log('🕶️ Loading sunglasses from backend API...');
      
      const response = await fetch(`${this.apiBaseUrl}/sunglasses`);
      if (!response.ok) {
        throw new Error('Failed to fetch sunglasses from API');
      }
      
      this.sunglassesCache = await response.json();
      console.log(`✅ Loaded ${this.sunglassesCache?.length || 0} sunglasses from backend API`);
      
      return this.sunglassesCache || [];
    } catch (error) {
      console.error('Error loading sunglasses from backend API:', error);
      
      // Fallback to localStorage if API fails
      const localData = localStorage.getItem('sunglasses_data');
      if (localData) {
        console.log('📱 Final fallback: Loading sunglasses from localStorage');
        try {
          this.sunglassesCache = JSON.parse(localData);
          return this.sunglassesCache;
        } catch (parseError) {
          console.error('Failed to parse sunglasses from localStorage:', parseError);
        }
      }
      
      console.warn('No sunglasses data available, returning empty array');
      return [];
    }
  }

  async saveSunglasses(sunglasses: Sunglasses[]): Promise<boolean> {
    try {
      this.sunglassesCache = sunglasses;
      
      console.log('💾 Saving sunglasses to backend API...');
      
      const response = await fetch(`${this.apiBaseUrl}/sunglasses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sunglasses),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save sunglasses to API');
      }
      
      const result = await response.json();
      console.log(`✅ Saved ${sunglasses.length} sunglasses to backend API`);
      console.log('📊 Database Operation Complete:');
      console.log(`   - Table: sunglasses`);
      console.log(`   - Operation: UPDATE`);
      console.log(`   - Records: ${sunglasses.length}`);
      console.log(`   - Status: ✅ SUCCESS`);
      console.log(`   - Automatic JSON file update: ✅ COMPLETE`);
      
      // Clear cache to ensure fresh data on next load
      this.sunglassesCache = null;
      
      return true;
    } catch (error) {
      console.error('❌ Backend API Error:', error);
      
      // Fallback: Save to localStorage and create downloadable JSON
      try {
        console.log('🔄 Fallback: Saving to localStorage...');
        const jsonContent = JSON.stringify(sunglasses, null, 2);
        localStorage.setItem('sunglasses_data', jsonContent);
        this.createDownloadableJSON(jsonContent, 'sunglasses.json');
        
        console.log('📊 Fallback Operation Complete:');
        console.log(`   - Saved to localStorage: ✅`);
        console.log(`   - JSON file available for download: ✅`);
        console.log(`   - Note: Backend API unavailable, manual JSON update required`);
        
        return true;
      } catch (fallbackError) {
        console.error('❌ Fallback Error:', fallbackError);
        return false;
      }
    }
  }

  async createSunglasses(sunglassesData: Omit<Sunglasses, 'id'>): Promise<Sunglasses | null> {
    try {
      const sunglasses = await this.getSunglasses();
      const newSunglasses: Sunglasses = {
        ...sunglassesData,
        id: `sg-${Date.now()}`,
      };
      
      const updatedSunglasses = [...sunglasses, newSunglasses];
      const success = await this.saveSunglasses(updatedSunglasses);
      
      return success ? newSunglasses : null;
    } catch (error) {
      console.error('Error creating sunglasses:', error);
      return null;
    }
  }

  async updateSunglasses(id: string, sunglassesData: Partial<Sunglasses>): Promise<boolean> {
    try {
      const sunglasses = await this.getSunglasses();
      const originalSunglasses = sunglasses.find(sg => sg.id === id);
      
      if (originalSunglasses && sunglassesData.images) {
        // Compare old and new images to find removed images
        const originalImages = originalSunglasses.images || (originalSunglasses.imageUrl ? [originalSunglasses.imageUrl] : []);
        const newImages = sunglassesData.images;
        
        // Find images that were removed
        const removedImages = originalImages.filter(img => !newImages.includes(img));
        
        // Delete removed images from server
        for (const removedImage of removedImages) {
          try {
            await this.deleteImage(removedImage);
            console.log('✅ Removed image during sunglasses update:', removedImage);
          } catch (error) {
            console.error('❌ Failed to delete removed image:', removedImage, error);
          }
        }
      }
      
      const updatedSunglasses = sunglasses.map(sg => 
        sg.id === id ? { ...sg, ...sunglassesData } : sg
      );
      
      return await this.saveSunglasses(updatedSunglasses);
    } catch (error) {
      console.error('Error updating sunglasses:', error);
      return false;
    }
  }

  async deleteSunglasses(id: string): Promise<boolean> {
    try {
      const sunglasses = await this.getSunglasses();
      const sunglassesToDelete = sunglasses.find(sg => sg.id === id);
      
      if (sunglassesToDelete) {
        // Delete all associated images
        const imagesToDelete = sunglassesToDelete.images || (sunglassesToDelete.imageUrl ? [sunglassesToDelete.imageUrl] : []);
        
        for (const image of imagesToDelete) {
          try {
            await this.deleteImage(image);
            console.log('✅ Deleted sunglasses image:', image);
          } catch (error) {
            console.error('❌ Failed to delete sunglasses image:', image, error);
          }
        }
      }
      
      const updatedSunglasses = sunglasses.filter(sg => sg.id !== id);
      return await this.saveSunglasses(updatedSunglasses);
    } catch (error) {
      console.error('Error deleting sunglasses:', error);
      return false;
    }
  }

  // Company data management
  async getCompanyData(): Promise<CompanyData | null> {
    if (this.companyCache) {
      return this.companyCache;
    }

    try {
      console.log('🏢 Loading company data from backend API...');
      
      const response = await fetch(`${this.apiBaseUrl}/company`);
      if (!response.ok) {
        throw new Error('Failed to fetch company data from API');
      }
      
      this.companyCache = await response.json();
      console.log('✅ Loaded company data from backend API');
      
      return this.companyCache;
    } catch (error) {
      console.error('Error loading company data from backend API:', error);
      
      // Fallback to localStorage if API fails
      const localData = localStorage.getItem('company_data');
      if (localData) {
        console.log('📱 Final fallback: Loading company data from localStorage');
        try {
          this.companyCache = JSON.parse(localData);
          return this.companyCache;
        } catch (parseError) {
          console.error('Failed to parse company data from localStorage:', parseError);
        }
      }
      
      console.warn('No company data available, returning null');
      return null;
    }
  }

  async saveCompanyData(companyData: CompanyData): Promise<boolean> {
    try {
      this.companyCache = companyData;
      
      console.log('💾 Saving company data to backend API...');
      
      const response = await fetch(`${this.apiBaseUrl}/company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save company data to API');
      }
      
      const result = await response.json();
      console.log('✅ Saved company data to backend API');
      console.log('📊 Database Operation Complete:');
      console.log(`   - Table: company`);
      console.log(`   - Operation: UPDATE`);
      console.log(`   - Records: 1`);
      console.log(`   - Status: ✅ SUCCESS`);
      console.log(`   - Automatic JSON file update: ✅ COMPLETE`);
      
      // Clear cache to ensure fresh data on next load
      this.companyCache = null;
      
      return true;
    } catch (error) {
      console.error('❌ Backend API Error:', error);
      
      // Fallback: Save to localStorage and create downloadable JSON
      try {
        console.log('🔄 Fallback: Saving to localStorage...');
        const jsonContent = JSON.stringify(companyData, null, 2);
        localStorage.setItem('company_data', jsonContent);
        this.createDownloadableJSON(jsonContent, 'company.json');
        
        console.log('📊 Fallback Operation Complete:');
        console.log(`   - Saved to localStorage: ✅`);
        console.log(`   - JSON file available for download: ✅`);
        console.log(`   - Note: Backend API unavailable, manual JSON update required`);
        
        return true;
      } catch (fallbackError) {
        console.error('❌ Fallback Error:', fallbackError);
        return false;
      }
    }
  }

  // Image management
  async saveImage(file: File, folder: 'frames' | 'sunglasses' | 'company' | 'team'): Promise<string | null> {
    try {
      console.log('Starting image save:', { file: file.name, folder, size: file.size });
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Invalid file type. Please select an image file.');
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for file storage
        throw new Error('File size too large. Please select a file smaller than 10MB.');
      }
      
      // Create unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
      const fileName = `${timestamp}_${sanitizedName}`;
      
      // Create the file path
      const filePath = `/images/${folder}/${fileName}`;
      
      // Convert file to data URL for saving
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);
      formData.append('filename', fileName);
      
      // Try to save via backend API first
      try {
        console.log(`🖼️ Attempting to save image via backend API...`);
        const response = await fetch(`${this.apiBaseUrl}/upload-image`, {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`✅ Image saved via backend API: ${result.path}`);
          // Return full URL for images served by the backend
          return result.path;
        } else {
          throw new Error('Backend API image upload failed');
        }
      } catch (apiError) {
        console.log('❌ Backend API image upload failed, falling back to base64 storage:', apiError);
        
        // Fallback: Convert to base64 and store in localStorage (legacy method)
        const dataUrl = await this.fileToDataUrl(file);
        const imageKey = `image_${folder}_${timestamp}_${sanitizedName}`;
        localStorage.setItem(imageKey, dataUrl);
        
        console.log('📱 Image saved to localStorage as fallback with key:', imageKey);
        console.log('⚠️ Note: Image is stored as base64. Backend API needed for file storage.');
        
        return dataUrl; // Return the data URL as fallback
      }
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  }

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  async deleteImage(imagePath: string): Promise<boolean> {
    try {
      console.log('Deleting image:', imagePath);
      
      // If it's an external URL (http/https), we don't need to delete anything
      // Just return true as the reference will be removed from the data
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        console.log('External URL - no deletion needed');
        return true;
      }
      
      // If it's a data URL, we don't need to delete it specifically
      // since it's already stored in the JSON data
      if (imagePath.startsWith('data:')) {
        console.log('Data URL - no deletion needed');
        return true;
      }
      
      // For uploaded files, try to delete from backend server first
      try {
        console.log('🗑️ Attempting to delete image via backend API...');
        const response = await fetch(`${this.apiBaseUrl}/delete-image`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imagePath }),
        });

        const result = await response.json();
        
        if (response.ok) {
          console.log('✅ Backend deletion result:', result.message);
        } else {
          console.warn('⚠️ Backend deletion failed:', result.error);
        }
      } catch (apiError) {
        console.warn('⚠️ Failed to delete via backend API, continuing with fallback:', apiError);
      }
      
      // Fallback: remove from localStorage as well (for older files)
      const keys = Object.keys(localStorage);
      const imageKeys = keys.filter(key => key.startsWith('image_') && localStorage.getItem(key) === imagePath);
      
      imageKeys.forEach(key => {
        localStorage.removeItem(key);
        console.log('Removed image from localStorage:', key);
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  // Utility methods
  clearCache(): void {
    this.framesCache = null;
    this.sunglassesCache = null;
    this.companyCache = null;
  }

  async refreshData(): Promise<void> {
    this.clearCache();
    await Promise.all([
      this.getFrames(),
      this.getSunglasses(),
      this.getCompanyData()
    ]);
  }

  // Utility method to download JSON files for manual update
  downloadJSONFile(filename: 'frames.json' | 'sunglasses.json' | 'company.json'): void {
    const downloadInfo = localStorage.getItem(`download_${filename}`);
    if (downloadInfo) {
      try {
        const { url, content, filename: fileName } = JSON.parse(downloadInfo);
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        console.log(`Downloaded ${fileName}`);
        console.log('After downloading, replace the content in public/data/' + fileName);
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    } else {
      console.log(`No updated ${filename} available for download`);
    }
  }
}

// Export singleton instance
export const dataService = new DataService();