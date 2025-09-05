import { useState, useEffect } from 'react';
import type { Sunglasses, SunglassesFilters } from '../types/sunglasses';
import { dataService } from '../services/dataService';

export const useSunglasses = () => {
  const [sunglasses, setSunglasses] = useState<Sunglasses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSunglasses = async () => {
      try {
        setLoading(true);
        // Load real data from dataService instead of mock data
        const realSunglasses = await dataService.getSunglasses();
        setSunglasses(realSunglasses);
      } catch (err) {
        setError('Failed to load sunglasses data');
        console.error('Error loading sunglasses:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSunglasses();
  }, []);

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
      if (filters.uvProtection !== undefined && !sunglass.lensFeatures.uvProtection) {
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

  const getSunglassesById = (id: string): Sunglasses | undefined => {
    return sunglasses.find(sunglass => sunglass.id === id);
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
    filterSunglasses,
    searchSunglasses,
    getSunglassesById,
    getBrands,
    getCategories,
    getMaterials,
    getShapes,
    getColors
  };
};