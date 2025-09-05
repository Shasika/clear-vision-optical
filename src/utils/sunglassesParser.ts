import type { Sunglasses } from '../types/sunglasses';

export const parseSunglassesData = (textData: string): Sunglasses[] => {
  // Parse sunglasses data from text format
  // This is a mock implementation - in real scenario this would parse actual data
  const mockSunglasses: Sunglasses[] = [
    {
      id: 'sg-001',
      name: 'Ray-Ban Classic Aviator',
      brand: 'Ray-Ban',
      category: 'classic',
      material: 'metal',
      shape: 'aviator',
      color: 'Gold/Green',
      price: 18500,
      inStock: true,
      description: 'The original aviator sunglasses with green classic lenses',
      features: ['Classic Design', 'Premium Quality', 'Scratch Resistant'],
      gender: 'unisex',
      frameSize: {
        lens_width: 58,
        bridge_width: 14,
        temple_length: 135
      },
      lensFeatures: {
        uvProtection: '100% UV400',
        polarized: false,
        tinted: true,
        mirrored: false
      }
    },
    {
      id: 'sg-002',
      name: 'Oakley Holbrook Polarized',
      brand: 'Oakley',
      category: 'sport',
      material: 'plastic',
      shape: 'square',
      color: 'Matte Black/Grey',
      price: 22000,
      inStock: true,
      description: 'Sport performance sunglasses with polarized lenses',
      features: ['Polarized', 'Impact Resistant', 'Sport Design'],
      gender: 'men',
      frameSize: {
        lens_width: 56,
        bridge_width: 18,
        temple_length: 137
      },
      lensFeatures: {
        uvProtection: '100% UV400',
        polarized: true,
        tinted: true,
        mirrored: false
      }
    },
    {
      id: 'sg-003',
      name: 'Prada Cat-Eye Designer',
      brand: 'Prada',
      category: 'luxury',
      material: 'acetate',
      shape: 'cat-eye',
      color: 'Tortoise/Brown',
      price: 45000,
      inStock: false,
      description: 'Luxury designer cat-eye sunglasses with gradient lenses',
      features: ['Designer', 'Gradient Lens', 'Italian Crafted'],
      gender: 'women',
      frameSize: {
        lens_width: 54,
        bridge_width: 16,
        temple_length: 140
      },
      lensFeatures: {
        uvProtection: '100% UV400',
        polarized: false,
        tinted: true,
        mirrored: false
      }
    },
    {
      id: 'sg-004',
      name: 'Maui Jim Peahi Polarized',
      brand: 'Maui Jim',
      category: 'polarized',
      material: 'titanium',
      shape: 'rectangle',
      color: 'Silver/Blue',
      price: 35000,
      inStock: true,
      description: 'Premium polarized sunglasses with color-enhancing technology',
      features: ['PolarizedPlus2', 'Color Enhancement', 'Lightweight'],
      gender: 'men',
      frameSize: {
        lens_width: 61,
        bridge_width: 15,
        temple_length: 125
      },
      lensFeatures: {
        uvProtection: '100% UV400',
        polarized: true,
        tinted: true,
        mirrored: true
      }
    },
    {
      id: 'sg-005',
      name: 'Gucci Oversized Fashion',
      brand: 'Gucci',
      category: 'fashion',
      material: 'acetate',
      shape: 'oversized',
      color: 'Black/Gold',
      price: 52000,
      inStock: true,
      description: 'Fashion-forward oversized sunglasses with gold accents',
      features: ['Oversized', 'Gold Details', 'Fashion Statement'],
      gender: 'women',
      frameSize: {
        lens_width: 60,
        bridge_width: 14,
        temple_length: 145
      },
      lensFeatures: {
        uvProtection: '100% UV400',
        polarized: false,
        tinted: true,
        mirrored: false
      }
    },
    {
      id: 'sg-006',
      name: 'Persol Steve McQueen',
      brand: 'Persol',
      category: 'classic',
      material: 'acetate',
      shape: 'square',
      color: 'Havana/Green',
      price: 38000,
      inStock: true,
      description: 'Classic Italian craftsmanship inspired by Steve McQueen',
      features: ['Handcrafted', 'Crystal Lenses', 'Iconic Design'],
      gender: 'men',
      frameSize: {
        lens_width: 54,
        bridge_width: 18,
        temple_length: 145
      },
      lensFeatures: {
        uvProtection: '100% UV400',
        polarized: false,
        tinted: true,
        mirrored: false
      }
    }
  ];

  return mockSunglasses;
};