import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Home, Navigation, Hash, Building2, Landmark, Loader2, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DeliveryAddress = () => {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/shop';

  const [formData, setFormData] = useState({
    houseNo: '',
    street: '',
    landmark: '',
    pincode: '',
    city: '',
    state: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.address) {
      setFormData({
        houseNo: user.address.houseNo || '',
        street: user.address.street || '',
        landmark: user.address.landmark || '',
        pincode: user.address.pincode || '',
        city: user.address.city || '',
        state: user.address.state || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await updateProfile({ address: formData });
      setSuccess(true);
      setTimeout(() => {
        navigate(redirect);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate(redirect);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neo-bg bg-[radial-gradient(#121212_1px,transparent_1px)] flex items-center justify-center p-4">
        <div className="w-16 h-16 bg-neo-yellow border-4 border-neo-black flex items-center justify-center animate-spin">
          <Loader2 className="w-8 h-8 text-neo-black" strokeWidth={3} />
        </div>
      </div>
    );
  }

  const inputClass = "w-full bg-white border-3 border-neo-black py-4 pl-12 pr-4 text-neo-black font-neo font-bold text-sm outline-none focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[4px_4px_0px_#FF0073] transition-all shadow-[2px_2px_0px_#121212] mb-4 placeholder:text-gray-400";
  const iconClass = "absolute left-4 top-[17px] w-5 h-5 text-neo-black pointer-events-none";

  return (
    <div className="min-h-screen bg-neo-bg bg-[radial-gradient(#121212_1px,transparent_1px)] py-12 px-4 flex items-center justify-center" style={{ backgroundSize: '30px 30px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white border-4 border-neo-black p-8 md:p-12 shadow-brutal-xl relative"
      >
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-neo-cyan border-4 border-neo-black shadow-[4px_4px_0px_#121212] flex items-center justify-center -rotate-6">
          <MapPin className="stroke-[2.5px] w-12 h-12 text-neo-black" />
        </div>
        
        <div className="mb-10 text-center sm:text-left border-b-4 border-neo-black pb-8">
          <h1 className="font-display font-black text-4xl md:text-5xl uppercase tracking-tighter text-neo-black mb-2">TARGET<br/><span className="bg-neo-black text-white px-2 mt-1 inline-block rotate-1">COORDINATES</span></h1>
          <p className="font-neo font-bold text-sm mt-4 bg-neo-yellow border-2 border-neo-black inline-block px-3 py-1 shadow-[2px_2px_0px_#121212]">
            DEFINE YOUR SUPPLY DROP LOCATION
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            
            {/* House No */}
            <div className="relative group">
              <label className="font-display font-black text-[10px] uppercase tracking-widest bg-neo-black text-white px-1 ml-2 mb-1 inline-block">STRUCTURE ID / HOUSE NO.</label>
              <div className="relative">
                <Home className={iconClass} strokeWidth={2.5} />
                <input required name="houseNo" value={formData.houseNo} onChange={handleChange} placeholder="e.g. Sector-7G" className={inputClass} />
              </div>
            </div>

            {/* Street */}
            <div className="relative group">
              <label className="font-display font-black text-[10px] uppercase tracking-widest bg-neo-black text-white px-1 ml-2 mb-1 inline-block">VECTOR PATH / STREET</label>
              <div className="relative">
                <Navigation className={iconClass} strokeWidth={2.5} />
                <input required name="street" value={formData.street} onChange={handleChange} placeholder="e.g. Evergreen Terrace" className={inputClass} />
              </div>
            </div>

            {/* Landmark */}
            <div className="relative group">
              <label className="font-display font-black text-[10px] uppercase tracking-widest bg-neo-black text-white px-1 ml-2 mb-1 inline-block">VISUAL MARKER / LANDMARK</label>
              <div className="relative">
                <Landmark className={iconClass} strokeWidth={2.5} />
                <input name="landmark" value={formData.landmark} onChange={handleChange} placeholder="e.g. Near Power Plant" className={inputClass} />
              </div>
            </div>

            {/* Pincode */}
            <div className="relative group">
              <label className="font-display font-black text-[10px] uppercase tracking-widest bg-neo-black text-white px-1 ml-2 mb-1 inline-block">ZONE CIPHER / PINCODE</label>
              <div className="relative">
                <Hash className={iconClass} strokeWidth={2.5} />
                <input required name="pincode" value={formData.pincode} onChange={handleChange} placeholder="6 digits" pattern="[0-9]{6}" className={inputClass} />
              </div>
            </div>

            {/* City */}
            <div className="relative group">
              <label className="font-display font-black text-[10px] uppercase tracking-widest bg-neo-black text-white px-1 ml-2 mb-1 inline-block">METROPOLIS / CITY</label>
              <div className="relative">
                <Building2 className={iconClass} strokeWidth={2.5} />
                <input required name="city" value={formData.city} onChange={handleChange} placeholder="City Name" className={inputClass} />
              </div>
            </div>

            {/* State */}
            <div className="relative group">
              <label className="font-display font-black text-[10px] uppercase tracking-widest bg-neo-black text-white px-1 ml-2 mb-1 inline-block">TERRITORY / STATE</label>
              <div className="relative">
                <MapPin className={iconClass} strokeWidth={2.5} />
                <input required name="state" value={formData.state} onChange={handleChange} placeholder="State Name" className={inputClass} />
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500 border-4 border-neo-black text-white px-4 py-3 font-neo font-bold text-sm shadow-[4px_4px_0px_#121212] my-4"
              >
                ERROR: {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-4 pt-6 mt-4 border-t-4 border-neo-black border-dashed">
            <button
              type="submit"
              disabled={isSubmitting || success}
              className={`w-full py-4 text-xl font-display font-black uppercase flex items-center justify-center gap-3 border-4 border-neo-black shadow-brutal transition-all active:translate-y-1 active:translate-x-1 active:shadow-brutal-sm ${
                success 
                ? 'bg-neo-green text-neo-black' 
                : 'bg-neo-pink text-white hover:bg-neo-yellow hover:text-neo-black'
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" strokeWidth={3} />
              ) : success ? (
                <>
                  <CheckCircle2 className="w-6 h-6" strokeWidth={3} />
                  COORDINATES LOCKED
                </>
              ) : (
                <>
                  <Save className="w-6 h-6" strokeWidth={3} />
                  LOCK DELIVERY TARGET
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full py-4 font-neo font-bold text-sm uppercase underline decoration-2 decoration-neo-black hover:bg-neo-black hover:text-white transition-colors"
            >
              BYPASS CONFIGURATION (NOT RECOMMENDED)
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default DeliveryAddress;
