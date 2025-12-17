
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Turmeric Powder (Haldi)',
    category: 'Ground Spices',
    description: 'Highly potent curcumin content, sourced from the finest farms of Sangli.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
    unit: 'kg',
    moq: 50,
    isActive: true
  },
  {
    id: '2',
    name: 'Red Chilli Powder (Lal Mirch)',
    category: 'Ground Spices',
    description: 'Extra hot and vibrant red, perfect for authentic Indian curries.',
    price: 320,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800',
    unit: 'kg',
    moq: 25,
    isActive: true
  },
  {
    id: '3',
    name: 'Cumin Seeds (Jeera)',
    category: 'Whole Spices',
    description: 'Aromatic and earthy seeds from the heart of Unjha, Gujarat.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800',
    unit: 'kg',
    moq: 10,
    isActive: true
  },
  {
    id: '4',
    name: 'Garam Masala',
    category: 'Blended Spices',
    description: 'Our secret blend of 12 premium spices for the ultimate flavor profile.',
    price: 600,
    image: 'https://images.unsplash.com/photo-1532336414038-cf1905044314?auto=format&fit=crop&q=80&w=800',
    unit: 'kg',
    moq: 5,
    isActive: true
  },
  {
    id: '5',
    name: 'Green Cardamom (Elaichi)',
    category: 'Whole Spices',
    description: 'Premium bold 8mm pods from the Idukki hills of Kerala.',
    price: 2400,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800',
    unit: 'kg',
    moq: 2,
    isActive: true
  }
];

export const APP_CONFIG = {
  adminPassword: 'admin', // Simple for demo purposes
  brandName: 'DDH Masale',
  contactEmail: 'sales@ddhmasale.com',
  contactPhone: '+91 98765 43210'
};
