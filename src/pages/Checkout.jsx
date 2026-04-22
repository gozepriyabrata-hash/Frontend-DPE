import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShoppingBag, 
  ChevronRight,
  ShieldCheck,
  CreditCard,
  MapPin,
  Home,
  Navigation,
  ArrowLeft
} from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [checkoutState, setCheckoutState] = useState('confirm');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cartItems.length === 0 && checkoutState !== 'success') {
      const timer = setTimeout(() => navigate('/shop'), 3000);
      return () => clearTimeout(timer);
    }
  }, [cartItems.length, checkoutState, navigate]);

  const handlePlaceOrder = async () => {
    setCheckoutState('processing');
    setError(null);
    
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          title: item.title,
          thumbnail: item.thumbnail,
          quantity: item.quantity,
          priceAtPurchase: item.dynamicPrice,
          basePrice: item.basePrice
        })),
        totalAmount: cartTotal
      };

      const res = await orderService.createOrder(orderData);
      setOrder(res.data);
      clearCart();
      setCheckoutState('success');
    } catch (err) {
      console.error('Checkout failed:', err);
      setError(err.response?.data?.message || 'Failed to process order. Please try again.');
      setCheckoutState('confirm');
    }
  };

  if (!user && checkoutState !== 'success') return null;

  return (
    <div className="min-h-screen bg-neo-bg px-4 py-8 md:py-16 pb-32">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {checkoutState === 'confirm' && (
            <motion.div 
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              {/* Left: Address Selection */}
              <div>
                <div className="mb-10 border-b-6 border-neo-black pb-6 border-dashed">
                  <Link to="/shop" className="inline-flex items-center gap-2 font-display font-black text-xs uppercase bg-white border-2 border-neo-black px-3 py-1 shadow-brutal-sm hover:-translate-y-1 hover:shadow-brutal transition-all mb-8">
                    <ArrowLeft className="w-4 h-4" /> ABORT TO SHOP
                  </Link>
                  <h1 className="text-5xl lg:text-7xl font-display font-black tracking-tighter uppercase mb-4 leading-[0.85] text-neo-black">
                    SYSTEM<br />
                    <span className="bg-neo-black text-white px-2 mt-1 inline-block">CHECKOUT</span>
                  </h1>
                </div>

                <div className="bg-white border-4 border-neo-black p-8 shadow-brutal-lg relative">
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-neo-pink border-4 border-neo-black shadow-[4px_4px_0px_#121212] flex items-center justify-center rotate-12">
                    <MapPin className="w-10 h-10 text-white" strokeWidth={2.5} />
                  </div>
                  
                  <h3 className="font-neo font-bold text-xs uppercase tracking-widest text-neo-black bg-neo-yellow inline-block px-2 border-2 border-neo-black shadow-[2px_2px_0px_#121212] mb-8">
                    TARGET DESTINATION
                  </h3>

                  {user.address && user.address.street ? (
                    <div className="space-y-8">
                      <div className="bg-neo-gray border-3 border-neo-black p-6 shadow-[4px_4px_0px_#121212]">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-neo-cyan border-2 border-neo-black shadow-[2px_2px_0px_#121212] flex items-center justify-center shrink-0">
                            <Home className="w-6 h-6 text-neo-black" strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className="font-display font-black text-xl uppercase leading-tight">{user.address.houseNo}, {user.address.street}</p>
                            <p className="font-neo font-bold text-sm mt-1">{user.address.city}, {user.address.state} - {user.address.pincode}</p>
                            {user.address.landmark && (
                              <p className="text-xs font-bold bg-white border-2 border-neo-black px-2 mt-3 inline-block">
                                LANDMARK: {user.address.landmark.toUpperCase()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t-3 border-neo-black border-dashed">
                        <button 
                          onClick={handlePlaceOrder}
                          disabled={cartItems.length === 0}
                          className="flex-grow btn-neo-green text-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          CONFIRM PROTOCOL <ArrowRight className="w-6 h-6" strokeWidth={3} />
                        </button>
                        <Link 
                          to="/address?redirect=/checkout"
                          className="btn-neo-yellow flex items-center justify-center whitespace-nowrap px-8"
                        >
                          MODIFY COORDS
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 border-4 border-neo-black border-dashed bg-neo-gray">
                      <p className="font-display font-black text-2xl uppercase mb-6 opacity-50">LOCATION UNKNOWN</p>
                      <Link to="/address?redirect=/checkout" className="btn-neo-cyan px-10 inline-flex items-center justify-center gap-2">
                        INPUT COORDINATES <ChevronRight className="w-5 h-5" strokeWidth={3} />
                      </Link>
                    </div>
                  )}
                  
                  {error && (
                    <div className="mt-8 bg-red-500 border-4 border-neo-black text-white p-4 font-neo font-bold shadow-[4px_4px_0px_#121212]">
                      ERROR: {error}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-8 bg-white border-4 border-neo-black p-4 shadow-brutal w-max mx-auto">
                  <CreditCard className="w-6 h-6 text-neo-pink" strokeWidth={2.5} />
                  <p className="font-display font-black text-sm uppercase tracking-widest">PAY ON DELIVERY ACTIVE</p>
                </div>
              </div>

              {/* Right: Summary Card */}
              <div className="lg:pt-28">
                <div className="bg-neo-black text-white border-4 border-neo-black shadow-brutal p-8 sticky top-8">
                  <div className="absolute -top-4 -left-4 bg-neo-yellow border-4 border-neo-black p-2 shadow-[4px_4px_0px_#121212] rotate-6 text-neo-black">
                    <ShoppingBag className="w-8 h-8" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-neo font-bold text-xs uppercase bg-white text-neo-black px-2 py-0.5 inline-block mb-8">TRANSACTION MANIFEST</h3>
                  <div className="space-y-6 max-h-[45vh] overflow-y-auto mb-8 pr-4 custom-scrollbar-light">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 p-3 border-2 border-white/20 bg-white/5">
                        <div className="w-16 h-16 bg-white border-2 border-neo-black shadow-[2px_2px_0px_#121212] shrink-0 p-1">
                          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-display font-black text-sm uppercase truncate mb-1">{item.title}</h4>
                          <p className="font-neo font-bold text-[10px] uppercase text-gray-400 mb-1">QTY: {item.quantity}</p>
                          <div className="flex items-end gap-2">
                            <span className="font-display font-black text-lg text-neo-yellow leading-none">₹{item.dynamicPrice.toLocaleString('en-IN')}</span>
                            <span className="text-[10px] text-gray-500 line-through stroke-2">₹{item.basePrice.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-6 border-t-4 border-white/20 border-dashed space-y-4">
                    <div className="flex justify-between items-center text-gray-300">
                      <span className="font-neo font-bold text-[10px] uppercase tracking-widest">SUBTOTAL</span>
                      <span className="font-display font-black">₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-neo font-bold text-[10px] uppercase tracking-widest text-gray-300">FREIGHT</span>
                      <span className="bg-neo-green font-display font-black text-neo-black px-2 py-0.5 text-[10px]">COMPLIMENTARY</span>
                    </div>
                    <div className="flex justify-between items-end pt-6 border-t-2 border-white/20">
                      <span className="font-display font-black uppercase text-sm">FINAL DEBIT</span>
                      <span className="text-4xl sm:text-5xl font-display font-black text-neo-cyan leading-none">
                        ₹{cartTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {checkoutState === 'processing' && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center"
            >
              <div className="relative w-40 h-40 mb-12">
                <motion.div 
                  className="absolute inset-0 border-8 border-neo-black border-r-neo-pink bg-neo-yellow shadow-brutal rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="w-16 h-16 text-neo-black" strokeWidth={2.5} />
                </div>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-black uppercase mb-4 text-neo-black">COMPILING LEDGER...</h2>
              <p className="font-neo font-bold text-lg bg-white border-4 border-neo-black px-4 py-2 shadow-[4px_4px_0px_#121212]">
                SECURING DYNAMIC SNAPSHOT PRICE
              </p>
            </motion.div>
          )}

          {checkoutState === 'success' && order && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto py-16"
            >
              <div className="text-center mb-16">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 12, bounce: 0.6 }}
                  className="w-32 h-32 bg-neo-green border-4 border-neo-black shadow-brutal flex items-center justify-center mx-auto mb-10 -rotate-3 hover:rotate-3 transition-transform cursor-crosshair"
                >
                  <CheckCircle2 className="w-16 h-16 text-neo-black" strokeWidth={3} />
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase mb-6 text-neo-black leading-[0.9]">
                  TRANSACTION<br /> <span className="bg-neo-black text-white px-4">FINALIZED</span>
                </h1>
                <p className="font-neo font-bold text-lg max-w-xl mx-auto bg-white border-2 border-neo-black px-4 py-2 inline-block shadow-[4px_4px_0px_#121212]">
                  CONTRACT <span className="text-neo-pink font-black text-xl">#{order._id.slice(-8).toUpperCase()}</span> HAS BEEN LOGGED TO THE LEDGER.
                </p>
              </div>

              <div className="bg-white border-4 border-neo-black p-8 md:p-12 shadow-brutal-xl mb-16 relative">
                <div className="absolute -top-6 -left-6 bg-neo-yellow border-4 border-neo-black p-4 shadow-[4px_4px_0px_#121212] -rotate-6">
                  <ShoppingBag className="w-10 h-10 text-neo-black" strokeWidth={2.5} />
                </div>
                <h3 className="font-neo font-bold text-xs uppercase tracking-widest bg-neo-black text-white px-2 py-0.5 inline-block mb-10 ml-8">FINAL ACQUISITION SUMMARY</h3>
                
                <div className="space-y-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-4 border-3 border-neo-black bg-neo-gray">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-20 h-20 bg-white border-3 border-neo-black p-2 shrink-0">
                          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="font-display font-black text-lg uppercase truncate max-w-[280px]">{item.title}</p>
                          <p className="font-neo font-bold text-[10px] uppercase bg-neo-black text-white px-2 py-0.5 inline-block mt-1">QTY: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto bg-white border-2 border-neo-black p-3 sm:bg-transparent sm:border-0 sm:p-0">
                        <p className="font-display font-black text-2xl text-neo-black">₹{(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}</p>
                        {item.basePrice > item.priceAtPurchase && (
                          <p className="text-[10px] text-white bg-neo-green border-2 border-neo-black px-1 font-bold uppercase tracking-widest mt-1 inline-block">
                            -₹{(item.basePrice - item.priceAtPurchase).toLocaleString('en-IN')} EFFICIENCY SAVING
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-8 border-t-6 border-neo-black border-dashed flex flex-col sm:flex-row items-start sm:items-end justify-between mt-8">
                    <span className="font-neo font-bold text-xs uppercase tracking-widest bg-neo-pink text-white px-2 py-0.5 mb-2 sm:mb-0">GRAND TOTAL DEBITED</span>
                    <span className="text-5xl font-display font-black text-neo-black leading-none bg-neo-yellow border-4 border-neo-black p-2 shadow-[4px_4px_0px_#121212] -rotate-1">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/orders" className="btn-neo-cyan text-xl flex items-center justify-center gap-3">
                  ACCESS RECORDS <ArrowRight className="w-6 h-6" strokeWidth={3} />
                </Link>
                <Link to="/shop" className="btn-neo-yellow text-xl flex items-center justify-center gap-2">
                  RETURN TO MARKET
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Checkout;
