import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, User, Clock, CheckCircle, XCircle, AlertCircle, Eye, Trash2, Filter, Search } from 'lucide-react';
import type { Inquiry, InquiryStats, InquiryFilters } from '../../../types/inquiry';
import { usePagination } from '../../../hooks/usePagination';
import { useSorting } from '../../../hooks/useSorting';
import type { SortOption } from '../../../hooks/useSorting';
import Pagination from '../../../components/admin/Pagination';
import SortableTableHeader from '../../../components/admin/SortableTableHeader';
import SortingControls from '../../../components/admin/SortingControls';
import CustomDropdown from '../../../components/CustomDropdown';
import InlineDropdown from '../../../components/InlineDropdown';

const InquiryManagement: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<InquiryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<InquiryFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  const statusColors = {
    'new': 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'contacted': 'bg-purple-100 text-purple-800',
    'quoted': 'bg-indigo-100 text-indigo-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };

  const priorityColors = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-blue-100 text-blue-800',
    'high': 'bg-red-100 text-red-800'
  };

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inquiries');
      if (!response.ok) throw new Error('Failed to fetch inquiries');
      const data = await response.json();
      setInquiries(data);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/inquiries/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchInquiries();
    fetchStats();
  }, []);

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update inquiry');
      
      await fetchInquiries();
      await fetchStats();
    } catch (err) {
      console.error('Error updating inquiry:', err);
      alert('Failed to update inquiry status');
    }
  };

  const handlePriorityChange = async (inquiryId: string, newPriority: string) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority: newPriority })
      });

      if (!response.ok) throw new Error('Failed to update inquiry');
      
      await fetchInquiries();
    } catch (err) {
      console.error('Error updating inquiry:', err);
      alert('Failed to update inquiry priority');
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete inquiry');
      
      await fetchInquiries();
      await fetchStats();
      setSelectedInquiry(null);
    } catch (err) {
      console.error('Error deleting inquiry:', err);
      alert('Failed to delete inquiry');
    }
  };

  // Define sorting options
  const sortOptions: SortOption<Inquiry>[] = [
    { 
      key: 'customerInfo' as keyof Inquiry, 
      label: 'Customer Name', 
      type: 'string',
      getValue: (inquiry: Inquiry) => inquiry.customerInfo.name 
    },
    { 
      key: 'customerInfo' as keyof Inquiry, 
      label: 'Customer Email', 
      type: 'string',
      getValue: (inquiry: Inquiry) => inquiry.customerInfo.email 
    },
    { 
      key: 'product' as keyof Inquiry, 
      label: 'Product Name', 
      type: 'string',
      getValue: (inquiry: Inquiry) => inquiry.product.name 
    },
    { 
      key: 'product' as keyof Inquiry, 
      label: 'Product Brand', 
      type: 'string',
      getValue: (inquiry: Inquiry) => inquiry.product.brand 
    },
    { 
      key: 'product' as keyof Inquiry, 
      label: 'Product Price', 
      type: 'number',
      getValue: (inquiry: Inquiry) => inquiry.product.price 
    },
    { 
      key: 'product' as keyof Inquiry, 
      label: 'Product Type', 
      type: 'string',
      getValue: (inquiry: Inquiry) => inquiry.product.type 
    },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'priority', label: 'Priority', type: 'string' },
    { key: 'createdAt', label: 'Created Date', type: 'date' },
    { key: 'updatedAt', label: 'Updated Date', type: 'date' },
    { 
      key: 'assignedTo', 
      label: 'Assigned To', 
      type: 'string',
      getValue: (inquiry: Inquiry) => inquiry.assignedTo || 'Unassigned'
    }
  ];

  const filteredInquiries = inquiries.filter(inquiry => {
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      const matchesSearch = 
        inquiry.customerInfo.name.toLowerCase().includes(search) ||
        inquiry.customerInfo.email.toLowerCase().includes(search) ||
        inquiry.product.name.toLowerCase().includes(search) ||
        inquiry.product.brand.toLowerCase().includes(search);
      if (!matchesSearch) return false;
    }
    
    if (filters.status && inquiry.status !== filters.status) return false;
    if (filters.priority && inquiry.priority !== filters.priority) return false;
    if (filters.productType && inquiry.product.type !== filters.productType) return false;
    
    return true;
  });

  // Apply sorting to filtered inquiries
  const sorting = useSorting(filteredInquiries, {
    initialSortKey: 'createdAt',
    initialSortOrder: 'desc',
    sortOptions
  });

  // Apply pagination to sorted inquiries
  const pagination = usePagination(sorting.sortedData, {
    initialPage: 1,
    initialItemsPerPage: 10
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inquiry Management</h1>
          <p className="text-gray-600">Manage customer inquiries and track their status</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">New</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.new}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.thisMonth}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-indigo-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">This Week</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.thisWeek}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name, email, or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          {/* Sort options */}
          <SortingControls
            sortConfig={sorting.sortConfig}
            sortOptions={sorting.sortOptions}
            onSortKeyChange={sorting.setSortKey}
            onSortOrderToggle={sorting.toggleSortOrder}
          />
          
          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <CustomDropdown
                value={filters.status || ''}
                onChange={(value) => setFilters({ ...filters, status: value === '' ? undefined : value as Inquiry['status'] })}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'new', label: 'New' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'contacted', label: 'Contacted' },
                  { value: 'quoted', label: 'Quoted' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' }
                ]}
                className="w-full focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <CustomDropdown
                value={filters.priority || ''}
                onChange={(value) => setFilters({ ...filters, priority: value === '' ? undefined : value as Inquiry['priority'] })}
                options={[
                  { value: '', label: 'All Priorities' },
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' }
                ]}
                className="w-full focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
              <CustomDropdown
                value={filters.productType || ''}
                onChange={(value) => setFilters({ ...filters, productType: value === '' ? undefined : value as 'frame' | 'sunglasses' })}
                options={[
                  { value: '', label: 'All Types' },
                  { value: 'frame', label: 'Frames' },
                  { value: 'sunglasses', label: 'Sunglasses' }
                ]}
                className="w-full focus:ring-primary-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-visible">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortableTableHeader
                  label="Customer"
                  sortKey="customerInfo"
                  sortConfig={sorting.sortConfig}
                  onSort={sorting.setSortKey}
                />
                <SortableTableHeader
                  label="Product"
                  sortKey="product"
                  sortConfig={sorting.sortConfig}
                  onSort={sorting.setSortKey}
                />
                <SortableTableHeader
                  label="Status"
                  sortKey="status"
                  sortConfig={sorting.sortConfig}
                  onSort={sorting.setSortKey}
                />
                <SortableTableHeader
                  label="Priority"
                  sortKey="priority"
                  sortConfig={sorting.sortConfig}
                  onSort={sorting.setSortKey}
                />
                <SortableTableHeader
                  label="Created"
                  sortKey="createdAt"
                  sortConfig={sorting.sortConfig}
                  onSort={sorting.setSortKey}
                />
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagination.paginatedData.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-8 w-8 text-gray-400 bg-gray-100 rounded-full p-1" />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{inquiry.customerInfo.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {inquiry.customerInfo.email}
                        </div>
                        {inquiry.customerInfo.phone && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {inquiry.customerInfo.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {inquiry.product.imageUrl && (
                        <img
                          src={inquiry.product.imageUrl}
                          alt={inquiry.product.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      )}
                      <div className={inquiry.product.imageUrl ? 'ml-3' : ''}>
                        <div className="text-sm font-medium text-gray-900">{inquiry.product.name}</div>
                        <div className="text-sm text-gray-500">{inquiry.product.brand}</div>
                        <div className="text-sm font-medium text-green-600">LKR {inquiry.product.price.toLocaleString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <InlineDropdown
                      value={inquiry.status}
                      onChange={(value) => handleStatusChange(inquiry.id, value as string)}
                      options={[
                        { value: 'new', label: 'New' },
                        { value: 'in-progress', label: 'In Progress' },
                        { value: 'contacted', label: 'Contacted' },
                        { value: 'quoted', label: 'Quoted' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'cancelled', label: 'Cancelled' }
                      ]}
                      buttonClassName={statusColors[inquiry.status]}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <InlineDropdown
                      value={inquiry.priority}
                      onChange={(value) => handlePriorityChange(inquiry.id, value as string)}
                      options={[
                        { value: 'low', label: 'Low' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'high', label: 'High' }
                      ]}
                      buttonClassName={priorityColors[inquiry.priority]}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(inquiry.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteInquiry(inquiry.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                        title="Delete"
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
          <div className="text-center py-12">
            <Mail className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No inquiries found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || Object.keys(filters).length > 0
                ? 'Try adjusting your search or filter criteria.'
                : 'New inquiries will appear here.'}
            </p>
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

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Inquiry Details</h3>
                  <p className="text-sm text-gray-500">ID: {selectedInquiry.id}</p>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Customer Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-sm text-gray-900">{selectedInquiry.customerInfo.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{selectedInquiry.customerInfo.email}</p>
                    </div>
                    {selectedInquiry.customerInfo.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-sm text-gray-900">{selectedInquiry.customerInfo.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Product Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    {selectedInquiry.product.imageUrl && (
                      <img
                        src={selectedInquiry.product.imageUrl}
                        alt={selectedInquiry.product.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{selectedInquiry.product.name}</h5>
                      <p className="text-sm text-gray-600">{selectedInquiry.product.brand}</p>
                      <p className="text-sm font-medium text-green-600">LKR {selectedInquiry.product.price.toLocaleString()}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${selectedInquiry.product.type === 'frame' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                        {selectedInquiry.product.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Customer Message</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>

              {/* Status and Priority */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Status & Priority</h4>
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${statusColors[selectedInquiry.status]}`}>
                      {selectedInquiry.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Priority</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${priorityColors[selectedInquiry.priority]}`}>
                      {selectedInquiry.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Timeline</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedInquiry.createdAt)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedInquiry.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryManagement;