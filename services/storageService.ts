import { Product, QuoteRequest, User, BrandSettings, Review } from '../types';
import { INITIAL_PRODUCTS, APP_CONFIG } from '../constants';
import { supabase } from './supabaseClient';

// Versioning keys for legacy localStorage (used for migration)
const PRODUCTS_KEY = 'ddh_products_v2';
const QUOTES_KEY = 'ddh_quotes_v2';
const SETTINGS_KEY = 'ddh_settings_v2';
const AUTH_KEY = 'ddh_auth_v2';

export const storageService = {
  // Migration Helper: Move data from localStorage to Supabase
  migrateToSupabase: async () => {
    const localProducts = localStorage.getItem(PRODUCTS_KEY);
    const localQuotes = localStorage.getItem(QUOTES_KEY);
    const localSettings = localStorage.getItem(SETTINGS_KEY);

    if (localProducts) {
      const products = JSON.parse(localProducts);
      const { error } = await supabase.from('products').upsert(products);
      if (!error) localStorage.removeItem(PRODUCTS_KEY);
    }

    if (localQuotes) {
      const quotes = JSON.parse(localQuotes);
      const { error } = await supabase.from('quotes').upsert(quotes);
      if (!error) localStorage.removeItem(QUOTES_KEY);
    }

    if (localSettings) {
      const settings = JSON.parse(localSettings);
      const { error } = await supabase.from('settings').upsert({ id: 1, ...settings });
      if (!error) localStorage.removeItem(SETTINGS_KEY);
    }
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;

      if (!data || data.length === 0) {
        // Initialize with default data if empty
        const { data: insertedData, error: insertError } = await supabase
          .from('products')
          .insert(INITIAL_PRODUCTS)
          .select();

        if (insertError) throw insertError;
        return insertedData as Product[];
      }

      return data as Product[];
    } catch (e) {
      console.error("Database read error:", e);
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts: async (products: Product[]) => {
    try {
      const { error } = await supabase.from('products').upsert(products);
      if (error) throw error;
    } catch (e) {
      console.error("Database write error:", e);
    }
  },

  addProduct: async (product: Product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select();

      if (error) throw error;
      return await storageService.getProducts();
    } catch (e) {
      console.error("Database add error:", e);
      return [];
    }
  },

  updateProduct: async (updatedProduct: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updatedProduct)
        .eq('id', updatedProduct.id);

      if (error) throw error;
      return await storageService.getProducts();
    } catch (e) {
      console.error("Database update error:", e);
      return [];
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return await storageService.getProducts();
    } catch (e) {
      console.error("Database delete error:", e);
      return [];
    }
  },

  // Quotes
  getQuotes: async (): Promise<QuoteRequest[]> => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(q => ({
        ...q,
        productId: q.product_id,
        productName: q.product_name,
        customerName: q.customer_name,
        userId: q.user_id,
        createdAt: q.created_at
      })) as QuoteRequest[];
    } catch (e) {
      console.error("Database quotes read error:", e);
      return [];
    }
  },

  getUserQuotes: async (userId: string): Promise<QuoteRequest[]> => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(q => ({
        ...q,
        productId: q.product_id,
        productName: q.product_name,
        customerName: q.customer_name,
        userId: q.user_id,
        createdAt: q.created_at
      })) as QuoteRequest[];
    } catch (e) {
      console.error("Database user quotes read error:", e);
      return [];
    }
  },

  addQuote: async (quote: QuoteRequest) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const dbQuote = {
        id: quote.id,
        product_id: quote.productId,
        product_name: quote.productName,
        customer_name: quote.customerName,
        email: quote.email,
        phone: quote.phone,
        quantity: quote.quantity,
        message: quote.message,
        consent: quote.consent,
        status: quote.status,
        user_id: session?.user?.id || null
      };
      const { error } = await supabase.from('quotes').insert(dbQuote);
      if (error) throw error;
    } catch (e) {
      console.error("Database quote add error:", e);
    }
  },

  updateQuoteStatus: async (id: string, status: QuoteRequest['status']) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      return await storageService.getQuotes();
    } catch (e) {
      console.error("Database quote update error:", e);
      return [];
    }
  },

  // Reviews
  getReviews: async (productId: string): Promise<Review[]> => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(r => ({
        ...r,
        productId: r.product_id,
        userId: r.user_id,
        userEmail: r.user_email,
        createdAt: r.created_at
      })) as Review[];
    } catch (e) {
      console.error("Database reviews read error:", e);
      return [];
    }
  },

  addReview: async (review: Omit<Review, 'id' | 'createdAt'>) => {
    try {
      const { error } = await supabase.from('reviews').insert({
        product_id: review.productId,
        user_id: review.userId,
        user_email: review.userEmail,
        rating: review.rating,
        comment: review.comment
      });
      if (error) throw error;
    } catch (e) {
      console.error("Database review add error:", e);
      throw e;
    }
  },

  // Admin Stats
  getAdminStats: async () => {
    try {
      const [productsCount, quotesCount, pendingQuotesCount] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('quotes').select('*', { count: 'exact', head: true }),
        supabase.from('quotes').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      return {
        totalProducts: productsCount.count || 0,
        totalQuotes: quotesCount.count || 0,
        pendingQuotes: pendingQuotesCount.count || 0
      };
    } catch (e) {
      console.error("Database stats error:", e);
      return { totalProducts: 0, totalQuotes: 0, pendingQuotes: 0 };
    }
  },

  // Settings
  getSettings: async (): Promise<BrandSettings> => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"

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

        const { data: insertedData, error: insertError } = await supabase
          .from('settings')
          .insert({ id: 1, ...defaultSettings })
          .select()
          .single();

        if (insertError) throw insertError;
        return insertedData as BrandSettings;
      }

      return data as BrandSettings;
    } catch (e) {
      console.error("Database settings read error:", e);
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

  saveSettings: async (settings: BrandSettings) => {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ id: 1, ...settings });
      if (error) throw error;
    } catch (e) {
      console.error("Database settings save error:", e);
    }
  },

  // Auth (Migrated to Supabase Auth)
  getCurrentUser: async (): Promise<User | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    return {
      username: session.user.email || 'User',
      role: session.user.email === APP_CONFIG.adminEmail ? 'admin' : 'customer',
      id: session.user.id
    };
  },

  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  signInWithGoogle: async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  onAuthStateChange: (callback: (user: User | null) => void) => {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        callback({
          username: session.user.email || 'User',
          role: session.user.email === APP_CONFIG.adminEmail ? 'admin' : 'customer',
          id: session.user.id
        });
      } else {
        callback(null);
      }
    });
  }
};
