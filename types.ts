
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  unit: string;
  moq: number; // Minimum Order Quantity
  isActive: boolean;
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
  createdAt: string;
}

export interface BrandSettings {
  brandName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
}

export interface User {
  username: string;
  role: 'admin' | 'customer';
}

export enum Page {
  Home = 'home',
  Catalog = 'catalog',
  Admin = 'admin',
  Login = 'login',
  Quote = 'quote'
}
