export interface AdminUser {
  username: string;
  isAuthenticated: boolean;
  loginTime?: number;
}

export interface AdminAuthState {
  user: AdminUser | null;
  isLoading: boolean;
  error: string | null;
}

export interface AdminContextType extends AdminAuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => boolean;
}

export type AdminAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AdminUser }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CHECK_AUTH'; payload: AdminUser | null };