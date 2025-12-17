
import { Product, QuoteRequest, User } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

// Versioning keys to ensure a clean state for the latest logic updates
const PRODUCTS_KEY = 'ddh_products_v2';
const QUOTES_KEY = 'ddh_quotes_v2';
const AUTH_KEY = 'ddh_auth_v2';

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
    // Use strictly string-based comparison to avoid any number/string mismatch issues
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
