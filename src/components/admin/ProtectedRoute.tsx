import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, checkAuthStatus } = useAdmin();
  const location = useLocation();

  if (!user || !checkAuthStatus()) {
    // Redirect to login page with return url
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;