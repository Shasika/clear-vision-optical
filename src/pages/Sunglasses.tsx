import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, SlidersHorizontal, Sun } from 'lucide-react';
import type { SunglassesFilters, Sunglasses as SunglassesType } from '../types/sunglasses';
import { useSunglasses } from '../hooks/useSunglasses';
import SunglassesCard from '../components/SunglassesCard';
import Pagination from '../components/Pagination';
import InquiryModal from '../components/InquiryModal';

const Sunglasses: React.FC = () => {
  const navigate = useNavigate();
  const { sunglasses, loading, error, getBrands, getCategories, getMaterials, getShapes } = useSunglasses();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SunglassesFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'brand'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedSunglasses, setSelectedSunglasses] = useState<SunglassesType | null>(null);
  const [showInquiry, setShowInquiry] = useState(false);

  // Get filter options
  const brands = getBrands();
  const categories = getCategories();
  const materials = getMaterials();
  const shapes = getShapes();

  // Apply filters, search, and sorting
  const allFilteredSunglasses = useMemo(() => {
    let result = sunglasses;
    
    // Apply search
    if (searchQuery) {
      result = result.filter(sunglass => 
        sunglass.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sunglass.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sunglass.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sunglass.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sunglass.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply filters
    if (filters.brand) {
      result = result.filter(sunglass => sunglass.brand.toLowerCase() === filters.brand!.toLowerCase());
    }
    if (filters.category) {
      result = result.filter(sunglass => sunglass.category === filters.category);
    }
    if (filters.material) {
      result = result.filter(sunglass => sunglass.material === filters.material);
    }
    if (filters.shape) {
      result = result.filter(sunglass => sunglass.shape === filters.shape);
    }
    if (filters.gender) {
      result = result.filter(sunglass => sunglass.gender === filters.gender || sunglass.gender === 'unisex');
    }
    if (filters.priceRange) {
      result = result.filter(sunglass => 
        sunglass.price >= filters.priceRange!.min && sunglass.price <= filters.priceRange!.max
      );
    }
    if (filters.inStock !== undefined) {
      result = result.filter(sunglass => sunglass.inStock === filters.inStock);
    }
    if (filters.polarized !== undefined) {
      result = result.filter(sunglass => sunglass.lensFeatures.polarized === filters.polarized);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'brand':
          return a.brand.localeCompare(b.brand);
        default:
          return 0;
      }
    });
    
    return result;
  }, [sunglasses, searchQuery, filters, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(allFilteredSunglasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSunglasses = allFilteredSunglasses.slice(startIndex, endIndex);

  const handleFilterChange = (key: keyof SunglassesFilters, value: string | number | boolean | { min: number; max: number } | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Reset page when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof SunglassesFilters];
    if (key === 'priceRange') {
      return value && typeof value === 'object' && ('min' in value || 'max' in value);
    }
    return value !== undefined && value !== '' && value !== null;
  }).length + (searchQuery ? 1 : 0);

  const handleViewDetails = (sunglass: SunglassesType) => {
    navigate(`/sunglasses/${sunglass.id}`);
  };

  const handleInquiry = (sunglass: SunglassesType) => {
    setSelectedSunglasses(sunglass);
    setShowInquiry(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-lg text-gray-600">Loading sunglasses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Our Sunglasses Collection</h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Protect your eyes in style with our premium collection of sunglasses from top brands
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="Search sunglasses by name, brand, or features..."
            />
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  showFilters
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-3 py-1 text-sm text-orange-600 hover:text-orange-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear all
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {allFilteredSunglasses.length} sunglass{allFilteredSunglasses.length !== 1 ? 'es' : ''} found
              </span>
              
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500"
              >
                <option value={8}>8 per page</option>
                <option value={12}>12 per page</option>
                <option value={16}>16 per page</option>
                <option value={24}>24 per page</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price-low' | 'price-high' | 'brand')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="brand">Sort by Brand</option>
              </select>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 sm:p-6 bg-white rounded-lg shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <select
                    value={filters.brand || ''}
                    onChange={(e) => handleFilterChange('brand', e.target.value || undefined)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">All Brands</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category} className="capitalize">
                        {category.replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Material Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                  <select
                    value={filters.material || ''}
                    onChange={(e) => handleFilterChange('material', e.target.value || undefined)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">All Materials</option>
                    {materials.map(material => (
                      <option key={material} value={material} className="capitalize">{material}</option>
                    ))}
                  </select>
                </div>

                {/* Shape Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
                  <select
                    value={filters.shape || ''}
                    onChange={(e) => handleFilterChange('shape', e.target.value || undefined)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">All Shapes</option>
                    {shapes.map(shape => (
                      <option key={shape} value={shape} className="capitalize">
                        {shape.replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={filters.gender || ''}
                    onChange={(e) => handleFilterChange('gender', e.target.value || undefined)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">All Genders</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                {/* Polarized Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lens Type</label>
                  <select
                    value={filters.polarized === undefined ? '' : filters.polarized ? 'true' : 'false'}
                    onChange={(e) => handleFilterChange('polarized', e.target.value === '' ? undefined : e.target.value === 'true')}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">All Types</option>
                    <option value="true">Polarized</option>
                    <option value="false">Non-Polarized</option>
                  </select>
                </div>

                {/* Stock Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select
                    value={filters.inStock === undefined ? '' : filters.inStock ? 'true' : 'false'}
                    onChange={(e) => handleFilterChange('inStock', e.target.value === '' ? undefined : e.target.value === 'true')}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">All Items</option>
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>
              </div>
              
              {/* Price Range Filter - Full width row */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-5 mt-4 pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">Price Range (LKR)</label>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Min price"
                      value={filters.priceRange?.min || ''}
                      onChange={(e) => {
                        const min = e.target.value ? Number(e.target.value) : undefined;
                        handleFilterChange('priceRange', {
                          min,
                          max: filters.priceRange?.max || 100000
                        });
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Max price"
                      value={filters.priceRange?.max || ''}
                      onChange={(e) => {
                        const max = e.target.value ? Number(e.target.value) : undefined;
                        handleFilterChange('priceRange', {
                          min: filters.priceRange?.min || 0,
                          max
                        });
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                  <button
                    onClick={() => handleFilterChange('priceRange', undefined)}
                    className="px-3 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
                    title="Clear price filter"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {/* Quick price ranges */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    { label: 'Under 20K', min: 0, max: 20000 },
                    { label: '20K - 35K', min: 20000, max: 35000 },
                    { label: '35K - 50K', min: 35000, max: 50000 },
                    { label: 'Above 50K', min: 50000, max: 200000 }
                  ].map((range) => (
                    <button
                      key={range.label}
                      onClick={() => handleFilterChange('priceRange', { min: range.min, max: range.max })}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-orange-100 hover:text-orange-600 rounded-full transition-colors"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Grid */}
        {allFilteredSunglasses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {currentSunglasses.map((sunglass) => (
                <SunglassesCard
                  key={sunglass.id}
                  sunglasses={sunglass}
                  onViewDetails={handleViewDetails}
                  onAddToCart={handleInquiry}
                />
              ))}
            </div>
            
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={allFilteredSunglasses.length}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <Sun className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sunglasses found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      {showInquiry && selectedSunglasses && (
        <InquiryModal
          product={selectedSunglasses}
          productType="sunglasses"
          onClose={() => {
            setShowInquiry(false);
            setSelectedSunglasses(null);
          }}
        />
      )}
    </div>
  );
};

export default Sunglasses;