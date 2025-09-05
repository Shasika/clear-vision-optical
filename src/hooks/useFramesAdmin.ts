import { useState, useEffect } from 'react';
import type { Frame, FrameFilters } from '../types/frames';
import { dataService } from '../services/dataService';

export const useFramesAdmin = () => {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFrames();
  }, []);

  const loadFrames = async () => {
    try {
      setLoading(true);
      const framesData = await dataService.getFrames();
      setFrames(framesData);
      
      // Sync with window for public pages
      window.globalFrames = [...framesData];
      window.globalFramesLoaded = true;
      
    } catch (err) {
      setError('Failed to load frames data');
      console.error('Error loading frames:', err);
    } finally {
      setLoading(false);
    }
  };

  const syncGlobalFrames = (newFrames: Frame[]) => {
    setFrames([...newFrames]);
    
    // Sync with window for public pages
    window.globalFrames = [...newFrames];
    window.globalFramesLoaded = true;
    
    // Notify public pages of update
    window.dispatchEvent(new CustomEvent('framesUpdated'));
    
    console.log('Frames synced to global state:', newFrames.length, 'items');
  };

  const createFrame = async (frameData: Omit<Frame, 'id'>): Promise<boolean> => {
    try {
      const newFrame = await dataService.createFrame(frameData);
      if (newFrame) {
        const updatedFrames = await dataService.getFrames();
        syncGlobalFrames(updatedFrames);
        console.log('Frame created:', newFrame);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error creating frame:', err);
      setError('Failed to create frame');
      return false;
    }
  };

  const updateFrame = async (id: string, frameData: Partial<Frame>): Promise<boolean> => {
    try {
      const success = await dataService.updateFrame(id, frameData);
      if (success) {
        const updatedFrames = await dataService.getFrames();
        syncGlobalFrames(updatedFrames);
        console.log('Frame updated:', { id, ...frameData });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating frame:', err);
      setError('Failed to update frame');
      return false;
    }
  };

  const deleteFrame = async (id: string): Promise<boolean> => {
    try {
      const success = await dataService.deleteFrame(id);
      if (success) {
        const updatedFrames = await dataService.getFrames();
        syncGlobalFrames(updatedFrames);
        console.log('Frame deleted:', id);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting frame:', err);
      setError('Failed to delete frame');
      return false;
    }
  };

  const getFrameById = (id: string): Frame | undefined => {
    return frames.find(frame => frame.id === id);
  };

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
    createFrame,
    updateFrame,
    deleteFrame,
    getFrameById,
    filterFrames,
    searchFrames,
    getBrands,
    getCategories,
    getMaterials,
    getShapes,
    getColors,
    refreshFrames: loadFrames,
  };
};