import type { Frame } from '../types/frames';

export const parseFrameData = (textData: string): Frame[] => {
  const lines = textData.trim().split('\n');
  const frames: Frame[] = [];

  for (const line of lines) {
    if (line.trim() === '') continue;
    
    const fields = line.split('|');
    const frameData: any = {};
    
    for (const field of fields) {
      const [key, value] = field.split(':');
      if (key && value) {
        frameData[key] = value;
      }
    }

    // Parse the frame object
    if (frameData.id) {
      const frame: Frame = {
        id: frameData.id,
        name: frameData.name || '',
        brand: frameData.brand || '',
        category: frameData.category as Frame['category'] || 'prescription',
        material: frameData.material as Frame['material'] || 'plastic',
        shape: frameData.shape as Frame['shape'] || 'rectangle',
        color: frameData.color || '',
        price: parseFloat(frameData.price) || 0,
        inStock: frameData.inStock === 'true',
        description: frameData.description || '',
        features: frameData.features ? frameData.features.split(',') : [],
        gender: frameData.gender as Frame['gender'] || 'unisex',
        frameSize: {
          lens_width: parseFloat(frameData.lens_width) || 0,
          bridge_width: parseFloat(frameData.bridge_width) || 0,
          temple_length: parseFloat(frameData.temple_length) || 0
        }
      };
      
      frames.push(frame);
    }
  }

  return frames;
};

export const formatFrameForStorage = (frame: Frame): string => {
  const fields = [
    `id:${frame.id}`,
    `name:${frame.name}`,
    `brand:${frame.brand}`,
    `category:${frame.category}`,
    `material:${frame.material}`,
    `shape:${frame.shape}`,
    `color:${frame.color}`,
    `price:${frame.price}`,
    `inStock:${frame.inStock}`,
    `description:${frame.description}`,
    `features:${frame.features.join(',')}`,
    `gender:${frame.gender}`,
    `lens_width:${frame.frameSize.lens_width}`,
    `bridge_width:${frame.frameSize.bridge_width}`,
    `temple_length:${frame.frameSize.temple_length}`
  ];
  
  return fields.join('|');
};