import type { 
  Contact, 
  ContactStats, 
  ContactFilters 
} from '../types/contact';

class ContactService {
  private contactsCache: Contact[] | null = null;

  private get apiBaseUrl(): string {
    // Use environment-specific API URLs
    if (typeof window !== 'undefined') {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const isGitHubPages = window.location.hostname.includes('github.io');
      
      if (isLocalhost) {
        // Development: use local backend
        return 'http://localhost:3001/api';
      } else if (isGitHubPages) {
        // Production: GitHub Pages frontend + Render backend
        return 'https://optical-api.onrender.com/api';
      } else {
        // Fallback for other production domains
        return `${window.location.protocol}//${window.location.hostname}:3001/api`;
      }
    }
    
    // Default fallback for development
    return 'http://localhost:3001/api';
  }

  // Get all contacts
  async getContacts(): Promise<Contact[]> {
    try {
      console.log('📞 Loading contacts from backend API...');
      const response = await fetch(`${this.apiBaseUrl}/contacts`);
      if (!response.ok) throw new Error('Failed to fetch contacts');
      const contacts = await response.json();
      this.contactsCache = contacts;
      return contacts;
    } catch (error) {
      console.error('❌ Failed to load contacts from API, using local data:', error);
      return await this.getLocalContacts();
    }
  }

  // Fallback to local data
  private async getLocalContacts(): Promise<Contact[]> {
    if (this.contactsCache) {
      return this.contactsCache;
    }

    // Check localStorage for contacts
    const localData = localStorage.getItem('contacts_data');
    if (localData) {
      console.log('📱 Loading contacts from localStorage');
      try {
        this.contactsCache = JSON.parse(localData);
        return this.contactsCache || [];
      } catch (error) {
        console.error('Failed to parse contacts from localStorage:', error);
      }
    }
    
    console.error('No contact data available');
    return [];
  }

  // Add new contact
  async addContact(contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    try {
      const newContact: Contact = {
        ...contactData,
        id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('📞 Adding new contact via API...', newContact);
      const response = await fetch(`${this.apiBaseUrl}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact),
      });

      if (!response.ok) throw new Error('Failed to add contact');
      
      // Update cache
      this.contactsCache = null;
      return newContact;
    } catch (error) {
      console.error('❌ Failed to add contact via API, saving locally:', error);
      return await this.addLocalContact(contactData);
    }
  }

  // Fallback local add
  private async addLocalContact(contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    const contacts = await this.getLocalContacts();
    const newContact: Contact = {
      ...contactData,
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedContacts = [...contacts, newContact];
    
    // Save to local storage as backup
    if (typeof window !== 'undefined') {
      localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    }
    
    this.contactsCache = updatedContacts;
    return newContact;
  }

  // Update contact
  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
    try {
      const updatedContact = { ...updates, id, updatedAt: new Date().toISOString() };
      
      console.log('📞 Updating contact via API...', id);
      const response = await fetch(`${this.apiBaseUrl}/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContact),
      });

      if (!response.ok) throw new Error('Failed to update contact');
      
      const result = await response.json();
      
      // Update cache
      if (this.contactsCache) {
        this.contactsCache = this.contactsCache.map(c => c.id === id ? result : c);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Failed to update contact via API:', error);
      throw error;
    }
  }

  // Delete contact
  async deleteContact(id: string): Promise<boolean> {
    try {
      console.log('📞 Deleting contact via API...', id);
      const response = await fetch(`${this.apiBaseUrl}/contacts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete contact');
      
      // Update cache
      if (this.contactsCache) {
        this.contactsCache = this.contactsCache.filter(c => c.id !== id);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Failed to delete contact via API:', error);
      throw error;
    }
  }

  // Get contact statistics
  async getContactStats(): Promise<ContactStats> {
    try {
      console.log('📊 Loading contact stats from API...');
      const response = await fetch(`${this.apiBaseUrl}/contacts/stats`);
      if (!response.ok) throw new Error('Failed to fetch contact stats');
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to load stats from API, calculating locally:', error);
      return await this.calculateLocalStats();
    }
  }

  // Calculate stats from local data
  private async calculateLocalStats(): Promise<ContactStats> {
    const contacts = await this.getContacts();
    const now = new Date();
    const thisWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats: ContactStats = {
      total: contacts.length,
      new: contacts.filter(c => c.status === 'new').length,
      inProgress: contacts.filter(c => c.status === 'in-progress').length,
      completed: contacts.filter(c => c.status === 'completed').length,
      thisMonth: contacts.filter(c => new Date(c.createdAt) >= thisMonthStart).length,
      thisWeek: contacts.filter(c => new Date(c.createdAt) >= thisWeekStart).length,
    };

    return stats;
  }

  // Filter contacts
  async filterContacts(filters: ContactFilters): Promise<Contact[]> {
    const contacts = await this.getContacts();
    
    return contacts.filter(contact => {
      if (filters.status && contact.status !== filters.status) return false;
      if (filters.priority && contact.priority !== filters.priority) return false;
      if (filters.serviceInterest && contact.serviceInterest !== filters.serviceInterest) return false;
      if (filters.assignedTo && contact.assignedTo !== filters.assignedTo) return false;
      if (filters.source && contact.source !== filters.source) return false;
      
      if (filters.dateRange) {
        const contactDate = new Date(contact.createdAt);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        if (contactDate < startDate || contactDate > endDate) return false;
      }
      
      return true;
    });
  }

  // Clear cache
  clearCache(): void {
    this.contactsCache = null;
  }
}

export const contactService = new ContactService();
export default contactService;