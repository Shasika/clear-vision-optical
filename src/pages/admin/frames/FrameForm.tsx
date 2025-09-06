import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useFramesAdmin } from '../../../hooks/useFramesAdmin';
import ImageGalleryUpload from '../../../components/admin/ImageGalleryUpload';
import type { Frame } from '../../../types/frames';

const FrameForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { frames, loading: framesLoading, createFrame, updateFrame, getFrameById } = useFramesAdmin();
  
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(isEditing);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<Partial<Frame>>({
    name: '',
    brand: '',
    category: 'prescription',
    material: 'metal',
    shape: 'rectangle',
    color: '',
    price: 0,
    inStock: true,
    description: '',
    features: [],
    gender: 'unisex',
    frameSize: {
      lens_width: 0,
      bridge_width: 0,
      temple_length: 0,
    },
    imageUrl: '',
    images: [],
  });

  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    const loadFrameData = () => {
      if (isEditing && id && !framesLoading) {
        const frame = getFrameById(id);
        
        if (frame) {
          const formDataToSet = {
            name: frame.name || '',
            brand: frame.brand || '',
            category: frame.category || 'prescription',
            material: frame.material || 'metal',
            shape: frame.shape || 'rectangle',
            color: frame.color || '',
            price: frame.price || 0,
            inStock: frame.inStock ?? true,
            description: frame.description || '',
            features: frame.features || [],
            gender: frame.gender || 'unisex',
            frameSize: frame.frameSize || {
              lens_width: 0,
              bridge_width: 0,
              temple_length: 0,
            },
            imageUrl: frame.imageUrl || '',
            images: (frame.images && frame.images.length > 0) ? frame.images : (frame.imageUrl ? [frame.imageUrl] : []),
          };
          
          console.log('Loading frame for edit:', frame);
          console.log('Setting form data with images:', formDataToSet.images);
          setFormData(formDataToSet);
        }
        setDataLoading(false);
      } else if (!isEditing) {
        setDataLoading(false);
      }
    };
    
    loadFrameData();
  }, [id, isEditing, framesLoading, frames.length, getFrameById]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Frame] as Record<string, unknown>),
          [child]: type === 'number' ? Number(value) : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features?.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter(feature => feature !== featureToRemove) || [],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.brand?.trim()) newErrors.brand = 'Brand is required';
    if (!formData.color?.trim()) newErrors.color = 'Color is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.frameSize?.lens_width) newErrors['frameSize.lens_width'] = 'Lens width is required';
    if (!formData.frameSize?.bridge_width) newErrors['frameSize.bridge_width'] = 'Bridge width is required';
    if (!formData.frameSize?.temple_length) newErrors['frameSize.temple_length'] = 'Temple length is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    console.log('Form submission started:', {
      isEditing,
      formDataImages: formData.images?.length || 0,
      formDataImageUrl: formData.imageUrl,
      allFormData: formData
    });

    setLoading(true);
    
    try {
      let success = false;
      
      if (isEditing && id) {
        console.log('Updating frame with data:', {
          id,
          imagesCount: formData.images?.length || 0,
          images: formData.images
        });
        success = await updateFrame(id, formData);
      } else {
        console.log('Creating new frame with data:', {
          imagesCount: formData.images?.length || 0,
          images: formData.images
        });
        success = await createFrame(formData as Omit<Frame, 'id'>);
      }

      console.log('Form submission result:', { success });

      if (success) {
        navigate('/admin/frames');
      }
    } catch (error) {
      console.error('Error saving frame:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while loading frames data or specific frame data for editing
  if (framesLoading || dataLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">
            {framesLoading ? 'Loading frames...' : 'Loading frame data...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin/frames')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Frame' : 'Add New Frame'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update frame information' : 'Add a new frame to your collection'}
          </p>
        </div>
      </div>


      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibent text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                className={`w-full border rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter frame name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand || ''}
                onChange={handleInputChange}
                className={`w-full border rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.brand ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter brand name"
              />
              {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="prescription">Prescription</option>
                <option value="sunglasses">Sunglasses</option>
                <option value="reading">Reading</option>
                <option value="computer">Computer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Material *</label>
              <select
                name="material"
                value={formData.material || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="metal">Metal</option>
                <option value="plastic">Plastic</option>
                <option value="titanium">Titanium</option>
                <option value="acetate">Acetate</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shape *</label>
              <select
                name="shape"
                value={formData.shape || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="rectangle">Rectangle</option>
                <option value="round">Round</option>
                <option value="square">Square</option>
                <option value="oval">Oval</option>
                <option value="cat-eye">Cat-eye</option>
                <option value="aviator">Aviator</option>
                <option value="wayfarer">Wayfarer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color *</label>
              <input
                type="text"
                name="color"
                value={formData.color || ''}
                onChange={handleInputChange}
                className={`w-full border rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.color ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter color"
              />
              {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select
                name="gender"
                value={formData.gender || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (LKR) *</label>
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleInputChange}
                className={`w-full border rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter price"
                min="0"
                step="0.01"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={3}
              className={`w-full border rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter frame description"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock || false}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">In Stock</span>
            </label>
          </div>
        </div>

        {/* Frame Size */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Frame Size</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lens Width (mm) *</label>
              <input
                type="number"
                name="frameSize.lens_width"
                value={formData.frameSize?.lens_width || ''}
                onChange={handleInputChange}
                className={`w-full border rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors['frameSize.lens_width'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter lens width"
                min="0"
              />
              {errors['frameSize.lens_width'] && <p className="text-red-500 text-xs mt-1">{errors['frameSize.lens_width']}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bridge Width (mm) *</label>
              <input
                type="number"
                name="frameSize.bridge_width"
                value={formData.frameSize?.bridge_width || ''}
                onChange={handleInputChange}
                className={`w-full border rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors['frameSize.bridge_width'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter bridge width"
                min="0"
              />
              {errors['frameSize.bridge_width'] && <p className="text-red-500 text-xs mt-1">{errors['frameSize.bridge_width']}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temple Length (mm) *</label>
              <input
                type="number"
                name="frameSize.temple_length"
                value={formData.frameSize?.temple_length || ''}
                onChange={handleInputChange}
                className={`w-full border rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors['frameSize.temple_length'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter temple length"
                min="0"
              />
              {errors['frameSize.temple_length'] && <p className="text-red-500 text-xs mt-1">{errors['frameSize.temple_length']}</p>}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Add a feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.features?.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Images Gallery */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
          
          <ImageGalleryUpload
            images={formData.images || []}
            folder="frames"
            maxImages={5}
            onImagesChange={(images) => {
              setFormData(prev => ({ 
                ...prev, 
                images,
                // Set first image as main imageUrl for backward compatibility
                imageUrl: images.length > 0 ? images[0] : ''
              }));
            }}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pb-6">
          <button
            type="button"
            onClick={() => navigate('/admin/frames')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEditing ? 'Update Frame' : 'Create Frame'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FrameForm;