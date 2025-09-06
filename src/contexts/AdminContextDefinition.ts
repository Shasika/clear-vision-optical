import { createContext } from 'react';
import type { AdminContextType } from '../types/admin';

export const AdminContext = createContext<AdminContextType | undefined>(undefined);