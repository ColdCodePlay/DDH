
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import ProductCard from './components/ProductCard';
import ProductDetailPage from './components/ProductDetailPage';
import QuoteModal from './components/QuoteModal';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import { Page, Product, QuoteRequest, User, BrandSettings } from './types';
import { storageService } from './services/storageService';
import { APP_CONFIG } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<BrandSettings | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isResumingQuote, setIsResumingQuote] = useState(false);

  // Filtering & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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
    const initApp = async () => {
      setIsLoading(true);
      try {
        // Run migration if needed
        await storageService.migrateToSupabase();

        const [fetchedProducts, fetchedSettings, currentUser] = await Promise.all([
          storageService.getProducts(),
          storageService.getSettings(),
          storageService.getCurrentUser()
        ]);

        setProducts(fetchedProducts);
        setSettings(fetchedSettings);
        setUser(currentUser);

        // Listen for auth changes
        const { data: { subscription } } = storageService.onAuthStateChange((updatedUser) => {
          setUser(updatedUser);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Failed to initialize app:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  const navigate = useNavigate();

  // Redirect admin to dashboard on login
  useEffect(() => {
    if (user?.role === 'admin' && (window.location.pathname === '/login' || showAuthModal)) {
      navigate('/admin');
    }
  }, [user, navigate, showAuthModal]);

  // Handle quote resumption after login
  useEffect(() => {
    if (user && isResumingQuote && selectedProduct) {
      setQuoteFormData(prev => ({
        ...prev,
        quantity: selectedProduct.moq,
        consent: false,
        email: user.username || ''
      }));
      setShowQuoteForm(true);
      setIsResumingQuote(false);
    }
  }, [user, isResumingQuote, selectedProduct]);

  const handleLogout = async () => {
    await storageService.signOut();
    setUser(null);
    navigate('/');
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
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

    await storageService.addQuote(newQuote);
    setShowQuoteForm(false);
    alert('Quote request submitted successfully! Our sales team will contact you soon.');
    setQuoteFormData({ name: '', email: '', phone: '', quantity: 0, message: '', consent: false });
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleQuoteRequest = (product: Product) => {
    if (!user) {
      setSelectedProduct(product);
      setIsResumingQuote(true);
      setShowAuthModal(true);
      return;
    }
    setSelectedProduct(product);
    setQuoteFormData(prev => ({
      ...prev,
      quantity: product.moq,
      consent: false,
      email: user.username || '', // Pre-fill with user's email
      name: prev.name || ''
    }));
    setShowQuoteForm(true);
  };

  // Derived filtered products - Only show active products to customers
  const filteredProducts = products.filter(product => {
    const isVisible = product.isActive !== false;
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return isVisible && matchesCategory && matchesSearch;
  });

  const getRelatedProducts = (currentProduct: Product) => {
    return products.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id).slice(0, 3);
  };

  const categories = ['All', 'Ground Spices', 'Whole Spices', 'Blended Spices', 'Seasonings', 'Nuts', 'Indian Pickles'];

  if (isLoading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-spice-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600 font-medium">Loading DDH Masale...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => setShowAuthModal(true)}
        settings={settings}
      />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <div>
              {/* Hero Section */}
              <section className="relative h-[85vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                  <img
                    src={settings.heroImage}
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
                      {settings.heroTitle}
                    </h1>
                    <p className="text-xl text-stone-200 mb-10 leading-relaxed font-light">
                      {settings.heroSubtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                      <button
                        onClick={() => navigate('/catalog')}
                        className="bg-spice-primary hover:bg-red-900 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-xl flex items-center justify-center space-x-2"
                      >
                        <span>Explore Collection</span>
                        <i className="fas fa-arrow-right text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          } />
          <Route path="/catalog" element={
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
                      className={`px-6 py-2 rounded-full border whitespace-nowrap transition-all font-medium ${selectedCategory === cat
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
                    onSelect={handleQuoteRequest}
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
                  <p className="text-stone-500 max-w-xs mx-a
uto">
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
          } />
          <Route path="/product/:productId" element={
            <ProductDetailPage
              user={user}
              onLoginClick={() => setShowAuthModal(true)}
              onQuoteRequest={handleQuoteRequest}
              getRelatedProducts={getRelatedProducts}
              products={products}
            />
          } />
          <Route path="/admin" element={
            user?.role === 'admin' ? (
              <AdminDashboard
                products={products}
                setProducts={setProducts}
                settings={settings}
                setSettings={setSettings}
              />
            ) : (
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-shield-alt text-3xl text-red-500"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900">Access Restricted</h2>
                  <p className="text-stone-500 mt-2 mb-8">You need administrator privileges to access this area.</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-spice-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-red-900 transition-all shadow-lg"
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            )
          } />
          <Route path="/profile" element={
            user ? (
              <UserProfile user={user} />
            ) : (
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-stone-900">Please Sign In</h2>
                  <p className="text-stone-500 mt-2 mb-8">You need to be logged in to view your profile.</p>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-spice-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-red-900 transition-all shadow-lg"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )
          } />
          <Route path="/login" element={
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-stone-50">
              <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md border border-stone-100 text-center">
                <div className="w-16 h-16 bg-spice-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <i className="fas fa-user-shield text-white text-2xl"></i>
                </div>
                <h2 className="text-3xl font-bold text-stone-900">Member Access</h2>
                <p className="text-stone-500 mt-2 mb-8">Sign in to manage your spice business</p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg"
                >
                  Open Sign In
                </button>
              </div>
            </div>
          } />
        </Routes>
      </main>

      <Footer
        user={user}
        settings={settings}
      />

      {/* Quote Modal */}
      <QuoteModal
        product={selectedProduct}
        isOpen={showQuoteForm}
        onClose={() => setShowQuoteForm(false)}
        formData={quoteFormData}
        onFormChange={(field, value) => setQuoteFormData(prev => ({ ...prev, [field]: value }))}
        onSubmit={handleQuoteSubmit}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
        }}
      />
    </div>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
