import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, User } from '../types';
import ReviewSection from './ReviewSection';

interface ProductDetailPageProps {
  products: Product[];
  user: User | null;
  onLoginClick: () => void;
  onQuoteRequest: (product: Product) => void;
  getRelatedProducts: (product: Product) => Product[];
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  products,
  user,
  onLoginClick,
  onQuoteRequest,
  getRelatedProducts
}) => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl shadow-lg p-12 border border-stone-100">
          <i className="fas fa-box-open text-6xl text-stone-300 mb-6"></i>
          <h2 className="text-3xl font-bold text-stone-800 mb-4">Product Not Found</h2>
          <p className="text-stone-500 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/catalog')}
            className="bg-spice-primary hover:bg-red-900 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(product);
  const productImages = product.images || [product.image];

  const handleAddToWishlist = () => {
    setWishlistAdded(true);
    setTimeout(() => setWishlistAdded(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = `Check out ${product.name} from DDH Masale - ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = `${product.name} - DDH Masale`;
    const body = `I thought you might be interested in this product:\n\n${product.name}\n${product.description}\n\n${window.location.href}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="mb-8 flex items-center space-x-2 text-sm">
        <button
          onClick={() => navigate('/')}
          className="text-stone-500 hover:text-spice-primary transition-colors"
        >
          Home
        </button>
        <i className="fas fa-chevron-right text-xs text-stone-300"></i>
        <button
          onClick={() => navigate('/catalog')}
          className="text-stone-500 hover:text-spice-primary transition-colors"
        >
          Catalog
        </button>
        <i className="fas fa-chevron-right text-xs text-stone-300"></i>
        <span className="text-stone-500">{product.category}</span>
        <i className="fas fa-chevron-right text-xs text-stone-300"></i>
        <span className="text-stone-900 font-medium">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div
            className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-100 group"
            onMouseEnter={() => setIsImageZoomed(true)}
            onMouseLeave={() => setIsImageZoomed(false)}
          >
            <img
              src={productImages[selectedImageIndex]}
              alt={product.name}
              className={`w-full h-[400px] md:h-[500px] object-cover transition-transform duration-500 ${isImageZoomed ? 'scale-110' : 'scale-100'
                }`}
            />
            {/* Zoom Indicator */}
            {isImageZoomed && (
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-xs font-medium">
                <i className="fas fa-search-plus mr-2"></i>
                Zoomed In
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {productImages.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImageIndex === index
                    ? 'border-spice-primary shadow-lg scale-105'
                    : 'border-stone-200 hover:border-spice-primary/50'
                    }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category Badge */}
          <div className="flex items-center justify-between">
            <span className="bg-spice-primary/10 text-spice-primary font-bold uppercase tracking-widest text-xs px-4 py-2 rounded-full border border-spice-primary/20">
              {product.category}
            </span>

            {/* Social Share & Wishlist */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAddToWishlist}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${wishlistAdded
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'border-stone-300 text-stone-600 hover:border-red-500 hover:text-red-500'
                  }`}
                title="Add to Wishlist"
              >
                <i className={`${wishlistAdded ? 'fas' : 'far'} fa-heart`}></i>
              </button>

              <div className="relative">
                <button
                  onClick={handleCopyLink}
                  className="w-10 h-10 rounded-full border-2 border-stone-300 text-stone-600 hover:border-spice-primary hover:text-spice-primary flex items-center justify-center transition-all"
                  title="Copy Link"
                >
                  <i className={`fas ${copiedLink ? 'fa-check' : 'fa-link'}`}></i>
                </button>
                {copiedLink && (
                  <div className="absolute -bottom-8 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap">
                    Link copied!
                  </div>
                )}
              </div>

              <button
                onClick={handleWhatsAppShare}
                className="w-10 h-10 rounded-full border-2 border-stone-300 text-stone-600 hover:border-green-500 hover:text-green-500 flex items-center justify-center transition-all"
                title="Share on WhatsApp"
              >
                <i className="fab fa-whatsapp"></i>
              </button>

              <button
                onClick={handleEmailShare}
                className="w-10 h-10 rounded-full border-2 border-stone-300 text-stone-600 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center transition-all"
                title="Share via Email"
              >
                <i className="fas fa-envelope"></i>
              </button>
            </div>
          </div>

          {/* Product Name & Origin */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>
            {product.origin && (
              <div className="flex items-center mt-3 text-stone-600">
                <i className="fas fa-map-marker-alt text-spice-primary mr-2"></i>
                <span className="text-sm font-medium">Origin: {product.origin}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-lg text-stone-600 leading-relaxed border-l-4 border-spice-primary pl-4 bg-stone-50 py-3 rounded-r-xl">
            {product.description}
          </p>

          {/* Pricing Card */}
          <div className="bg-gradient-to-br from-spice-primary to-red-900 p-6 rounded-2xl shadow-xl text-white">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="text-xs uppercase font-bold block mb-1 text-red-100">Wholesale Base Price</span>
                <span className="text-3xl font-bold">₹{product.price}</span>
                <span className="text-sm ml-1">/ {product.unit}</span>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase font-bold block mb-1 text-red-100">Minimum Order</span>
                <span className="text-3xl font-bold">{product.moq}</span>
                <span className="text-sm ml-1">{product.unit}</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => onQuoteRequest(product)}
            className="w-full bg-stone-900 hover:bg-black text-white px-8 py-5 rounded-2xl text-lg font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center space-x-3 group"
          >
            <span>Request a Quote</span>
            <i className="fas fa-file-invoice-dollar group-hover:rotate-12 transition-transform"></i>
          </button>

          <div className="flex items-center justify-center space-x-2 text-sm text-stone-500">
            <i className="fas fa-shield-alt text-green-600"></i>
            <span>Secure wholesale pricing • Quick response within 24 hours</span>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      {product.features && product.features.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-stone-900 mb-8 flex items-center">
            <div className="w-12 h-12 bg-spice-primary rounded-xl flex items-center justify-center mr-4">
              <i className="fas fa-star text-white"></i>
            </div>
            Key Features & Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-stone-200 rounded-xl p-4 hover:shadow-lg hover:border-spice-primary/30 transition-all group"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-spice-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-spice-primary group-hover:text-white transition-all">
                    <i className="fas fa-check text-spice-primary group-hover:text-white text-sm"></i>
                  </div>
                  <p className="text-stone-700 font-medium text-sm leading-relaxed">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specifications Section */}
      {product.specifications && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-stone-900 mb-8 flex items-center">
            <div className="w-12 h-12 bg-stone-800 rounded-xl flex items-center justify-center mr-4">
              <i className="fas fa-clipboard-list text-white"></i>
            </div>
            Product Specifications
          </h2>
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-lg">
            <div className="divide-y divide-stone-200">
              {product.specifications.origin && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 hover:bg-stone-50 transition-colors">
                  <div className="font-bold text-stone-700 flex items-center">
                    <i className="fas fa-map-marked-alt text-spice-primary mr-3 w-5"></i>
                    Origin
                  </div>
                  <div className="md:col-span-2 text-stone-600">{product.specifications.origin}</div>
                </div>
              )}
              {product.specifications.grade && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 hover:bg-stone-50 transition-colors">
                  <div className="font-bold text-stone-700 flex items-center">
                    <i className="fas fa-award text-spice-primary mr-3 w-5"></i>
                    Grade
                  </div>
                  <div className="md:col-span-2 text-stone-600">{product.specifications.grade}</div>
                </div>
              )}
              {product.specifications.shelfLife && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 hover:bg-stone-50 transition-colors">
                  <div className="font-bold text-stone-700 flex items-center">
                    <i className="fas fa-calendar-alt text-spice-primary mr-3 w-5"></i>
                    Shelf Life
                  </div>
                  <div className="md:col-span-2 text-stone-600">{product.specifications.shelfLife}</div>
                </div>
              )}
              {product.specifications.packaging && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 hover:bg-stone-50 transition-colors">
                  <div className="font-bold text-stone-700 flex items-center">
                    <i className="fas fa-box text-spice-primary mr-3 w-5"></i>
                    Packaging
                  </div>
                  <div className="md:col-span-2 text-stone-600">{product.specifications.packaging}</div>
                </div>
              )}
              {product.specifications.certification && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 hover:bg-stone-50 transition-colors">
                  <div className="font-bold text-stone-700 flex items-center">
                    <i className="fas fa-certificate text-spice-primary mr-3 w-5"></i>
                    Certification
                  </div>
                  <div className="md:col-span-2 text-stone-600">{product.specifications.certification}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-stone-900 mb-8 flex items-center">
            <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center mr-4">
              <i className="fas fa-layer-group text-spice-primary"></i>
            </div>
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(related => (
              <div
                key={related.id}
                onClick={() => navigate(`/product/${related.id}`)}
                className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden cursor-pointer group hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={related.image}
                    alt={related.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-spice-primary">
                    {related.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-spice-primary transition-colors">
                    {related.name}
                  </h3>
                  <p className="text-sm text-stone-500 mb-4 line-clamp-2">{related.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-stone-400 block">From</span>
                      <span className="text-lg font-bold text-spice-primary">₹{related.price}/{related.unit}</span>
                    </div>
                    <div className="w-10 h-10 bg-spice-primary/10 rounded-full flex items-center justify-center group-hover:bg-spice-primary transition-colors">
                      <i className="fas fa-arrow-right text-spice-primary group-hover:text-white transition-colors"></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <ReviewSection
        productId={product.id}
        user={user}
        onLoginClick={onLoginClick}
      />
    </div>
  );
};

export default ProductDetailPage;
