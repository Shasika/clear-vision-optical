import { useState, useEffect } from 'react';
import type { Frame, FrameFilters } from '../types/frames';
import { dataService } from '../services/dataService';

// Import the global frames from admin hook
declare global {
  interface Window {
    globalFrames?: Frame[];
    globalFramesLoaded?: boolean;
  }
}

export const useFrames = () => {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFrames = async () => {
      try {
        setLoading(true);
        
        // Check if we have admin-managed frames in global state
        if (window.globalFrames && window.globalFramesLoaded) {
          setFrames([...window.globalFrames]);
        } else {
          // Load from JSON data service
          const framesData = await dataService.getFrames();
          setFrames(framesData);
          
          // Store in global state
          window.globalFrames = framesData;
          window.globalFramesLoaded = true;
        }
      } catch (err) {
        setError('Failed to load frames data');
        console.error('Error loading frames:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFrames();

    // Listen for admin updates
    const handleStorageChange = () => {
      if (window.globalFrames) {
        setFrames([...window.globalFrames]);
      }
    };

    window.addEventListener('framesUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('framesUpdated', handleStorageChange);
    };
  }, []);

  const filterFrames = (filters: FrameFilters): Frame[] => {
    return frames.filter(frame => {
      if (filters.brand && frame.brand.toLowerCase() !== filters.brand.toLowerCase()) {
        return false;
      }
      if (filters.category && frame.category !== filters.category) {
        return false;
      }
      if (filters.material && frame.material !== filters.material) {
        return false;
      }
      if (filters.shape && frame.shape !== filters.shape) {
        return false;
      }
      if (filters.color && !frame.color.toLowerCase().includes(filters.color.toLowerCase())) {
        return false;
      }
      if (filters.gender && frame.gender !== filters.gender && frame.gender !== 'unisex') {
        return false;
      }
      if (filters.priceRange) {
        if (frame.price < filters.priceRange.min || frame.price > filters.priceRange.max) {
          return false;
        }
      }
      if (filters.inStock !== undefined && frame.inStock !== filters.inStock) {
        return false;
      }
      return true;
    });
  };

  const searchFrames = (query: string): Frame[] => {
    if (!query) return frames;
    
    const searchTerm = query.toLowerCase();
    return frames.filter(frame => 
      frame.name.toLowerCase().includes(searchTerm) ||
      frame.brand.toLowerCase().includes(searchTerm) ||
      frame.description.toLowerCase().includes(searchTerm) ||
      frame.color.toLowerCase().includes(searchTerm) ||
      frame.features.some(feature => feature.toLowerCase().includes(searchTerm))
    );
  };

  const getFrameById = (id: string): Frame | undefined => {
    return frames.find(frame => frame.id === id);
  };

  const getBrands = (): string[] => {
    return Array.from(new Set(frames.map(frame => frame.brand))).sort();
  };

  const getCategories = (): string[] => {
    return Array.from(new Set(frames.map(frame => frame.category))).sort();
  };

  const getMaterials = (): string[] => {
    return Array.from(new Set(frames.map(frame => frame.material))).sort();
  };

  const getShapes = (): string[] => {
    return Array.from(new Set(frames.map(frame => frame.shape))).sort();
  };

  const getColors = (): string[] => {
    return Array.from(new Set(frames.map(frame => frame.color))).sort();
  };

  return {
    frames,
    loading,
    error,
    filterFrames,
    searchFrames,
    getFrameById,
    getBrands,
    getCategories,
    getMaterials,
    getShapes,
    getColors
  };
};