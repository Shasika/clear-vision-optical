import React, { useReducer, useEffect } from 'react';
import { ADMIN_CONFIG } from '../config/admin';
import type { AdminUser, AdminAuthState, AdminContextType, AdminAction } from '../types/admin';
import { AdminContext } from './AdminContextDefinition';

const adminReducer = (state: AdminAuthState, action: AdminAction): AdminAuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, isLoading: false, user: action.payload, error: null };
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false, user: null, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, error: null };
    case 'CHECK_AUTH':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const initialState: AdminAuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  useEffect(() => {
    // Check if user is already logged in on app start
    const savedAuth = localStorage.getItem('admin_auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        const now = Date.now();
        
        // Check if session is still valid
        if (authData.loginTime && (now - authData.loginTime) < ADMIN_CONFIG.sessionTimeout) {
          dispatch({ type: 'CHECK_AUTH', payload: authData });
        } else {
          // Session expired, clear storage
          localStorage.removeItem('admin_auth');
          dispatch({ type: 'CHECK_AUTH', payload: null });
        }
      } catch {
        localStorage.removeItem('admin_auth');
        dispatch({ type: 'CHECK_AUTH', payload: null });
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === ADMIN_CONFIG.username && password === ADMIN_CONFIG.password) {
      const user: AdminUser = {
        username,
        isAuthenticated: true,
        loginTime: Date.now(),
      };

      // Save to localStorage
      localStorage.setItem('admin_auth', JSON.stringify(user));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return true;
    } else {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid username or password' });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_auth');
    dispatch({ type: 'LOGOUT' });
  };

  const checkAuthStatus = (): boolean => {
    if (!state.user) return false;
    
    const now = Date.now();
    if (state.user.loginTime && (now - state.user.loginTime) > ADMIN_CONFIG.sessionTimeout) {
      logout();
      return false;
    }
    
    return state.user.isAuthenticated;
  };

  const value: AdminContextType = {
    ...state,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

