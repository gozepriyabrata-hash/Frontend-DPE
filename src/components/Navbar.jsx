import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut, Package, Hexagon, Car, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const { cartItems, setIsCartOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {/* Brutalist Marquee Banner */}
      <div className="bg-neo-black text-neo-yellow py-1 border-b-2 border-neo-black overflow-hidden relative">
        <div className="marquee-container animate-marquee whitespace-nowrap text-xs font-bold uppercase tracking-[0.2em] flex gap-8">
          <span>🔥 ALGORITHMIC PRICING ACTIVE</span>
          <span>•</span>
          <span>NEVER OVERPAY AGAIN</span>
          <span>•</span>
          <span>🔥 ALGORITHMIC PRICING ACTIVE</span>
          <span>•</span>
          <span>NEVER OVERPAY AGAIN</span>
          <span>•</span>
          <span>🔥 ALGORITHMIC PRICING ACTIVE</span>
          <span>•</span>
          <span>NEVER OVERPAY AGAIN</span>
        </div>
      </div>

      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'py-3 bg-neo-cyan/90 backdrop-blur-md border-b-4 border-neo-black shadow-brutal-sm' 
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between gap-6">
            
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center group shrink-0 transition-transform hover:-translate-y-1 hover:drop-shadow-[2px_2px_0px_#121212]"
              onClick={() => window.scrollTo(0, 0)}
            >
              <img src="/logo.png?v=2" alt="PRISM Logo" className="h-16 md:h-20 w-auto object-contain mix-blend-multiply" />
            </Link>

            {/* Middle: Search (Desktop) — hidden on cab engine */}
            {location.pathname !== '/cab-engine' && (
              <div className="hidden md:flex flex-1 max-w-xl mx-auto relative group">
                <form onSubmit={handleSearch} className="w-full relative">
                  <input
                    type="text"
                    placeholder="SEARCH FOR ANYTHING..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className={`w-full bg-white border-3 border-neo-black py-2.5 pl-12 pr-4 font-neo text-sm transition-all duration-200 outline-none placeholder:text-gray-400 placeholder:font-bold ${
                      isSearchFocused ? 'shadow-brutal-sm -translate-y-[2px] -translate-x-[2px]' : ''
                    }`}
                  />
                  <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    isSearchFocused ? 'text-neo-pink' : 'text-neo-black'
                  }`} strokeWidth={2.5} />
                </form>
              </div>
            )}
            
            {/* Dynamic Quick Link (Cab/Shop) */}
            {location.pathname === '/cab-engine' ? (
              <Link 
                to="/shop"
                className="hidden lg:flex items-center gap-2 bg-neo-cyan border-3 border-neo-black px-4 py-2 font-display font-bold uppercase text-xs hover:shadow-brutal-sm hover:-translate-y-[2px] hover:-translate-x-[2px] transition-all"
              >
                <Store className="w-4 h-4" strokeWidth={2.5} /> Shopping
              </Link>
            ) : (
              <Link 
                to="/cab-engine"
                className="hidden lg:flex items-center gap-2 bg-neo-yellow border-3 border-neo-black px-4 py-2 font-display font-bold uppercase text-xs hover:shadow-brutal-sm hover:-translate-y-[2px] hover:-translate-x-[2px] transition-all"
              >
                <Car className="w-4 h-4" strokeWidth={2.5} /> Cab Engine
              </Link>
            )}

            {/* Right: Actions */}
            <div className="flex items-center gap-4 shrink-0">
              
              {/* User Dropdown */}
              <div className="relative">
                {user ? (
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex w-10 h-10 items-center justify-center bg-neo-pink border-3 border-neo-black text-white hover:shadow-brutal-sm hover:-translate-y-[2px] hover:-translate-x-[2px] transition-all"
                  >
                    <span className="font-display font-black text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </button>
                ) : (
                  <Link 
                    to="/login"
                    className="hidden sm:inline-flex items-center gap-2 bg-white border-3 border-neo-black px-4 py-2 font-display font-bold uppercase text-sm hover:shadow-brutal-sm hover:-translate-y-[2px] hover:-translate-x-[2px] transition-all"
                  >
                    <User className="w-4 h-4" strokeWidth={2.5} /> Log In
                  </Link>
                )}

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && user && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-white border-4 border-neo-black shadow-brutal overflow-hidden"
                    >
                      <div className="p-4 border-b-3 border-neo-black bg-neo-yellow">
                        <p className="font-display font-black truncate">{user.name}</p>
                        <p className="font-neo text-xs font-bold">{user.email}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link 
                          to="/orders" 
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 font-bold uppercase text-sm hover:bg-neo-bg border-2 border-transparent hover:border-neo-black transition-colors"
                        >
                          <Package className="w-4 h-4" strokeWidth={2.5} /> My Orders
                        </Link>
                        <button 
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                            navigate('/login');
                          }}
                          className="w-full text-left flex items-center gap-3 px-3 py-2 font-bold uppercase text-sm hover:bg-neo-pink hover:text-white border-2 border-transparent hover:border-neo-black transition-colors"
                        >
                          <LogOut className="w-4 h-4" strokeWidth={2.5} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart Button — hidden on cab engine */}
              {location.pathname !== '/cab-engine' && (
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative w-10 h-10 flex items-center justify-center bg-neo-green border-3 border-neo-black text-neo-black hover:shadow-brutal-sm hover:-translate-y-[2px] hover:-translate-x-[2px] transition-all"
                >
                  <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-3 -right-3 w-6 h-6 bg-neo-yellow border-2 border-neo-black text-neo-black font-display font-black text-xs flex items-center justify-center z-10"
                      >
                        {cartCount > 9 ? '9+' : cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              )}

            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
