
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  images?: string[]; // Multiple product images for gallery
  unit: string;
  moq: number; // Minimum Order Quantity
  isActive: boolean;
  specifications?: {
    origin?: string;
    grade?: string;
    shelfLife?: string;
    packaging?: string;
    certification?: string;
  };
  features?: string[]; // Key features and benefits
  origin?: string; // Primary origin location
}

export interface QuoteRequest {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  email: string;
  phone: string;
  quantity: number;
  message: string;
  consent: boolean;
  status: 'pending' | 'responded' | 'closed';
  userId?: string; // Link to Supabase Auth user
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface BrandSettings {
  brandName: string;
  logo?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'customer';
}

export enum Page {
  Home = 'home',
  Catalog = 'catalog',
  ProductDetail = 'productDetail',
  Admin = 'admin',
  Login = 'login',
  Quote = 'quote'
}
