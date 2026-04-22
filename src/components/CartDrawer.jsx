import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartDrawer = () => {
  const navigate = useNavigate();
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!user) navigate('/login?redirect=/checkout');
    else navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-[60] bg-neo-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[440px] z-[70] flex flex-col bg-neo-bg border-l-4 border-neo-black shadow-[-16px_0px_0px_rgba(18,18,18,1)]"
          >
            {/* Header */}
            <div className="h-20 px-6 flex items-center justify-between shrink-0 border-b-4 border-neo-black bg-neo-yellow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border-3 border-neo-black flex items-center justify-center shadow-brutal-sm">
                  <ShoppingBag className="w-5 h-5 text-neo-black" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="font-display font-black text-xl uppercase tracking-tighter">Your Haul</h2>
                  <p className="font-neo text-[11px] font-bold">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 bg-white border-3 border-neo-black flex items-center justify-center shadow-brutal-sm hover:shadow-brutal hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 active:shadow-brutal-sm transition-all"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-neo-black" strokeWidth={2.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-neo-bg">
              <AnimatePresence mode="popLayout">
                {cartItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full min-h-[300px] flex flex-col items-center justify-center text-center gap-6"
                  >
                    <div className="w-24 h-24 bg-white border-4 border-neo-black shadow-brutal flex items-center justify-center -rotate-6">
                      <ShoppingBag className="w-10 h-10 text-neo-black" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="font-display font-black text-2xl uppercase mb-2">Cart is empty</p>
                      <p className="font-neo text-sm font-bold opacity-70">Go add some cool stuff.</p>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="btn-neo-cyan"
                    >
                      BROWSE SHOP
                    </button>
                  </motion.div>
                ) : (
                  cartItems.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: 50 }}
                      className="flex gap-4 p-4 bg-white border-3 border-neo-black shadow-brutal-sm"
                    >
                      {/* Image */}
                      <div className="w-20 h-20 bg-neo-gray border-2 border-neo-black shrink-0 relative overflow-hidden">
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" loading="lazy" />
                        <div className="absolute top-0 right-0 bg-neo-black text-white px-1 py-0.5 text-[8px] font-bold uppercase">{item.platform || 'PRISM'}</div>
                      </div>

                      {/* Info */}
                      <div className="flex-grow min-w-0 flex flex-col">
                        <h3 className="font-neo font-bold text-sm line-clamp-1 mb-2">{item.title}</h3>
                        
                        <div className="flex items-center justify-between mt-auto">
                          {/* Quantity Controls - Brutalist */}
                          <div className="flex items-center border-2 border-neo-black bg-neo-bg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 border-r-2 border-neo-black hover:bg-neo-black hover:text-white transition-colors"
                            >
                              <Minus className="w-4 h-4" strokeWidth={2.5} />
                            </button>
                            <span className="font-neo font-bold text-sm w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 border-l-2 border-neo-black hover:bg-neo-black hover:text-white transition-colors"
                            >
                              <Plus className="w-4 h-4" strokeWidth={2.5} />
                            </button>
                          </div>

                          {/* Price + remove */}
                          <div className="flex flex-col items-end">
                            <span className="font-display font-black text-lg">
                              ₹{(item.dynamicPrice * item.quantity).toLocaleString('en-IN')}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="font-neo text-[10px] font-bold text-neo-pink uppercase hover:underline decoration-neo-pink decoration-2 mt-1"
                            >
                              [X] REMOVE
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <AnimatePresence>
              {cartItems.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="p-6 shrink-0 bg-white border-t-4 border-neo-black"
                >
                  {/* Subtotal */}
                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center justify-between border-b-3 border-neo-black border-dashed pb-4">
                      <span className="font-display font-black text-lg uppercase">Subtotal</span>
                      <span className="font-display font-black text-3xl text-neo-pink">
                        ₹{cartTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* DPE notice */}
                  <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-neo-black bg-neo-cyan text-neo-black mb-4">
                    <Zap className="w-4 h-4 fill-neo-black" />
                    <span className="font-neo font-bold text-[10px] uppercase tracking-widest">Pricing Dynamically Verified</span>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={handleCheckout}
                    className="w-full btn-neo-pink py-4 text-xl"
                  >
                    CHECKOUT NOW <ArrowRight className="w-5 h-5 ml-2" strokeWidth={3} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
