
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import AdminDashboard from './components/AdminDashboard';
import { Page, Product, QuoteRequest, User } from './types';
import { storageService } from './services/storageService';
import { getSpiceExpertAdvice } from './services/geminiService';
import { APP_CONFIG } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Filtering & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // AI Assistant State
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Quote Form State
  const [quoteFormData, setQuoteFormData] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: 0,
    message: '',
    consent: false
  });

  useEffect(() => {
    setUser(storageService.getCurrentUser());
    setProducts(storageService.getProducts());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === APP_CONFIG.adminPassword) {
      const newUser = storageService.login('Admin');
      setUser(newUser);
      setCurrentPage(Page.Admin);
      setLoginPassword('');
    } else {
      setLoginError('Invalid administrator credentials.');
    }
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    setCurrentPage(Page.Home);
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!quoteFormData.consent) {
      alert('Please agree to be contacted to proceed with the quote request.');
      return;
    }

    const newQuote: QuoteRequest = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      customerName: quoteFormData.name,
      email: quoteFormData.email,
      phone: quoteFormData.phone,
      quantity: quoteFormData.quantity,
      message: quoteFormData.message,
      consent: quoteFormData.consent,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    storageService.addQuote(newQuote);
    setShowQuoteForm(false);
    alert('Quote request submitted successfully! Our sales team will contact you soon.');
    setQuoteFormData({ name: '', email: '', phone: '', quantity: 0, message: '', consent: false });
  };

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = aiInput;
    setAiMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiInput('');
    setAiLoading(true);

    const aiResponse = await getSpiceExpertAdvice(userMsg);
    setAiMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setAiLoading(false);
  };

  // Derived filtered products - Only show active products to customers
  const filteredProducts = products.filter(product => {
    const isVisible = product.isActive !== false; // Handle legacy data where isActive might be undefined
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return isVisible && matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Ground Spices', 'Whole Spices', 'Blended Spices', 'Seasonings'];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        user={user} 
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        {currentPage === Page.Home && (
          <div>
            {/* Hero Section */}
            <section className="relative h-[85vh] flex items-center overflow-hidden">
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=2000" 
                  className="w-full h-full object-cover"
                  alt="Spice Background"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
              </div>
              
              <div className="relative max-w-7xl mx-auto px-4 w-full">
                <div className="max-w-2xl text-white">
                  <div className="bg-spice-primary px-4 py-1 inline-block rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                    Direct from Origin Farms
                  </div>
                  <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                    The Soul of <br/><span className="text-spice-secondary italic">Indian Cuisine</span>
                  </h1>
                  <p className="text-xl text-stone-200 mb-10 leading-relaxed font-light">
                    DDH Masale delivers high-curcumin turmeric, premium whole spices, and authentic blends to wholesalers and food creators worldwide.
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                    <button 
                      onClick={() => setCurrentPage(Page.Catalog)}
                      className="bg-spice-primary hover:bg-red-900 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-xl flex items-center justify-center space-x-2"
                    >
                      <span>Explore Collection</span>
                      <i className="fas fa-arrow-right text-sm"></i>
                    </button>
                    <button 
                      onClick={() => setAiOpen(true)}
                      className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 px-8 py-4 rounded-xl text-lg font-bold transition-all"
                    >
                      Talk to Spice Expert
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentPage === Page.Catalog && (
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
            <div className="flex flex-col mb-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <span className="text-spice-primary font-bold uppercase tracking-widest text-sm">Collection</span>
                  <h2 className="text-4xl md:text-5xl font-bold mt-2 text-stone-900">Premium Spice Library</h2>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-96 group">
                  <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-spice-primary transition-colors"></i>
                  <input 
                    type="text" 
                    placeholder="Search spices, powders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-spice-primary focus:border-spice-primary shadow-sm transition-all"
                  />
                </div>
              </div>

              {/* Category Filters */}
              <div className="mt-8 flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 rounded-full border whitespace-nowrap transition-all font-medium ${
                      selectedCategory === cat 
                      ? 'bg-spice-primary text-white border-spice-primary shadow-md' 
                      : 'bg-white text-stone-600 border-stone-200 hover:border-spice-primary hover:text-spice-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onSelect={(p) => {
                    setSelectedProduct(p);
                    setQuoteFormData(prev => ({ ...prev, quantity: p.moq, consent: false }));
                    setShowQuoteForm(true);
                  }}
                />
              ))}
            </div>

            {/* Empty States */}
            {filteredProducts.length === 0 && (
              <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-stone-200 shadow-inner">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-search text-3xl text-stone-300"></i>
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">No matching spices found</h3>
                <p className="text-stone-500 max-w-xs mx-auto">
                  Try adjusting your search query or switching categories.
                </p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="mt-6 text-spice-primary font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {currentPage === Page.Admin && (
          <AdminDashboard 
            products={products} 
            setProducts={setProducts} 
          />
        )}

        {currentPage === Page.Login && (
          <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-stone-50">
            <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md border border-stone-100">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-spice-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <i className="fas fa-lock text-white text-2xl"></i>
                </div>
                <h2 className="text-3xl font-bold text-stone-900">Admin Portal</h2>
                <p className="text-stone-500 mt-2">Manage products and quotes</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Password</label>
                  <input 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-4 rounded-xl border border-stone-200 focus:ring-2 focus:ring-spice-primary focus:border-spice-primary outline-none transition-all"
                    required
                  />
                  {loginError && <p className="text-red-500 text-sm mt-2 font-medium">{loginError}</p>}
                </div>
                <button 
                  type="submit"
                  className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg"
                >
                  Access Dashboard
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer setCurrentPage={setCurrentPage} user={user} />

      {/* Quote Form Modal */}
      {showQuoteForm && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-spice-primary"></div>
             <button 
                onClick={() => setShowQuoteForm(false)}
                className="absolute top-6 right-6 text-stone-400 hover:text-stone-600"
             >
               <i className="fas fa-times text-2xl"></i>
             </button>

             <div className="flex flex-col md:flex-row gap-8">
               <div className="md:w-1/3">
                 <img src={selectedProduct.image} className="w-full h-48 object-cover rounded-2xl mb-4" />
                 <h3 className="text-xl font-bold mb-1">{selectedProduct.name}</h3>
                 <p className="text-stone-500 text-sm mb-4">{selectedProduct.category}</p>
                 <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                    <span className="text-xs text-stone-400 uppercase font-bold block mb-1">Wholesale Base</span>
                    <span className="text-lg font-bold text-spice-primary">₹{selectedProduct.price}/{selectedProduct.unit}</span>
                 </div>
               </div>

               <div className="md:w-2/3">
                 <h2 className="text-2xl font-bold mb-6">Request Wholesale Quote</h2>
                 <form onSubmit={handleQuoteSubmit} className="space-y-4">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Full Name</label>
                       <input 
                         type="text" 
                         required
                         className="w-full p-3 bg-stone-50 border border-stone-100 rounded-lg focus:ring-2 focus:ring-spice-primary outline-none"
                         value={quoteFormData.name}
                         onChange={(e) => setQuoteFormData({...quoteFormData, name: e.target.value})}
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Company Email</label>
                       <input 
                         type="email" 
                         required
                         className="w-full p-3 bg-stone-50 border border-stone-100 rounded-lg focus:ring-2 focus:ring-spice-primary outline-none"
                         value={quoteFormData.email}
                         onChange={(e) => setQuoteFormData({...quoteFormData, email: e.target.value})}
                       />
                     </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Phone Number</label>
                       <input 
                         type="tel" 
                         required
                         className="w-full p-3 bg-stone-50 border border-stone-100 rounded-lg focus:ring-2 focus:ring-spice-primary outline-none"
                         value={quoteFormData.phone}
                         onChange={(e) => setQuoteFormData({...quoteFormData, phone: e.target.value})}
                         placeholder="+91..."
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Quantity ({selectedProduct.unit})</label>
                       <input 
                         type="number" 
                         min={selectedProduct.moq}
                         required
                         className="w-full p-3 bg-stone-50 border border-stone-100 rounded-lg focus:ring-2 focus:ring-spice-primary outline-none"
                         value={quoteFormData.quantity}
                         onChange={(e) => setQuoteFormData({...quoteFormData, quantity: Number(e.target.value)})}
                       />
                     </div>
                   </div>
                   <div>
                     <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Specific Requirements</label>
                     <textarea 
                       className="w-full p-3 bg-stone-50 border border-stone-100 rounded-lg focus:ring-2 focus:ring-spice-primary outline-none h-32"
                       placeholder="Tell us about packaging needs..."
                       value={quoteFormData.message}
                       onChange={(e) => setQuoteFormData({...quoteFormData, message: e.target.value})}
                     ></textarea>
                   </div>
                   
                   {/* Consent Checkbox */}
                   <div className="flex items-start space-x-3 py-2">
                     <div className="flex items-center h-5">
                       <input
                         id="marketing-consent"
                         name="marketing-consent"
                         type="checkbox"
                         required
                         checked={quoteFormData.consent}
                         onChange={(e) => setQuoteFormData({...quoteFormData, consent: e.target.checked})}
                         className="h-5 w-5 rounded border-stone-300 text-spice-primary focus:ring-spice-primary transition-all cursor-pointer"
                       />
                     </div>
                     <div className="text-sm">
                       <label htmlFor="marketing-consent" className="font-medium text-stone-700 cursor-pointer select-none">
                         I agree to be contacted via email and phone for product updates, wholesale offers, and order follow-ups. <span className="text-spice-primary">*</span>
                       </label>
                     </div>
                   </div>

                   <button className="w-full bg-spice-primary text-white py-4 rounded-xl font-bold hover:bg-red-900 transition-all shadow-xl active:scale-95">
                     Submit Quote Inquiry
                   </button>
                 </form>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* AI Assistant FAB and Chat */}
      <div className="fixed bottom-8 right-8 z-[90]">
        {!aiOpen ? (
          <button 
            onClick={() => setAiOpen(true)}
            className="w-16 h-16 bg-spice-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group animate-bounce"
          >
            <i className="fas fa-robot text-2xl"></i>
          </button>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl w-[90vw] max-w-sm h-[500px] flex flex-col overflow-hidden border border-stone-100 ring-1 ring-black/5">
            <div className="bg-spice-primary p-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-leaf"></i>
                </div>
                <div className="font-bold text-sm">DDH Spice Expert</div>
              </div>
              <button onClick={() => setAiOpen(false)}><i className="fas fa-times"></i></button>
            </div>
            
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-stone-50">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.role === 'user' 
                    ? 'bg-spice-primary text-white rounded-tr-none' 
                    : 'bg-white text-stone-800 border border-stone-100 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiLoading && <div className="text-xs text-stone-400 italic">Thinking...</div>}
            </div>
            
            <form onSubmit={handleAiAsk} className="p-4 bg-white border-t border-stone-100">
              <div className="relative">
                <input 
                  type="text" 
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask about spices..."
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none pr-12 text-sm"
                />
                <button type="submit" className="absolute right-2 top-1.5 w-9 h-9 bg-spice-primary text-white rounded-lg flex items-center justify-center">
                  <i className="fas fa-paper-plane text-xs"></i>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
