import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Sun
} from 'lucide-react';
import { useSunglassesAdmin } from '../../../hooks/useSunglassesAdmin';
import { usePagination } from '../../../hooks/usePagination';
import { useSorting } from '../../../hooks/useSorting';
import type { SortOption } from '../../../hooks/useSorting';
import Pagination from '../../../components/admin/Pagination';
import SortableTableHeader from '../../../components/admin/SortableTableHeader';
import SortingControls from '../../../components/admin/SortingControls';
import type { Sunglasses } from '../../../types/sunglasses';

const SunglassesList: React.FC = () => {
  const { 
    sunglasses, 
    loading, 
    error, 
    deleteSunglasses
  } = useSunglassesAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sunglassesToDelete, setSunglassesToDelete] = useState<Sunglasses | null>(null);

  // Define sorting options
  const sortOptions: SortOption<Sunglasses>[] = [
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'brand', label: 'Brand', type: 'string' },
    { key: 'price', label: 'Price', type: 'number' },
    { key: 'category', label: 'Category', type: 'string' },
    { key: 'material', label: 'Material', type: 'string' },
    { key: 'shape', label: 'Shape', type: 'string' },
    { key: 'color', label: 'Color', type: 'string' },
    { key: 'gender', label: 'Gender', type: 'string' },
    { 
      key: 'inStock', 
      label: 'Stock Status', 
      type: 'boolean',
      getValue: (sunglasses: Sunglasses) => sunglasses.inStock ? 'In Stock' : 'Out of Stock'
    },
    { 
      key: 'lensFeatures', 
      label: 'Polarized', 
      type: 'boolean',
      getValue: (sunglasses: Sunglasses) => sunglasses.lensFeatures.polarized ? 'Polarized' : 'Non-Polarized'
    }
  ];

  // Apply search first
  const searchedSunglasses = useMemo(() => {
    if (!searchQuery) return sunglasses;
    
    const searchTerm = searchQuery.toLowerCase();
    return sunglasses.filter(sg => 
      sg.name.toLowerCase().includes(searchTerm) ||
      sg.brand.toLowerCase().includes(searchTerm) ||
      sg.description.toLowerCase().includes(searchTerm) ||
      sg.color.toLowerCase().includes(searchTerm) ||
      sg.features.some(feature => feature.toLowerCase().includes(searchTerm))
    );
  }, [sunglasses, searchQuery]);

  // Apply sorting
  const sorting = useSorting(searchedSunglasses, {
    initialSortKey: 'name',
    initialSortOrder: 'asc',
    sortOptions
  });

  // Apply pagination to sorted sunglasses
  const pagination = usePagination(sorting.sortedData, {
    initialPage: 1,
    initialItemsPerPage: 10
  });


  const handleDeleteClick = (sunglasses: Sunglasses) => {
    setSunglassesToDelete(sunglasses);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (sunglassesToDelete) {
      const success = await deleteSunglasses(sunglassesToDelete.id);
      if (success) {
        setShowDeleteModal(false);
        setSunglassesToDelete(null);
      }
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading sunglasses...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sunglasses Management</h1>
          <p className="text-gray-600">Manage your sunglasses collection</p>
        </div>
        <Link
          to="/admin/sunglasses/new"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Sunglasses
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search sunglasses..."
            />
          </div>

          {/* Sort options */}
          <SortingControls
            sortConfig={sorting.sortConfig}
            sortOptions={sorting.sortOptions}
            onSortKeyChange={sorting.setSortKey}
            onSortOrderToggle={sorting.toggleSortOrder}
          />
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {pagination.startIndex + 1} to {pagination.endIndex} of {sorting.sortedData.length} sunglasses
          {sorting.sortedData.length !== sunglasses.length && ` (filtered from ${sunglasses.length} total)`}
        </div>
      </div>

      {/* Sunglasses Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortableTableHeader
                  label="Sunglasses"
                  sortKey="name"
                  sortConfig={sorting.sortConfig}
                  onSort={sorting.setSortKey}
                />
                <SortableTableHeader
                  label="Brand"
                  sortKey="brand"
                  sortConfig={sorting.sortConfig}
                  onSort={sorting.setSortKey}
                />
                <SortableTableHeader
                  label="Category"
                  sortKey="category"
                  sortConfig={sorting.sortConfig}
                  onSort={sorting.setSortKey}
                />
                <SortableTableHeader
                  label="Price"
                  sortKey="price"
                  sortConfig={sorting.sortConfig}
                  onSort={sorting.setSortKey}
                />
                <SortableTableHeader
                  label="Stock"
                  sortKey="inStock"
                  sortConfig={sorting.sortConfig}
                  onSort={sorting.setSortKey}
                />
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagination.paginatedData.map((sg) => (
                <tr key={sg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {(sg.images && sg.images.length > 0) ? (
                          <img 
                            className="h-10 w-10 rounded object-cover" 
                            src={sg.images[0]} 
                            alt={sg.name} 
                          />
                        ) : sg.imageUrl ? (
                          <img 
                            className="h-10 w-10 rounded object-cover" 
                            src={sg.imageUrl} 
                            alt={sg.name} 
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                            <Sun className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {sg.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {sg.material} • {sg.shape} {sg.lensFeatures.polarized && '• Polarized'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sg.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {sg.category.replace('-', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    LKR {sg.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      sg.inStock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {sg.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/admin/sunglasses/${sg.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                        title="Edit sunglasses"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(sg)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete sunglasses"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination.totalItems === 0 && (
          <div className="text-center py-8">
            <Sun className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sunglasses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search criteria.' : 'Get started by adding new sunglasses.'}
            </p>
            {!searchQuery && (
              <div className="mt-6">
                <Link
                  to="/admin/sunglasses/new"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Sunglasses
                </Link>
              </div>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {pagination.totalItems > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={pagination.setCurrentPage}
            onItemsPerPageChange={pagination.setItemsPerPage}
            showItemsPerPage={true}
            itemsPerPageOptions={[10, 25, 50, 100]}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && sunglassesToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-5 text-center">
                <h3 className="text-lg font-medium text-gray-900">Delete Sunglasses</h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete "{sunglassesToDelete.name}"? This action cannot be undone and will also remove associated images.
                  </p>
                </div>
                <div className="flex justify-center space-x-3 px-4 py-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SunglassesList;