
import React, { useState, useEffect } from 'react';
import { Product, QuoteRequest, BrandSettings } from '../types';
import { storageService } from '../services/storageService';

interface AdminDashboardProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  settings: BrandSettings;
  setSettings: (settings: BrandSettings) => void;
}

/**
 * AdminDashboard: Premium management interface for catalog, inquiries, and brand settings.
 */
const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, setProducts, settings, setSettings }) => {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'quotes' | 'settings'>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [quoteSearchQuery, setQuoteSearchQuery] = useState('');
  
  // Settings Form State
  const [settingsFormData, setSettingsFormData] = useState<BrandSettings>(settings);

  const [productFormData, setProductFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Ground Spices',
    description: '',
    price: 0,
    image: '',
    unit: 'kg',
    moq: 1,
    isActive: true
  });

  useEffect(() => {
    setQuotes(storageService.getQuotes());
  }, [activeTab]);

  const openAddModal = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      category: 'Ground Spices',
      description: '',
      price: 0,
      image: '',
      unit: 'kg',
      moq: 1,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({ ...product });
    setIsModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (!productFormData.name || !productFormData.price || productFormData.price <= 0) {
      alert("Please provide a valid name and price.");
      return;
    }

    let updatedList: Product[];
    if (editingProduct) {
      updatedList = storageService.updateProduct({ ...editingProduct, ...productFormData } as Product);
    } else {
      updatedList = storageService.addProduct({
        ...productFormData as Product,
        id: Date.now().toString(),
        isActive: true
      });
    }
    
    setProducts([...updatedList]);
    setIsModalOpen(false);
  };

  const handleToggleStatus = (product: Product) => {
    const updatedProduct = { ...product, isActive: !product.isActive };
    const updatedList = storageService.updateProduct(updatedProduct);
    setProducts([...updatedList]);
  };

  const handleUpdateQuote = (id: string, status: QuoteRequest['status']) => {
    const updatedQuotes = storageService.updateQuoteStatus(id, status);
    setQuotes([...updatedQuotes]);
  };

  const handleSaveSettings = () => {
    storageService.saveSettings(settingsFormData);
    setSettings(settingsFormData);
    alert('Brand settings updated successfully!');
  };

  const filteredQuotes = quotes.filter(quote => 
    quote.customerName.toLowerCase().includes(quoteSearchQuery.toLowerCase()) ||
    quote.email.toLowerCase().includes(quoteSearchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-bold text-stone-900 tracking-tight">Business Controls</h2>
          <p className="text-stone-500 mt-2 text-lg">Maintain your spice inventory, review inquiries, and manage brand identity</p>
        </div>
        
        <div className="flex p-1.5 bg-stone-200/50 rounded-2xl shadow-inner w-full lg:w-auto">
          <button 
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex-1 lg:flex-none px-6 py-3 rounded-xl font-bold text-sm transition-all uppercase tracking-widest ${activeTab === 'products' ? 'bg-white text-spice-primary shadow-lg' : 'text-stone-500 hover:text-stone-800'}`}
          >
            Inventory
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('quotes')}
            className={`flex-1 lg:flex-none px-6 py-3 rounded-xl font-bold text-sm transition-all uppercase tracking-widest ${activeTab === 'quotes' ? 'bg-white text-spice-primary shadow-lg' : 'text-stone-500 hover:text-stone-800'}`}
          >
            Inquiries
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex-1 lg:flex-none px-6 py-3 rounded-xl font-bold text-sm transition-all uppercase tracking-widest ${activeTab === 'settings' ? 'bg-white text-spice-primary shadow-lg' : 'text-stone-500 hover:text-stone-800'}`}
          >
            Settings
          </button>
        </div>
      </div>

      {activeTab === 'products' && (
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
          <div className="p-8 border-b border-stone-50 flex flex-col sm:flex-row justify-between items-center bg-stone-50/20 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-stone-800">Master Catalog</h3>
              <p className="text-sm text-stone-400 font-medium uppercase tracking-wide mt-1">{products.length} Products Registered</p>
            </div>
            <button 
              type="button"
              onClick={openAddModal}
              className="w-full sm:w-auto bg-spice-primary text-white px-8 py-4 rounded-2xl hover:bg-red-900 transition-all flex items-center justify-center space-x-3 shadow-xl active:scale-95 group"
            >
              <i className="fas fa-plus text-xs transition-transform group-hover:rotate-90"></i>
              <span className="font-bold">Add New Spice</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50 text-stone-400 uppercase text-[11px] font-black tracking-[0.2em] border-b border-stone-100">
                  <th className="px-10 py-6">Product & Identity</th>
                  <th className="px-8 py-6">Classification</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6 text-center">Market Price</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-24 text-center text-stone-400 italic bg-stone-50/10">The catalog is currently empty.</td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id} className={`hover:bg-stone-50/40 transition-colors group ${!product.isActive ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                      <td className="px-10 py-8">
                        <div className="flex items-center space-x-6">
                          <div className="relative">
                            <img src={product.image} alt={product.name} className="w-16 h-16 rounded-2xl object-cover shadow-lg border border-white group-hover:scale-105 transition-transform" />
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-2 border-white rounded-full ${product.isActive ? 'bg-green-500' : 'bg-stone-300'}`}></div>
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 text-lg group-hover:text-spice-primary transition-colors">{product.name}</div>
                            <div className="text-[10px] text-stone-400 font-mono tracking-tighter mt-0.5">REF: {product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <span className="bg-stone-100 text-stone-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-stone-200/50">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-8 py-8 text-center">
                        <button 
                          onClick={() => handleToggleStatus(product)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${product.isActive ? 'bg-spice-primary' : 'bg-stone-200'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        <div className="text-[9px] font-bold uppercase tracking-widest mt-1 text-stone-400">
                          {product.isActive ? 'Active' : 'Hidden'}
                        </div>
                      </td>
                      <td className="px-8 py-8 text-center">
                        <div className="text-xl font-black text-stone-800">₹{product.price}</div>
                        <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Per {product.unit}</div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end items-center space-x-4">
                          <button 
                            type="button"
                            onClick={() => openEditModal(product)}
                            className="p-3.5 bg-white text-stone-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 rounded-2xl transition-all border border-stone-100 shadow-sm"
                            title="Edit Product"
                          >
                            <i className="fas fa-pen-nib text-sm"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'quotes' && (
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
          <div className="p-8 border-b border-stone-50 flex flex-col sm:flex-row justify-between items-center bg-stone-50/20 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-stone-800">B2B Inquiries</h3>
              <p className="text-sm text-stone-400 font-medium uppercase tracking-wide mt-1">{filteredQuotes.length} Total Results</p>
            </div>
            
            <div className="relative w-full sm:w-80 group">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-spice-primary transition-colors"></i>
              <input 
                type="text" 
                placeholder="Filter by name or email..."
                value={quoteSearchQuery}
                onChange={(e) => setQuoteSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-stone-100/50 border border-stone-100 rounded-2xl outline-none focus:ring-4 focus:ring-spice-primary/5 focus:bg-white focus:border-spice-primary/20 shadow-sm transition-all text-sm font-medium"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50 text-stone-400 uppercase text-[11px] font-black tracking-[0.2em] border-b border-stone-100">
                  <th className="px-10 py-6">Customer & Contact</th>
                  <th className="px-8 py-6">Order Intent</th>
                  <th className="px-8 py-6 text-center">Volume</th>
                  <th className="px-8 py-6 text-center">Consent</th>
                  <th className="px-8 py-6">Lifecycle</th>
                  <th className="px-10 py-6 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filteredQuotes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-10 py-24 text-center text-stone-400 italic bg-stone-50/10">
                      {quoteSearchQuery ? "No inquiries match your search criteria." : "No wholesale inquiries currently active."}
                    </td>
                  </tr>
                ) : (
                  filteredQuotes.map(quote => (
                    <tr key={quote.id} className="hover:bg-stone-50/40 transition-colors">
                      <td className="px-10 py-8">
                        <div className="font-bold text-stone-900 text-lg leading-tight">{quote.customerName}</div>
                        <div className="text-xs text-stone-500 font-medium mb-2">{quote.email}</div>
                        <div className="bg-spice-primary/5 text-spice-primary px-3 py-1.5 rounded-lg text-xs font-black inline-flex items-center border border-spice-primary/10">
                          <i className="fas fa-phone-flip mr-2 text-[10px]"></i>
                          {quote.phone}
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="text-stone-800 font-bold text-md">{quote.productName}</div>
                        <div className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">ID: {quote.productId}</div>
                        {quote.message && (
                          <div className="mt-2 text-xs text-stone-500 italic max-w-[200px] line-clamp-1 group-hover:line-clamp-none transition-all">
                             "{quote.message}"
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-8 text-center">
                         <div className="text-xl font-black text-stone-800">{quote.quantity}</div>
                         <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Requested Units</div>
                      </td>
                      <td className="px-8 py-8 text-center">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${quote.consent ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          <i className={`fas ${quote.consent ? 'fa-check' : 'fa-times'} text-xs`}></i>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border ${
                          quote.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                          quote.status === 'responded' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                          'bg-stone-100 text-stone-500 border-stone-200'
                        }`}>
                          {quote.status}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end space-x-3">
                          {quote.status === 'pending' && (
                            <button 
                              type="button"
                              onClick={() => handleUpdateQuote(quote.id, 'responded')}
                              className="bg-spice-primary text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-900 transition-all shadow-lg active:scale-95"
                            >
                              Resolve
                            </button>
                          )}
                          <button 
                            type="button"
                            onClick={() => handleUpdateQuote(quote.id, 'closed')}
                            className="p-3 bg-stone-50 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-2xl transition-all border border-stone-100"
                            title="Archive Quote"
                          >
                            <i className="fas fa-check-double text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-stone-200/50 border border-stone-100 p-10">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-stone-900 mb-8 border-b border-stone-100 pb-4">Brand & Site Configuration</h3>
            
            <div className="space-y-8">
              {/* Brand Identity */}
              <section className="bg-stone-50/50 p-6 rounded-3xl border border-stone-100">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-spice-primary mb-6 flex items-center">
                  <i className="fas fa-fingerprint mr-2"></i> Brand Identity
                </h4>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-stone-400 mb-2.5 tracking-[0.1em] ml-1">Brand Name</label>
                    <input 
                      type="text"
                      className="w-full p-4 bg-white border border-stone-200 rounded-2xl outline-none focus:ring-4 focus:ring-spice-primary/10 transition-all font-bold text-stone-800"
                      value={settingsFormData.brandName}
                      onChange={(e) => setSettingsFormData({...settingsFormData, brandName: e.target.value})}
                    />
                  </div>
                </div>
              </section>

              {/* Hero Banner Section */}
              <section className="bg-stone-50/50 p-6 rounded-3xl border border-stone-100">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-spice-primary mb-6 flex items-center">
                  <i className="fas fa-image mr-2"></i> Homepage Hero Banner
                </h4>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-stone-400 mb-2.5 tracking-[0.1em] ml-1">Hero Title</label>
                    <input 
                      type="text"
                      className="w-full p-4 bg-white border border-stone-200 rounded-2xl outline-none focus:ring-4 focus:ring-spice-primary/10 transition-all font-bold text-stone-800"
                      value={settingsFormData.heroTitle}
                      onChange={(e) => setSettingsFormData({...settingsFormData, heroTitle: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase text-stone-400 mb-2.5 tracking-[0.1em] ml-1">Hero Subtitle</label>
                    <textarea 
                      className="w-full p-4 bg-white border border-stone-200 rounded-2xl outline-none focus:ring-4 focus:ring-spice-primary/10 transition-all h-24 font-medium text-stone-700 resize-none"
                      value={settingsFormData.heroSubtitle}
                      onChange={(e) => setSettingsFormData({...settingsFormData, heroSubtitle: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase text-stone-400 mb-2.5 tracking-[0.1em] ml-1">Hero Background Image URL</label>
                    <input 
                      type="text"
                      className="w-full p-4 bg-white border border-stone-200 rounded-2xl outline-none focus:ring-4 focus:ring-spice-primary/10 transition-all font-bold text-stone-800"
                      value={settingsFormData.heroImage}
                      onChange={(e) => setSettingsFormData({...settingsFormData, heroImage: e.target.value})}
                    />
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section className="bg-stone-50/50 p-6 rounded-3xl border border-stone-100">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-spice-primary mb-6 flex items-center">
                  <i className="fas fa-map-pin mr-2"></i> Contact Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-black uppercase text-stone-400 mb-2.5 tracking-[0.1em] ml-1">Physical Address</label>
                    <input 
                      type="text"
                      className="w-full p-4 bg-white border border-stone-200 rounded-2xl outline-none focus:ring-4 focus:ring-spice-primary/10 transition-all font-bold text-stone-800"
                      value={settingsFormData.address}
                      onChange={(e) => setSettingsFormData({...settingsFormData, address: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase text-stone-400 mb-2.5 tracking-[0.1em] ml-1">Contact Phone</label>
                    <input 
                      type="text"
                      className="w-full p-4 bg-white border border-stone-200 rounded-2xl outline-none focus:ring-4 focus:ring-spice-primary/10 transition-all font-bold text-stone-800"
                      value={settingsFormData.contactPhone}
                      onChange={(e) => setSettingsFormData({...settingsFormData, contactPhone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase text-stone-400 mb-2.5 tracking-[0.1em] ml-1">Business Email</label>
                    <input 
                      type="email"
                      className="w-full p-4 bg-white border border-stone-200 rounded-2xl outline-none focus:ring-4 focus:ring-spice-primary/10 transition-all font-bold text-stone-800"
                      value={settingsFormData.contactEmail}
                      onChange={(e) => setSettingsFormData({...settingsFormData, contactEmail: e.target.value})}
                    />
                  </div>
                </div>
              </section>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={handleSaveSettings}
                  className="bg-spice-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-red-900 transition-all shadow-xl active:scale-95 flex items-center space-x-3"
                >
                  <i className="fas fa-save"></i>
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Management Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-6 z-[110] animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-12 w-full max-w-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] transform animate-in slide-in-from-bottom-12 duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-spice-primary"></div>
            
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-black text-stone-900 tracking-tight italic">
                {editingProduct ? 'Edit Entry' : 'New Entry'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-12 h-12 flex items-center justify-center bg-stone-50 text-stone-400 hover:text-stone-800 rounded-full transition-all"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[11px] font-black uppercase text-stone-400 mb-2.5 tracking-[0.2em] ml-1">Spice Name</label>
                  <input 
                    type="text"
                    className="w-full p-5 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-4 focus:ring-spice-primary/10 focus:bg-white transition-all font-bold text-stone-800 placeholder:text-stone-300"
                    value={productFormData.name || ''}
                    onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                    placeholder="e.g. Malabar Black Pepper"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-stone-400 mb-2.5 tracking-[0.2em] ml-1">Category</label>
                    <select 
                      className="w-full p-5 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-4 focus:ring-spice-primary/10 focus:bg-white transition-all font-bold text-stone-800"
                      value={productFormData.category}
                      onChange={(e) => setProductFormData({...productFormData, category: e.target.value})}
                    >
                      <option>Ground Spices</option>
                      <option>Whole Spices</option>
                      <option>Blended Spices</option>
                      <option>Seasonings</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase text-stone-400 mb-2.5 tracking-[0.2em] ml-1">Price (INR)</label>
                    <input 
                      type="number"
                      className="w-full p-5 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-4 focus:ring-spice-primary/10 focus:bg-white transition-all font-bold text-stone-800"
                      value={productFormData.price || 0}
                      onChange={(e) => setProductFormData({...productFormData, price: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-stone-400 mb-2.5 tracking-[0.2em] ml-1">Unit</label>
                    <input 
                      type="text"
                      className="w-full p-5 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-4 focus:ring-spice-primary/10 focus:bg-white transition-all font-bold text-stone-800"
                      value={productFormData.unit || ''}
                      onChange={(e) => setProductFormData({...productFormData, unit: e.target.value})}
                      placeholder="kg / g / pack"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase text-stone-400 mb-2.5 tracking-[0.2em] ml-1">Min Order</label>
                    <input 
                      type="number"
                      className="w-full p-5 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-4 focus:ring-spice-primary/10 focus:bg-white transition-all font-bold text-stone-800"
                      value={productFormData.moq || 1}
                      onChange={(e) => setProductFormData({...productFormData, moq: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-stone-400 mb-2.5 tracking-[0.2em] ml-1">Image URL</label>
                  <input 
                    type="text"
                    className="w-full p-5 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-4 focus:ring-spice-primary/10 focus:bg-white transition-all font-bold text-stone-800"
                    value={productFormData.image || ''}
                    onChange={(e) => setProductFormData({...productFormData, image: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-stone-400 mb-2.5 tracking-[0.2em] ml-1">Story & Description</label>
                  <textarea 
                    className="w-full p-5 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-4 focus:ring-spice-primary/10 focus:bg-white transition-all h-32 resize-none font-bold text-stone-800"
                    value={productFormData.description || ''}
                    onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                    placeholder="Flavor notes, origin story..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex space-x-6 mt-12">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-8 py-5 rounded-[1.5rem] font-black text-stone-400 hover:text-stone-800 hover:bg-stone-50 transition-all text-xs uppercase tracking-widest border border-stone-100"
              >
                Discard
              </button>
              <button 
                type="button"
                onClick={handleSaveProduct}
                className="flex-2 bg-spice-primary text-white px-10 py-5 rounded-[1.5rem] font-black hover:bg-red-900 transition-all shadow-2xl shadow-red-900/30 text-xs uppercase tracking-widest active:scale-95"
              >
                Commit Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
