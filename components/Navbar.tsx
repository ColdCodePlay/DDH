
import React from 'react';
import { Page, User } from '../types';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage, user, onLogout }) => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer" 
            onClick={() => setCurrentPage(Page.Home)}
          >
            <div className="w-12 h-12 bg-spice-primary rounded-full flex items-center justify-center mr-3 shadow-lg">
              <i className="fas fa-mortar-pestle text-white text-2xl"></i>
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-spice-primary">DDH</span>
              <span className="text-2xl font-light tracking-tight ml-1 text-stone-700">Masale</span>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <button 
              onClick={() => setCurrentPage(Page.Home)}
              className={`${currentPage === Page.Home ? 'text-spice-primary font-semibold' : 'text-stone-600'} hover:text-spice-primary transition-colors`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentPage(Page.Catalog)}
              className={`${currentPage === Page.Catalog ? 'text-spice-primary font-semibold' : 'text-stone-600'} hover:text-spice-primary transition-colors`}
            >
              Spice Catalog
            </button>
            
            {user && (
              <>
                <button 
                  onClick={() => setCurrentPage(Page.Admin)}
                  className={`${currentPage === Page.Admin ? 'text-spice-primary font-semibold' : 'text-stone-600'} hover:text-spice-primary transition-colors`}
                >
                  Admin Panel
                </button>
                <button 
                  onClick={onLogout}
                  className="bg-stone-200 text-stone-700 px-4 py-2 rounded-lg hover:bg-stone-300 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <i className="fas fa-bars text-2xl text-stone-700"></i>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
