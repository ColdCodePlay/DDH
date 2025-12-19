
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Turmeric Powder (Haldi)',
    category: 'Ground Spices',
    description: 'Highly potent curcumin content, sourced from the finest farms of Sangli.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800'
    ],
    unit: 'kg',
    moq: 50,
    isActive: true,
    origin: 'Sangli, Maharashtra',
    specifications: {
      origin: 'Sangli, Maharashtra',
      grade: 'Premium A-Grade',
      shelfLife: '12 months from packaging',
      packaging: 'Food-grade poly bags in corrugated boxes',
      certification: 'FSSAI Certified, ISO 22000'
    },
    features: [
      'High curcumin content (3-5%)',
      'Natural golden-yellow color',
      'No artificial additives',
      'Direct farm sourcing',
      'Lab tested for purity',
      'Authentic aroma and flavor'
    ]
  },
  {
    id: '2',
    name: 'Red Chilli Powder (Lal Mirch)',
    category: 'Ground Spices',
    description: 'Extra hot and vibrant red, perfect for authentic Indian curries.',
    price: 320,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1596040033229-a0b8b5b6f197?auto=format&fit=crop&q=80&w=800'
    ],
    unit: 'kg',
    moq: 25,
    isActive: true,
    origin: 'Guntur, Andhra Pradesh',
    specifications: {
      origin: 'Guntur, Andhra Pradesh',
      grade: 'Super Hot Premium',
      shelfLife: '18 months from packaging',
      packaging: 'Triple-layer moisture-proof bags',
      certification: 'Export Quality, Spice Board Certified'
    },
    features: [
      'Intense heat level',
      'Vibrant natural red color',
      'Rich capsaicin content',
      'Stone-ground for fine texture',
      'No color additives',
      'Perfect for commercial use'
    ]
  },
  {
    id: '3',
    name: 'Cumin Seeds (Jeera)',
    category: 'Whole Spices',
    description: 'Aromatic and earthy seeds from the heart of Unjha, Gujarat.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1596040033229-a0b8b5b6f197?auto=format&fit=crop&q=80&w=800'
    ],
    unit: 'kg',
    moq: 10,
    isActive: true,
    origin: 'Unjha, Gujarat',
    specifications: {
      origin: 'Unjha, Gujarat (Asia\'s largest cumin market)',
      grade: 'Singapore Quality',
      shelfLife: '24 months in proper storage',
      packaging: 'Jute bags lined with food-grade poly',
      certification: 'Agmark Certified, Export Quality'
    },
    features: [
      'Bold, uniform seeds',
      'Strong aromatic profile',
      'Low moisture content',
      'Machine cleaned & sorted',
      '99% purity level',
      'Ideal for tempering & grinding'
    ]
  },
  {
    id: '4',
    name: 'Garam Masala',
    category: 'Blended Spices',
    description: 'Our secret blend of 12 premium spices for the ultimate flavor profile.',
    price: 600,
    image: 'https://images.unsplash.com/photo-1532336414038-cf1905044314?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1532336414038-cf1905044314?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800'
    ],
    unit: 'kg',
    moq: 5,
    isActive: true,
    origin: 'Proprietary Blend',
    specifications: {
      origin: 'Multi-origin premium ingredients',
      grade: 'Restaurant Quality Blend',
      shelfLife: '9 months from blending',
      packaging: 'Nitrogen-flushed aluminum pouches',
      certification: 'FSSAI Licensed, Quality Assured'
    },
    features: [
      'Proprietary 12-spice blend',
      'Freshly roasted & ground',
      'Balanced heat & aroma',
      'No salt or fillers',
      'Restaurant preferred',
      'Consistent flavor profile'
    ]
  },
  {
    id: '5',
    name: 'Green Cardamom (Elaichi)',
    category: 'Whole Spices',
    description: 'Premium bold 8mm pods from the Idukki hills of Kerala.',
    price: 2400,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800'
    ],
    unit: 'kg',
    moq: 2,
    isActive: true,
    origin: 'Idukki, Kerala',
    specifications: {
      origin: 'Idukki Hills, Kerala (Premium growing region)',
      grade: '8mm Bold Premium',
      shelfLife: '18 months in airtight conditions',
      packaging: 'Vacuum-sealed poly bags',
      certification: 'GI Tagged, Organic Certified'
    },
    features: [
      'Bold 8mm+ pod size',
      'Intense natural aroma',
      'Green color retention',
      'High essential oil content',
      'Handpicked selection',
      'Premium export quality'
    ]
  },
  {
    id: '6',
    name: 'Premium Cashews (Kaju)',
    category: 'Nuts',
    description: 'W240 grade jumbo cashews, perfectly roasted and crunchy.',
    price: 950,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800'
    ],
    unit: 'kg',
    moq: 5,
    isActive: true,
    origin: 'Konkan, Maharashtra',
    specifications: {
      origin: 'Konkan, Maharashtra',
      grade: 'W240 Jumbo',
      shelfLife: '6 months from packaging',
      packaging: 'Vacuum-sealed pouches',
      certification: 'FSSAI Certified'
    },
    features: [
      'Jumbo size (W240)',
      'Uniform white color',
      'Crunchy texture',
      'Rich in healthy fats',
      'No preservatives',
      'Perfect for snacking or cooking'
    ]
  },
  {
    id: '7',
    name: 'Spicy Mango Pickle',
    category: 'Indian Pickles',
    description: 'Traditional home-style mango pickle made with cold-pressed mustard oil.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1589135398309-0d44f5927613?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1589135398309-0d44f5927613?auto=format&fit=crop&q=80&w=800'
    ],
    unit: 'kg',
    moq: 2,
    isActive: true,
    origin: 'Varanasi, Uttar Pradesh',
    specifications: {
      origin: 'Varanasi, Uttar Pradesh',
      grade: 'Premium Traditional',
      shelfLife: '18 months from packaging',
      packaging: 'Glass jars / Food-grade plastic jars',
      certification: 'FSSAI Licensed'
    },
    features: [
      'Traditional recipe',
      'Cold-pressed mustard oil',
      'Hand-cut mango pieces',
      'Sun-dried spices',
      'No artificial colors',
      'Authentic Banarasi flavor'
    ]
  }
];

export const APP_CONFIG = {
  adminPassword: 'admin', // Simple for demo purposes
  adminEmail: 'admin@ddhmasale.com', // Default admin email for Supabase Auth
  brandName: 'DDH Masale',
  contactEmail: 'sales@ddhmasale.com',
  contactPhone: '+91 98765 43210'
};
