// Contact interface
export interface Contact {
  id: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  serviceInterest: string;
  message: string;
  status: 'new' | 'in-progress' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  notes?: string;
  followUpDate?: string;
  source: 'contact-form' | 'phone' | 'walk-in' | 'referral';
}

// Contact filters interface
export interface ContactFilters {
  status?: string;
  priority?: string;
  serviceInterest?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  assignedTo?: string;
  source?: string;
}

// Contact statistics interface  
export interface ContactStats {
  total: number;
  new: number;
  inProgress: number;
  completed: number;
  thisMonth: number;
  thisWeek: number;
}

// Export types for convenience
export type ContactStatus = Contact['status'];
export type ContactPriority = Contact['priority'];
export type ContactSource = Contact['source'];