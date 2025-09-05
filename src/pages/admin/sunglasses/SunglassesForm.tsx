import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useSunglassesAdmin } from '../../../hooks/useSunglassesAdmin';
import ImageGalleryUpload from '../../../components/admin/ImageGalleryUpload';
import type { Sunglasses } from '../../../types/sunglasses';

const SunglassesForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { sunglasses, loading: sunglassesLoading, createSunglasses, updateSunglasses, getSunglassesById } = useSunglassesAdmin();
  
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(isEditing);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<Partial<Sunglasses>>({
    name: '',
    brand: '',
    category: 'fashion',
    material: 'plastic',
    shape: 'aviator',
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
    lensFeatures: {
      uvProtection: '100% UV400',
      polarized: false,
      tinted: true,
      mirrored: false,
    },
    imageUrl: '',
    images: [],
  });

  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    const loadSunglassesData = () => {
      if (isEditing && id && !sunglassesLoading) {
        const sg = getSunglassesById(id);
        
        if (sg) {
          const formDataToSet = {
            name: sg.name || '',
            brand: sg.brand || '',
            category: sg.category || 'fashion',
            material: sg.material || 'plastic',
            shape: sg.shape || 'aviator',
            color: sg.color || '',
            price: sg.price || 0,
            inStock: sg.inStock ?? true,
            description: sg.description || '',
            features: sg.features || [],
            gender: sg.gender || 'unisex',
            frameSize: sg.frameSize || {
              lens_width: 0,
              bridge_width: 0,
              temple_length: 0,
            },
            lensFeatures: sg.lensFeatures || {
              uvProtection: '100% UV400',
              polarized: false,
              tinted: true,
              mirrored: false,
            },
            imageUrl: sg.imageUrl || '',
            images: (sg.images && sg.images.length > 0) ? sg.images : (sg.imageUrl ? [sg.imageUrl] : []),
          };
          
          console.log('Loading sunglasses for edit:', sg);
          console.log('Setting form data with images:', formDataToSet.images);
          setFormData(formDataToSet);
        }
        setDataLoading(false);
      } else if (!isEditing) {
        setDataLoading(false);
      }
    };
    
    loadSunglassesData();
  }, [id, isEditing, sunglassesLoading, sunglasses.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Sunglasses] as any),
          [child]: type === 'number' ? Number(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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

    setLoading(true);
    
    try {
      let success = false;
      
      if (isEditing && id) {
        success = await updateSunglasses(id, formData);
      } else {
        success = await createSunglasses(formData as Omit<Sunglasses, 'id'>);
      }

      if (success) {
        navigate('/admin/sunglasses');
      }
    } catch (error) {
      console.error('Error saving sunglasses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while loading sunglasses data or specific sunglasses data for editing
  if (sunglassesLoading || dataLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">
            {sunglassesLoading ? 'Loading sunglasses...' : 'Loading sunglasses data...'}
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
          onClick={() => navigate('/admin/sunglasses')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Sunglasses' : 'Add New Sunglasses'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update sunglasses information' : 'Add new sunglasses to your collection'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
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
                placeholder="Enter sunglasses name"
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
                <option value="polarized">Polarized</option>
                <option value="fashion">Fashion</option>
                <option value="sport">Sport</option>
                <option value="luxury">Luxury</option>
                <option value="classic">Classic</option>
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
                <option value="oversized">Oversized</option>
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
              placeholder="Enter sunglasses description"
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

        {/* Lens Features */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lens Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UV Protection</label>
              <input
                type="text"
                name="lensFeatures.uvProtection"
                value={formData.lensFeatures?.uvProtection || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 100% UV400"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="lensFeatures.polarized"
                  checked={formData.lensFeatures?.polarized || false}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Polarized</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="lensFeatures.tinted"
                  checked={formData.lensFeatures?.tinted || false}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Tinted</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="lensFeatures.mirrored"
                  checked={formData.lensFeatures?.mirrored || false}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Mirrored</span>
              </label>
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
            folder="sunglasses"
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
            onClick={() => navigate('/admin/sunglasses')}
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
            {isEditing ? 'Update Sunglasses' : 'Create Sunglasses'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SunglassesForm;