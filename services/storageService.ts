
import { Product, QuoteRequest, User, BrandSettings } from '../types';
import { INITIAL_PRODUCTS, APP_CONFIG } from '../constants';

// Versioning keys to ensure a clean state for the latest logic updates
const PRODUCTS_KEY = 'ddh_products_v2';
const QUOTES_KEY = 'ddh_quotes_v2';
const AUTH_KEY = 'ddh_auth_v2';
const SETTINGS_KEY = 'ddh_settings_v2';

export const storageService = {
  // Products
  getProducts: (): Product[] => {
    try {
      const data = localStorage.getItem(PRODUCTS_KEY);
      if (!data) {
        // Initialize with default data if empty
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error("Storage read error:", e);
      return INITIAL_PRODUCTS;
    }
  },
  saveProducts: (products: Product[]) => {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {
      console.error("Storage write error:", e);
    }
  },
  addProduct: (product: Product) => {
    const products = storageService.getProducts();
    products.push(product);
    storageService.saveProducts(products);
    return products;
  },
  updateProduct: (updatedProduct: Product) => {
    const products = storageService.getProducts();
    const index = products.findIndex(p => String(p.id) === String(updatedProduct.id));
    if (index !== -1) {
      products[index] = updatedProduct;
      storageService.saveProducts(products);
    }
    return products;
  },
  deleteProduct: (id: string) => {
    const products = storageService.getProducts();
    const filteredProducts = products.filter(p => String(p.id) !== String(id));
    storageService.saveProducts(filteredProducts);
    return filteredProducts;
  },

  // Quotes
  getQuotes: (): QuoteRequest[] => {
    try {
      const data = localStorage.getItem(QUOTES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  addQuote: (quote: QuoteRequest) => {
    const quotes = storageService.getQuotes();
    quotes.unshift(quote);
    localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
  },
  updateQuoteStatus: (id: string, status: QuoteRequest['status']) => {
    const quotes = storageService.getQuotes();
    const index = quotes.findIndex(q => String(q.id) === String(id));
    if (index !== -1) {
      quotes[index].status = status;
      localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
    }
    return quotes;
  },

  // Settings
  getSettings: (): BrandSettings => {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) {
        const defaultSettings: BrandSettings = {
          brandName: APP_CONFIG.brandName,
          heroTitle: 'The Soul of Indian Cuisine',
          heroSubtitle: 'DDH Masale delivers high-curcumin turmeric, premium whole spices, and authentic blends to wholesalers and food creators worldwide.',
          heroImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=2000',
          address: '524, Sector 38, Gurgaon, HR, India 122014',
          contactPhone: APP_CONFIG.contactPhone,
          contactEmail: APP_CONFIG.contactEmail
        };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
        return defaultSettings;
      }
      return JSON.parse(data);
    } catch (e) {
      return {
        brandName: APP_CONFIG.brandName,
        heroTitle: 'The Soul of Indian Cuisine',
        heroSubtitle: 'DDH Masale delivers high-curcumin turmeric, premium whole spices, and authentic blends to wholesalers and food creators worldwide.',
        heroImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=2000',
        address: '524, Sector 38, Gurgaon, HR, India 122014',
        contactPhone: APP_CONFIG.contactPhone,
        contactEmail: APP_CONFIG.contactEmail
      };
    }
  },
  saveSettings: (settings: BrandSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  // Auth
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },
  login: (username: string) => {
    const user: User = { username, role: 'admin' };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  }
};
