export interface Frame {
  id: string;
  name: string;
  brand: string;
  category: 'prescription' | 'sunglasses' | 'reading' | 'computer';
  material: 'metal' | 'plastic' | 'titanium' | 'acetate' | 'mixed';
  shape: 'rectangle' | 'round' | 'square' | 'oval' | 'cat-eye' | 'aviator' | 'wayfarer';
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
  imageUrl?: string; // Keep for backward compatibility
  images?: string[]; // New multiple images array
}

export interface FrameFilters {
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
}