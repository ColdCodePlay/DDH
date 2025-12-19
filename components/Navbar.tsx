import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Page, User, BrandSettings } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
  settings: BrandSettings;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onLoginClick, settings }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link
            to="/"
            className="flex-shrink-0 flex items-center cursor-pointer"
          >
            {settings.logo ? (
              <img src={settings.logo} alt={settings.brandName} className="w-auto h-12" />
            ) : (
              <>
                <div className="w-12 h-12 bg-spice-primary rounded-full flex items-center justify-center mr-3 shadow-lg">
                  <i className="fas fa-mortar-pestle text-white text-2xl"></i>
                </div>
                <div>
                  <span className="text-2xl font-bold tracking-tight text-spice-primary">{settings.brandName.split(' ')[0]}</span>
                  <span className="text-2xl font-light tracking-tight ml-1 text-stone-700">{settings.brandName.split(' ').slice(1).join(' ')}</span>
                </div>
              </>
            )}
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <Link
              to="/"
              className={`${isActive('/') ? 'text-spice-primary font-semibold' : 'text-stone-600'} hover:text-spice-primary transition-colors`}
            >
              Home
            </Link>
            <Link
              to="/catalog"
              className={`${isActive('/catalog') ? 'text-spice-primary font-semibold' : 'text-stone-600'} hover:text-spice-primary transition-colors`}
            >
              Spice Catalog
            </Link>

            {user ? (
              <div className="flex items-center space-x-6">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`${isActive('/admin') ? 'text-spice-primary font-semibold' : 'text-stone-600'} hover:text-spice-primary transition-colors text-sm font-bold uppercase tracking-wider`}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/profile"
                  className={`flex items-center space-x-3 bg-stone-50 px-4 py-2 rounded-xl border transition-all hover:bg-stone-100 ${isActive('/profile') ? 'border-spice-primary/30 bg-spice-primary/5' : 'border-stone-100'}`}
                >
                  <div className="w-8 h-8 bg-spice-primary/10 rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-spice-primary text-xs"></i>
                  </div>
                  <span className="text-stone-700 text-sm font-bold truncate max-w-[150px]">{user.username}</span>
                </Link>
                <button
                  onClick={onLogout}
                  className="text-stone-400 hover:text-red-600 transition-colors p-2"
                  title="Logout"
                >
                  <i className="fas fa-sign-out-alt text-lg"></i>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-stone-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95 text-sm"
              >
                Sign In
              </button>
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
