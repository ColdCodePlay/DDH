
import React from 'react';
import { Product } from '../types';

interface QuoteModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    formData: {
        name: string;
        email: string;
        phone: string;
        quantity: number;
        message: string;
        consent: boolean;
    };
    onFormChange: (field: string, value: any) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const QuoteModal: React.FC<QuoteModalProps> = ({
    product,
    isOpen,
    onClose,
    formData,
    onFormChange,
    onSubmit
}) => {
    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-spice-primary to-red-900 text-white p-6 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Request a Quote</h2>
                            <p className="text-red-100 text-sm mt-1">Get wholesale pricing for {product.name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                </div>

                {/* Product Summary */}
                <div className="p-6 bg-stone-50 border-b border-stone-200">
                    <div className="flex items-center space-x-4">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-xl shadow-md"
                        />
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-stone-900">{product.name}</h3>
                            <p className="text-sm text-stone-500">{product.category}</p>
                            <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm">
                                    <span className="text-stone-600">Base Price:</span>
                                    <span className="font-bold text-spice-primary ml-1">₹{product.price}/{product.unit}</span>
                                </span>
                                <span className="text-sm">
                                    <span className="text-stone-600">MOQ:</span>
                                    <span className="font-bold text-stone-900 ml-1">{product.moq} {product.unit}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="p-6 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => onFormChange('name', e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-spice-primary focus:border-spice-primary outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => onFormChange('email', e.target.value)}
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-spice-primary focus:border-spice-primary outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => onFormChange('phone', e.target.value)}
                                placeholder="+91 98765 43210"
                                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-spice-primary focus:border-spice-primary outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">
                            Quantity ({product.unit}) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={formData.quantity}
                            onChange={(e) => onFormChange('quantity', parseInt(e.target.value))}
                            min={product.moq}
                            placeholder={`Minimum ${product.moq} ${product.unit}`}
                            className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-spice-primary focus:border-spice-primary outline-none transition-all"
                            required
                        />
                        <p className="text-xs text-stone-500 mt-1">
                            <i className="fas fa-info-circle mr-1"></i>
                            Minimum order quantity: {product.moq} {product.unit}
                        </p>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">
                            Additional Message (Optional)
                        </label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => onFormChange('message', e.target.value)}
                            placeholder="Any specific requirements or questions..."
                            rows={4}
                            className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-spice-primary focus:border-spice-primary outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Consent */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                        <label className="flex items-start space-x-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={formData.consent}
                                onChange={(e) => onFormChange('consent', e.target.checked)}
                                className="mt-1 w-5 h-5 text-spice-primary rounded border-stone-300 focus:ring-2 focus:ring-spice-primary cursor-pointer"
                                required
                            />
                            <span className="text-sm text-stone-700 leading-relaxed">
                                I agree to be contacted by DDH Masale regarding this quote request and understand that my information will be used to provide pricing and product details. <span className="text-red-500">*</span>
                            </span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border-2 border-stone-300 text-stone-700 rounded-xl font-bold hover:bg-stone-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-4 bg-spice-primary hover:bg-red-900 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                        >
                            <span>Submit Quote Request</span>
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuoteModal;
