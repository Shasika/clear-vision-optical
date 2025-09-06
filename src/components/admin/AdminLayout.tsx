import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import JSONUpdateNotification from './JSONUpdateNotification';
import { 
  Eye, 
  Menu, 
  X, 
  LayoutDashboard, 
  Glasses, 
  Sun, 
  LogOut, 
  Settings,
  User,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Frames', href: '/admin/frames', icon: Glasses },
    { name: 'Sunglasses', href: '/admin/sunglasses', icon: Sun },
    { name: 'Inquiries', href: '/admin/inquiries', icon: Mail },
    { name: 'Contacts', href: '/admin/contacts', icon: MessageSquare },
    { name: 'Company Settings', href: '/admin/company', icon: Settings },
  ];

  const isActive = (path: string) => {
    // Exact match for the main path
    if (location.pathname === path) {
      return true;
    }
    // Check if current path starts with the nav path (for sub-pages)
    // But exclude dashboard to avoid highlighting it for all admin pages
    if (path !== '/admin/dashboard' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 flex z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition duration-200 ease-in-out md:static md:inset-0 z-50`}>
        
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 bg-primary-600 text-white">
          <div className="flex items-center space-x-2">
            <Eye className="h-8 w-8" />
            <span className="text-lg font-bold">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 rounded-md hover:bg-primary-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-2 rounded-full">
              <User className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.username}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <IconComponent className={`mr-3 h-5 w-5 ${
                  isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center flex-1 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-2"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                {navigation.find(item => isActive(item.href))?.name || 'Admin Panel'}
              </h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap"
              >
                View Site
              </Link>
              <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
              <span className="hidden sm:inline text-sm text-gray-500 whitespace-nowrap">Welcome, {user?.username}</span>
              {/* Mobile user indicator */}
              <div className="sm:hidden bg-primary-100 p-1 rounded-full">
                <User className="h-4 w-4 text-primary-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
      
      {/* JSON Update Notifications */}
      <JSONUpdateNotification />
    </div>
  );
};

export default AdminLayout;