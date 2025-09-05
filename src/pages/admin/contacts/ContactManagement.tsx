import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, User, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, Eye, Trash2, Filter, Search, Plus } from 'lucide-react';
import type { Contact, ContactStats, ContactFilters } from '../../../types/contact';
import { contactService } from '../../../services/contactService';
import { usePagination } from '../../../hooks/usePagination';
import { useSorting } from '../../../hooks/useSorting';
import type { SortOption } from '../../../hooks/useSorting';
import Pagination from '../../../components/admin/Pagination';
import SortableTableHeader from '../../../components/admin/SortableTableHeader';
import SortingControls from '../../../components/admin/SortingControls';

const ContactManagement: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ContactFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  const statusColors = {
    'new': 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'contacted': 'bg-purple-100 text-purple-800',
    'scheduled': 'bg-indigo-100 text-indigo-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };

  const priorityColors = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-blue-100 text-blue-800',
    'high': 'bg-red-100 text-red-800'
  };

  const sourceColors = {
    'contact-form': 'bg-green-100 text-green-800',
    'phone': 'bg-blue-100 text-blue-800',
    'walk-in': 'bg-purple-100 text-purple-800',
    'referral': 'bg-orange-100 text-orange-800'
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await contactService.getContacts();
      setContacts(data);
    } catch (err) {
      setError('Failed to load contacts');
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await contactService.getContactStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, []);

  const updateContactStatus = async (id: string, status: Contact['status']) => {
    try {
      await contactService.updateContact(id, { status });
      setContacts(prev => 
        prev.map(contact => 
          contact.id === id ? { ...contact, status, updatedAt: new Date().toISOString() } : contact
        )
      );
      fetchStats();
    } catch (err) {
      console.error('Error updating contact status:', err);
    }
  };

  const updateContactPriority = async (id: string, priority: Contact['priority']) => {
    try {
      await contactService.updateContact(id, { priority });
      setContacts(prev => 
        prev.map(contact => 
          contact.id === id ? { ...contact, priority, updatedAt: new Date().toISOString() } : contact
        )
      );
    } catch (err) {
      console.error('Error updating contact priority:', err);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      await contactService.deleteContact(id);
      setContacts(prev => prev.filter(contact => contact.id !== id));
      setSelectedContact(null);
      fetchStats();
    } catch (err) {
      console.error('Error deleting contact:', err);
    }
  };

  // Define sorting options
  const sortOptions: SortOption<Contact>[] = [
    { 
      key: 'customerInfo', 
      label: 'Customer Name', 
      type: 'string',
      getValue: (contact: Contact) => contact.customerInfo.name 
    },
    { 
      key: 'customerInfo', 
      label: 'Customer Email', 
      type: 'string',
      getValue: (contact: Contact) => contact.customerInfo.email 
    },
    { key: 'serviceInterest', label: 'Service Interest', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'priority', label: 'Priority', type: 'string' },
    { key: 'source', label: 'Source', type: 'string' },
    { key: 'createdAt', label: 'Created Date', type: 'date' },
    { key: 'updatedAt', label: 'Updated Date', type: 'date' },
    { 
      key: 'assignedTo', 
      label: 'Assigned To', 
      type: 'string',
      getValue: (contact: Contact) => contact.assignedTo || 'Unassigned'
    }
  ];

  const filteredContacts = contacts.filter(contact => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!contact.customerInfo.name.toLowerCase().includes(query) &&
          !contact.customerInfo.email.toLowerCase().includes(query) &&
          !contact.serviceInterest.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    if (filters.status && contact.status !== filters.status) return false;
    if (filters.priority && contact.priority !== filters.priority) return false;
    if (filters.serviceInterest && contact.serviceInterest !== filters.serviceInterest) return false;
    if (filters.source && contact.source !== filters.source) return false;
    
    return true;
  });

  // Apply sorting to filtered contacts
  const sorting = useSorting(filteredContacts, {
    initialSortKey: 'createdAt',
    initialSortOrder: 'desc',
    sortOptions
  });

  // Apply pagination to sorted contacts
  const pagination = usePagination(sorting.sortedData, {
    initialPage: 1,
    initialItemsPerPage: 10
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'contacted': return <Phone className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading contacts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
          <p className="text-gray-600">Manage customer contacts and inquiries</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Contacts</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-600">{stats.new}</div>
            <div className="text-sm text-gray-600">New</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
            <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500">
            <div className="text-2xl font-bold text-indigo-600">{stats.thisWeek}</div>
            <div className="text-sm text-gray-600">This Week</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-pink-500">
            <div className="text-2xl font-bold text-pink-600">{stats.thisMonth}</div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Sort options */}
          <SortingControls
            sortConfig={sorting.sortConfig}
            sortOptions={sorting.sortOptions}
            onSortKeyChange={sorting.setSortKey}
            onSortOrderToggle={sorting.toggleSortOrder}
          />
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={filters.status || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || undefined }))}
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="contacted">Contacted</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={filters.priority || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value || undefined }))}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={filters.source || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value || undefined }))}
            >
              <option value="">All Sources</option>
              <option value="contact-form">Contact Form</option>
              <option value="phone">Phone</option>
              <option value="walk-in">Walk-in</option>
              <option value="referral">Referral</option>
            </select>

            <button
              onClick={() => setFilters({})}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  label="Service Interest"
                  sortKey="serviceInterest"
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
                  label="Source"
                  sortKey="source"
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
              {pagination.paginatedData.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{contact.customerInfo.name}</div>
                        <div className="text-sm text-gray-500">{contact.customerInfo.email}</div>
                        {contact.customerInfo.phone && (
                          <div className="text-sm text-gray-500">{contact.customerInfo.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contact.serviceInterest}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 ${statusColors[contact.status]}`}
                      value={contact.status}
                      onChange={(e) => updateContactStatus(contact.id, e.target.value as Contact['status'])}
                    >
                      <option value="new">New</option>
                      <option value="in-progress">In Progress</option>
                      <option value="contacted">Contacted</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 ${priorityColors[contact.priority]}`}
                      value={contact.priority}
                      onChange={(e) => updateContactPriority(contact.id, e.target.value as Contact['priority'])}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sourceColors[contact.source]}`}>
                      {contact.source.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedContact(contact)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
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

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">Contact Details</h3>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Customer Name</label>
                  <p className="text-sm text-gray-900">{selectedContact.customerInfo.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedContact.customerInfo.email}</p>
                </div>
                {selectedContact.customerInfo.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{selectedContact.customerInfo.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700">Service Interest</label>
                  <p className="text-sm text-gray-900">{selectedContact.serviceInterest}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedContact.status]}`}>
                    {getStatusIcon(selectedContact.status)}
                    <span className="ml-1">{selectedContact.status}</span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[selectedContact.priority]}`}>
                    {selectedContact.priority}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Source</label>
                  <p className="text-sm text-gray-900">{selectedContact.source.replace('-', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Created</label>
                  <p className="text-sm text-gray-900">{new Date(selectedContact.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Message</label>
                <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
                  {selectedContact.message}
                </p>
              </div>
              
              {selectedContact.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes</label>
                  <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
                    {selectedContact.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManagement;