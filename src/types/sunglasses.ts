export interface Sunglasses {
  id: string;
  name: string;
  brand: string;
  category: 'polarized' | 'fashion' | 'sport' | 'luxury' | 'classic';
  material: 'metal' | 'plastic' | 'titanium' | 'acetate' | 'mixed';
  shape: 'rectangle' | 'round' | 'square' | 'oval' | 'cat-eye' | 'aviator' | 'wayfarer' | 'oversized';
  color: string;
  price: number;
  inStock: boolean;
  description: string;
  features: string[];
  gender: 'men' | 'women' | 'unisex';
  frameSize: {
    lens_width: number;
    bridge_width: number;
    temple_length: number;
  };
  lensFeatures: {
    uvProtection: string; // e.g., "100% UV400"
    polarized: boolean;
    tinted: boolean;
    mirrored: boolean;
  };
  imageUrl?: string; // Keep for backward compatibility
  images?: string[]; // New multiple images array
}

export interface SunglassesFilters {
  brand?: string;
  category?: string;
  material?: string;
  shape?: string;
  color?: string;
  gender?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
  polarized?: boolean;
  uvProtection?: boolean;
}