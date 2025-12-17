
import React from 'react';
import { Page, User, BrandSettings } from '../types';

interface FooterProps {
  setCurrentPage: (page: Page) => void;
  user: User | null;
  settings: BrandSettings;
}

const Footer: React.FC<FooterProps> = ({ setCurrentPage, user, settings }) => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-spice-primary rounded-full flex items-center justify-center mr-3 shadow-lg">
              <i className="fas fa-mortar-pestle text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">{settings.brandName}</span>
          </div>
          <p className="text-sm leading-relaxed mb-6">
            Bringing you the authentic taste of Indian heritage since 1985. Premium quality spices, ethically sourced and masterfully blended.
          </p>
          <div className="flex space-x-4 text-white">
            <a href="#" className="hover:text-spice-primary transition-colors"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="hover:text-spice-primary transition-colors"><i className="fab fa-instagram"></i></a>
            <a href="#" className="hover:text-spice-primary transition-colors"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li><button onClick={() => setCurrentPage(Page.Home)} className="hover:text-white transition-colors">Our Story</button></li>
            <li><button onClick={() => setCurrentPage(Page.Catalog)} className="hover:text-white transition-colors">B2B Solutions</button></li>
            <li><button onClick={() => setCurrentPage(Page.Catalog)} className="hover:text-white transition-colors">Bulk Inquiries</button></li>
            <li>
              {!user ? (
                <button 
                  onClick={() => setCurrentPage(Page.Login)} 
                  className="hover:text-spice-primary transition-colors font-semibold"
                >
                  Admin Login
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentPage(Page.Admin)} 
                  className="hover:text-spice-primary transition-colors font-semibold"
                >
                  Admin Panel
                </button>
              )}
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Categories</h4>
          <ul className="space-y-3 text-sm">
            <li><button onClick={() => setCurrentPage(Page.Catalog)} className="hover:text-white transition-colors">Whole Spices</button></li>
            <li><button onClick={() => setCurrentPage(Page.Catalog)} className="hover:text-white transition-colors">Ground Spices</button></li>
            <li><button onClick={() => setCurrentPage(Page.Catalog)} className="hover:text-white transition-colors">Specialty Blends</button></li>
            <li><button onClick={() => setCurrentPage(Page.Catalog)} className="hover:text-white transition-colors">Organic Range</button></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start">
              <i className="fas fa-map-marker-alt mt-1 mr-3 text-spice-primary"></i>
              <span>{settings.address}</span>
            </li>
            <li className="flex items-center">
              <i className="fas fa-phone mt-1 mr-3 text-spice-primary"></i>
              <span>{settings.contactPhone}</span>
            </li>
            <li className="flex items-center">
              <i className="fas fa-envelope mt-1 mr-3 text-spice-primary"></i>
              <span>{settings.contactEmail}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-stone-800 text-center text-xs">
        &copy; {new Date().getFullYear()} {settings.brandName}. All rights reserved. | Crafted with precision.
      </div>
    </footer>
  );
};

export default Footer;
