import { useState, useEffect } from 'react';
import type { Sunglasses, SunglassesFilters } from '../types/sunglasses';
import { dataService } from '../services/dataService';

export const useSunglassesAdmin = () => {
  const [sunglasses, setSunglasses] = useState<Sunglasses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSunglasses();
  }, []);

  const loadSunglasses = async () => {
    try {
      setLoading(true);
      const sunglassesData = await dataService.getSunglasses();
      setSunglasses(sunglassesData);
      
      // Sync with window for public pages
      window.globalSunglasses = [...sunglassesData];
      window.globalSunglassesLoaded = true;
      
    } catch (err) {
      setError('Failed to load sunglasses data');
      console.error('Error loading sunglasses:', err);
    } finally {
      setLoading(false);
    }
  };

  const syncGlobalSunglasses = (newSunglasses: Sunglasses[]) => {
    setSunglasses([...newSunglasses]);
    
    // Sync with window for public pages
    window.globalSunglasses = [...newSunglasses];
    window.globalSunglassesLoaded = true;
    
    // Notify public pages of update
    window.dispatchEvent(new CustomEvent('sunglassesUpdated'));
    
    console.log('Sunglasses synced to global state:', newSunglasses.length, 'items');
  };

  const createSunglasses = async (sunglassesData: Omit<Sunglasses, 'id'>): Promise<boolean> => {
    try {
      const newSunglasses = await dataService.createSunglasses(sunglassesData);
      if (newSunglasses) {
        const updatedSunglasses = await dataService.getSunglasses();
        syncGlobalSunglasses(updatedSunglasses);
        console.log('Sunglasses created:', newSunglasses);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error creating sunglasses:', err);
      setError('Failed to create sunglasses');
      return false;
    }
  };

  const updateSunglasses = async (id: string, sunglassesData: Partial<Sunglasses>): Promise<boolean> => {
    try {
      const success = await dataService.updateSunglasses(id, sunglassesData);
      if (success) {
        const updatedSunglasses = await dataService.getSunglasses();
        syncGlobalSunglasses(updatedSunglasses);
        console.log('Sunglasses updated:', { id, ...sunglassesData });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating sunglasses:', err);
      setError('Failed to update sunglasses');
      return false;
    }
  };

  const deleteSunglasses = async (id: string): Promise<boolean> => {
    try {
      const success = await dataService.deleteSunglasses(id);
      if (success) {
        const updatedSunglasses = await dataService.getSunglasses();
        syncGlobalSunglasses(updatedSunglasses);
        console.log('Sunglasses deleted:', id);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting sunglasses:', err);
      setError('Failed to delete sunglasses');
      return false;
    }
  };

  const getSunglassesById = (id: string): Sunglasses | undefined => {
    return sunglasses.find(sunglass => sunglass.id === id);
  };

  const filterSunglasses = (filters: SunglassesFilters): Sunglasses[] => {
    return sunglasses.filter(sunglass => {
      if (filters.brand && sunglass.brand.toLowerCase() !== filters.brand.toLowerCase()) {
        return false;
      }
      if (filters.category && sunglass.category !== filters.category) {
        return false;
      }
      if (filters.material && sunglass.material !== filters.material) {
        return false;
      }
      if (filters.shape && sunglass.shape !== filters.shape) {
        return false;
      }
      if (filters.color && !sunglass.color.toLowerCase().includes(filters.color.toLowerCase())) {
        return false;
      }
      if (filters.gender && sunglass.gender !== filters.gender && sunglass.gender !== 'unisex') {
        return false;
      }
      if (filters.priceRange) {
        if (sunglass.price < filters.priceRange.min || sunglass.price > filters.priceRange.max) {
          return false;
        }
      }
      if (filters.inStock !== undefined && sunglass.inStock !== filters.inStock) {
        return false;
      }
      if (filters.polarized !== undefined && sunglass.lensFeatures.polarized !== filters.polarized) {
        return false;
      }
      return true;
    });
  };

  const searchSunglasses = (query: string): Sunglasses[] => {
    if (!query) return sunglasses;
    
    const searchTerm = query.toLowerCase();
    return sunglasses.filter(sunglass => 
      sunglass.name.toLowerCase().includes(searchTerm) ||
      sunglass.brand.toLowerCase().includes(searchTerm) ||
      sunglass.description.toLowerCase().includes(searchTerm) ||
      sunglass.color.toLowerCase().includes(searchTerm) ||
      sunglass.features.some(feature => feature.toLowerCase().includes(searchTerm))
    );
  };

  const getBrands = (): string[] => {
    return Array.from(new Set(sunglasses.map(sunglass => sunglass.brand))).sort();
  };

  const getCategories = (): string[] => {
    return Array.from(new Set(sunglasses.map(sunglass => sunglass.category))).sort();
  };

  const getMaterials = (): string[] => {
    return Array.from(new Set(sunglasses.map(sunglass => sunglass.material))).sort();
  };

  const getShapes = (): string[] => {
    return Array.from(new Set(sunglasses.map(sunglass => sunglass.shape))).sort();
  };

  const getColors = (): string[] => {
    return Array.from(new Set(sunglasses.map(sunglass => sunglass.color))).sort();
  };

  return {
    sunglasses,
    loading,
    error,
    createSunglasses,
    updateSunglasses,
    deleteSunglasses,
    getSunglassesById,
    filterSunglasses,
    searchSunglasses,
    getBrands,
    getCategories,
    getMaterials,
    getShapes,
    getColors,
    refreshSunglasses: loadSunglasses,
  };
};