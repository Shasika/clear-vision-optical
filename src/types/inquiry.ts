export interface Inquiry {
  id: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  product: {
    id: string;
    name: string;
    brand: string;
    type: 'frame' | 'sunglasses';
    price: number;
    imageUrl?: string;
  };
  message: string;
  status: 'new' | 'in-progress' | 'contacted' | 'quoted' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  notes?: string;
  followUpDate?: string;
}

export interface InquiryFilters {
  status?: string;
  priority?: string;
  productType?: 'frame' | 'sunglasses';
  dateRange?: {
    start: string;
    end: string;
  };
  assignedTo?: string;
}

export interface InquiryStats {
  total: number;
  new: number;
  inProgress: number;
  completed: number;
  thisMonth: number;
  thisWeek: number;
}