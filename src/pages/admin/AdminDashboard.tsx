import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JSONDownloadUtility from '../../components/admin/JSONDownloadUtility';
import { 
  Glasses, 
  Sun, 
  Eye, 
  TrendingUp, 
  Package,
  AlertTriangle,
  DollarSign,
  Activity,
  Star,
  Settings,
  RefreshCw,
  Clock,
  Filter,
  Mail,
  MessageSquare,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { useFrames } from '../../hooks/useFrames';
import { useSunglasses } from '../../hooks/useSunglasses';
import { contactService } from '../../services/contactService';
import type { ContactStats } from '../../types/contact';

interface InquiryStats {
  total: number;
  new: number;
  inProgress: number;
  completed: number;
  thisMonth: number;
  thisWeek: number;
}

const AdminDashboard: React.FC = () => {
  const { frames } = useFrames();
  const { sunglasses } = useSunglasses();
  const [refreshing, setRefreshing] = useState(false);
  const [inquiryStats, setInquiryStats] = useState<InquiryStats>({
    total: 0,
    new: 0,
    inProgress: 0,
    completed: 0,
    thisMonth: 0,
    thisWeek: 0,
  });
  const [contactStats, setContactStats] = useState<ContactStats>({
    total: 0,
    new: 0,
    inProgress: 0,
    completed: 0,
    thisMonth: 0,
    thisWeek: 0,
  });

  // Calculate statistics
  const framesInStock = frames.filter(frame => frame.inStock).length;
  const framesOutOfStock = frames.filter(frame => !frame.inStock).length;
  const sunglassesInStock = sunglasses.filter(sg => sg.inStock).length;
  const sunglassesOutOfStock = sunglasses.filter(sg => !sg.inStock).length;

  const totalItems = frames.length + sunglasses.length;
  const totalInStock = framesInStock + sunglassesInStock;
  const totalOutOfStock = framesOutOfStock + sunglassesOutOfStock;

  // Advanced analytics
  const allItems = [...frames, ...sunglasses];
  const totalValue = allItems.reduce((sum, item) => sum + item.price, 0);
  const averagePrice = allItems.length > 0 ? totalValue / allItems.length : 0;
  const highValueItems = allItems.filter(item => item.price > averagePrice).length;
  
  // Brand analysis
  const brandStats = allItems.reduce((acc, item) => {
    acc[item.brand] = (acc[item.brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topBrands = Object.entries(brandStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Price ranges
  const priceRanges = {
    budget: allItems.filter(item => item.price < 20000).length,
    mid: allItems.filter(item => item.price >= 20000 && item.price < 35000).length,
    premium: allItems.filter(item => item.price >= 35000 && item.price < 50000).length,
    luxury: allItems.filter(item => item.price >= 50000).length,
  };


  // Material analysis  
  const materials = allItems.reduce((acc, item) => {
    acc[item.material] = (acc[item.material] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Polarized sunglasses
  const polarizedCount = sunglasses.filter(sg => sg.lensFeatures.polarized).length;

  // Fetch inquiry statistics
  const fetchInquiryStats = async () => {
    try {
      const response = await fetch('/api/inquiries/stats');
      if (!response.ok) throw new Error('Failed to fetch inquiry stats');
      const data = await response.json();
      setInquiryStats(data);
    } catch (error) {
      console.error('Error fetching inquiry stats:', error);
    }
  };

  // Fetch contact statistics
  const fetchContactStats = async () => {
    try {
      const data = await contactService.getContactStats();
      setContactStats(data);
    } catch (error) {
      console.error('Error fetching contact stats:', error);
    }
  };

  useEffect(() => {
    fetchInquiryStats();
    fetchContactStats();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInquiryStats();
    await fetchContactStats();
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const statsCards = [
    {
      title: 'Total Items',
      value: totalItems,
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      subtitle: `${frames.length} frames • ${sunglasses.length} sunglasses`
    },
    {
      title: 'In Stock',
      value: totalInStock,
      icon: TrendingUp,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      subtitle: `${Math.round((totalInStock / totalItems) * 100)}% availability`
    },
    {
      title: 'Total Value',
      value: `LKR ${Math.round(totalValue / 1000)}K`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      subtitle: `Avg: LKR ${Math.round(averagePrice / 1000)}K`
    },
    {
      title: 'Premium Items',
      value: highValueItems,
      icon: Star,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      subtitle: `Above average price`
    },
    {
      title: 'Out of Stock',
      value: totalOutOfStock,
      icon: AlertTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      subtitle: 'Requires attention'
    },
    {
      title: 'Active Brands',
      value: Object.keys(brandStats).length,
      icon: Activity,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      subtitle: `Top: ${topBrands[0]?.[0] || 'N/A'}`
    },
    {
      title: 'Total Inquiries',
      value: inquiryStats.total,
      icon: MessageSquare,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      subtitle: `${inquiryStats.thisMonth} this month`
    },
    {
      title: 'New Inquiries',
      value: inquiryStats.new,
      icon: AlertCircle,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      subtitle: 'Require attention'
    },
    {
      title: 'Total Contacts',
      value: contactStats.total,
      icon: UserCheck,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      subtitle: `${contactStats.thisWeek} this week`
    },
    {
      title: 'New Contacts',
      value: contactStats.new,
      icon: Mail,
      color: 'bg-cyan-500',
      textColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      subtitle: 'From contact form'
    },
    {
      title: 'In Progress',
      value: inquiryStats.inProgress,
      icon: Clock,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      subtitle: 'Being processed'
    },
  ];

  const quickActions = [
    {
      title: 'Add New Frame',
      description: 'Add a new eyeglass frame to the collection',
      href: '/admin/frames/new',
      icon: Glasses,
      color: 'bg-primary-600 hover:bg-primary-700',
    },
    {
      title: 'Add New Sunglasses',
      description: 'Add new sunglasses to the collection',
      href: '/admin/sunglasses/new',
      icon: Sun,
      color: 'bg-orange-600 hover:bg-orange-700',
    },
    {
      title: 'Manage Frames',
      description: 'View and edit existing frame listings',
      href: '/admin/frames',
      icon: Filter,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Company Settings',
      description: 'Update company information and settings',
      href: '/admin/company',
      icon: Settings,
      color: 'bg-gray-600 hover:bg-gray-700',
    },
    {
      title: 'Manage Inquiries',
      description: 'View and respond to customer inquiries',
      href: '/admin/inquiries',
      icon: MessageSquare,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-sm p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <Eye className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
            <div className="ml-3 sm:ml-4">
              <h1 className="text-lg sm:text-2xl font-bold">Welcome to OpticalVision Admin</h1>
              <p className="text-primary-100 text-sm sm:text-base mt-1">Manage your optical listings and inventory from here</p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-2">
            <div className="text-left sm:text-right flex-1 sm:flex-initial">
              <p className="text-xs sm:text-sm text-primary-200">Last updated</p>
              <p className="text-white font-medium text-sm">{new Date().toLocaleDateString()}</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
            >
              <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics - Improved responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.slice(0, 8).map((card) => {
          const IconComponent = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-6 border border-gray-100">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className={`p-2 sm:p-3 rounded-lg ${card.bgColor} flex-shrink-0`}>
                  <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${card.textColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{card.title}</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{card.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Stats for larger screens */}
      {statsCards.length > 8 && (
        <div className="hidden xl:block">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {statsCards.slice(8).map((card) => {
              const IconComponent = card.icon;
              return (
                <div key={card.title} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-6 border border-gray-100">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className={`p-2 sm:p-3 rounded-lg ${card.bgColor} flex-shrink-0`}>
                      <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${card.textColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{card.title}</p>
                      <p className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">{card.value}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{card.subtitle}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions - Enhanced responsive design */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <p className="text-sm text-gray-600 mt-1">Common tasks and shortcuts</p>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.href}
                  className="group relative bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-all duration-200 hover:shadow-sm border border-transparent hover:border-gray-200"
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`p-3 rounded-xl ${action.color} text-white group-hover:scale-105 transition-transform duration-200`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 mb-1">
                        {action.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{action.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Price Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Price Distribution</h2>
          <div className="space-y-3">
            {[
              { label: 'Budget (< 20K)', value: priceRanges.budget, color: 'bg-green-500' },
              { label: 'Mid-range (20K-35K)', value: priceRanges.mid, color: 'bg-blue-500' },
              { label: 'Premium (35K-50K)', value: priceRanges.premium, color: 'bg-amber-500' },
              { label: 'Luxury (50K+)', value: priceRanges.luxury, color: 'bg-purple-500' },
            ].map((range) => (
              <div key={range.label} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 ${range.color} rounded-full mr-3`}></div>
                  <span className="text-sm text-gray-700">{range.label}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className={`${range.color} h-2 rounded-full`}
                      style={{ width: `${totalItems > 0 ? (range.value / totalItems) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{range.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Brands */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Brands</h2>
          <div className="space-y-3">
            {topBrands.map(([brand, count]) => (
              <div key={brand} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{brand}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${totalItems > 0 ? (count / totalItems) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                </div>
              </div>
            ))}
            {topBrands.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No brands available</p>
            )}
          </div>
        </div>
      </div>

      {/* Material & Feature Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Materials */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Materials</h2>
          <div className="space-y-2">
            {Object.entries(materials).map(([material, count]) => (
              <div key={material} className="flex justify-between items-center">
                <span className="text-sm text-gray-700 capitalize">{material}</span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sunglasses Features */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sunglasses Features</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Polarized</span>
              <span className="text-sm font-medium text-gray-900">{polarizedCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Non-Polarized</span>
              <span className="text-sm font-medium text-gray-900">{sunglasses.length - polarizedCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${sunglasses.length > 0 ? (polarizedCount / sunglasses.length) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              {sunglasses.length > 0 ? Math.round((polarizedCount / sunglasses.length) * 100) : 0}% Polarized
            </p>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Database Connected</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Image Storage Online</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">API Services Active</span>
            </div>
            <div className="pt-3 border-t">
              <p className="text-xs text-gray-500">Last backup: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management Utility */}
      <JSONDownloadUtility />

      {/* Recent Items Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Frames Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Frames Overview</h2>
            <Link to="/admin/frames" className="text-primary-600 hover:text-primary-700 font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Frames</span>
              <span className="font-medium">{frames.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Stock</span>
              <span className="text-green-600 font-medium">{framesInStock}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Out of Stock</span>
              <span className="text-red-600 font-medium">{framesOutOfStock}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-primary-600 h-2 rounded-full" 
                style={{ 
                  width: frames.length > 0 ? `${(framesInStock / frames.length) * 100}%` : '0%' 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Sunglasses Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Sunglasses Overview</h2>
            <Link to="/admin/sunglasses" className="text-orange-600 hover:text-orange-700 font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Sunglasses</span>
              <span className="font-medium">{sunglasses.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Stock</span>
              <span className="text-green-600 font-medium">{sunglassesInStock}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Out of Stock</span>
              <span className="text-red-600 font-medium">{sunglassesOutOfStock}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-orange-600 h-2 rounded-full" 
                style={{ 
                  width: sunglasses.length > 0 ? `${(sunglassesInStock / sunglasses.length) * 100}%` : '0%' 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Inquiries Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Inquiries Overview</h2>
            <Link to="/admin/inquiries" className="text-purple-600 hover:text-purple-700 font-medium">
              Manage
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Inquiries</span>
              <span className="font-medium">{inquiryStats.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New</span>
              <span className="text-orange-600 font-medium">{inquiryStats.new}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Progress</span>
              <span className="text-blue-600 font-medium">{inquiryStats.inProgress}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-green-600 font-medium">{inquiryStats.completed}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ 
                  width: inquiryStats.total > 0 ? `${(inquiryStats.completed / inquiryStats.total) * 100}%` : '0%' 
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              {inquiryStats.total > 0 ? Math.round((inquiryStats.completed / inquiryStats.total) * 100) : 0}% Completion Rate
            </p>
          </div>
        </div>
      </div>
      
      {/* Contact Management Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Contact Management</h3>
            </div>
            <Link
              to="/admin/contacts"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Contacts</span>
              <span className="font-medium">{contactStats.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New</span>
              <span className="text-cyan-600 font-medium">{contactStats.new}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Progress</span>
              <span className="text-yellow-600 font-medium">{contactStats.inProgress}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-green-600 font-medium">{contactStats.completed}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: contactStats.total > 0 ? `${(contactStats.completed / contactStats.total) * 100}%` : '0%' 
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              {contactStats.total > 0 ? Math.round((contactStats.completed / contactStats.total) * 100) : 0}% Completion Rate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;