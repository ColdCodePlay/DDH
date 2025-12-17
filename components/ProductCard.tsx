
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 group">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-spice-primary uppercase tracking-wider">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-stone-800 mb-2">{product.name}</h3>
        <p className="text-stone-500 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-xs text-stone-400 block uppercase">Wholesale Starting At</span>
            <span className="text-xl font-bold text-spice-primary">₹{product.price} / {product.unit}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-stone-400 block uppercase">Min. Order</span>
            <span className="font-semibold text-stone-700">{product.moq} {product.unit}</span>
          </div>
        </div>
        
        <button 
          onClick={() => onSelect(product)}
          className="w-full bg-spice-primary text-white py-3 rounded-xl font-semibold hover:bg-red-900 transition-colors flex items-center justify-center space-x-2"
        >
          <i className="far fa-paper-plane"></i>
          <span>Request Quote</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
