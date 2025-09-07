import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useFramesAdmin } from '../../../hooks/useFramesAdmin';
import ImageGalleryUpload from '../../../components/admin/ImageGalleryUpload';
import { dataService } from '../../../services/dataService';
import type { Frame } from '../../../types/frames';

const FrameForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { frames, loading: framesLoading, createFrame, updateFrame, getFrameById } = useFramesAdmin();
  
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(isEditing);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  useEffect(() => {
    const loadFrameData = () => {
      if (isEditing && id && !framesLoading && frames.length > 0) {
        const frame = frames.find(f => f.id === id);
        
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
  }, [id, isEditing, framesLoading, frames]);

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

    setLoading(true);
    
    try {
      // First delete marked images from server
      if (imagesToDelete.length > 0) {
        console.log('🗑️ Deleting images from server:', imagesToDelete);
        for (const imageToDelete of imagesToDelete) {
          try {
            await dataService.deleteImage(imageToDelete);
            console.log('✅ Image deleted from server:', imageToDelete);
          } catch (error) {
            console.error('❌ Failed to delete image from server:', error);
            // Continue with other deletions even if one fails
          }
        }
      }

      let success = false;
      
      if (isEditing && id) {
        success = await updateFrame(id, formData);
      } else {
        success = await createFrame(formData as Omit<Frame, 'id'>);
      }

      if (success) {
        if (isEditing) {
          // Stay on edit page with success message
          setSuccess(true);
          setSuccessMessage('Frame updated successfully!');
          setTimeout(() => setSuccess(false), 5000);
        } else {
          // Redirect to listing page for new creation
          setSuccessMessage('New frame created successfully!');
          navigate('/admin/frames');
        }
      }
    } catch (error) {
      console.error('Error saving frame:', error);
      setErrors({ form: 'Failed to save frame. Please try again.' });
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

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Error */}
      {errors.form && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{errors.form}</p>
            </div>
          </div>
        </div>
      )}

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
            onImagesChange={(images, deletedImages) => {
              setFormData(prev => ({ 
                ...prev, 
                images,
                // Set first image as main imageUrl for backward compatibility
                imageUrl: images.length > 0 ? images[0] : ''
              }));
              // Track images to delete
              if (deletedImages) {
                setImagesToDelete(deletedImages);
              }
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