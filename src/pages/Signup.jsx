import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, AlertCircle, Loader2, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const InputField = ({ icon: Icon, label, type, placeholder, value, onChange, rightElement }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1 mb-4">
      <label className="font-display font-black text-xs uppercase tracking-widest text-neo-black bg-neo-yellow inline-block px-1 border-2 border-neo-black shadow-[2px_2px_0px_#121212] mb-1">{label}</label>
      <div
        className="relative bg-white border-3 border-neo-black transition-all duration-200"
        style={{
          boxShadow: focused ? '4px 4px 0px 0px rgba(0,229,255,1)' : '2px 2px 0px 0px rgba(18,18,18,1)',
          transform: focused ? 'translate(-2px, -2px)' : 'none'
        }}
      >
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neo-black pointer-events-none" strokeWidth={2.5} />
        <input
          type={type}
          placeholder={placeholder}
          required
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent py-4 pl-12 pr-12 font-neo font-bold text-sm text-neo-black placeholder:text-gray-400 outline-none"
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
    </div>
  );
};

const PasswordStrength = ({ password }) => {
  const strength = !password ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const labels = ['', 'WEAK', 'OKAY', 'FORTIFIED'];
  const colors = ['', '#EF4444', '#FFD000', '#00E676'];
  if (!password) return null;
  return (
    <div className="flex items-center justify-between mt-2 border-3 border-neo-black p-1 bg-white">
      <div className="flex gap-1 flex-1 mr-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-2 flex-1 border-2 border-neo-black"
            style={{ background: i <= strength ? colors[strength] : '#E0E0E0' }} />
        ))}
      </div>
      <span className="font-display font-black text-[10px] tracking-widest shrink-0" style={{ color: strength === 1 ? '#EF4444' : '#121212' }}>
        {labels[strength]}
      </span>
    </div>
  );
};

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (!formData.name || !formData.email || !formData.password) throw new Error('Please fill in all fields');
      if (formData.password.length < 8) throw new Error('Security Key must be at least 8 chars');
      await register(formData.name, formData.email, formData.password);
      navigate('/address');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const perks = ['REAL-TIME SCRAPING', 'ALGORITHMIC DEALS', 'UNLIMITED ACCESS'];

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-16 bg-neo-bg bg-[radial-gradient(#121212_1px,transparent_1px)]" style={{ backgroundSize: '30px 30px' }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white border-4 border-neo-black p-8 shadow-brutal-xl">
          {/* Header */}
          <div className="mb-6 border-b-4 border-neo-black pb-6 text-center">
            <h1 className="font-display font-black text-4xl uppercase tracking-tighter mb-2">JOIN PRISM</h1>
            <p className="font-neo font-bold text-sm bg-neo-pink text-white inline-block px-2 py-0.5 shadow-[2px_2px_0px_#121212]">INITIATE PROTOCOL</p>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-1 gap-2 mb-6 border-4 border-neo-black p-2 bg-neo-cyan">
            {perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-2 bg-white border-2 border-neo-black p-2 shadow-brutal-sm">
                <div className="w-5 h-5 bg-neo-green border-2 border-neo-black flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-neo-black" strokeWidth={4} />
                </div>
                <p className="font-display font-black text-xs uppercase tracking-wider">{perk}</p>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="flex items-center gap-3 p-3 bg-red-500 border-3 border-neo-black text-white font-neo font-bold text-sm shadow-[2px_2px_0px_#121212]">
                  <AlertCircle className="w-5 h-5" strokeWidth={2.5} /> {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <InputField
              icon={User} label="OPERATOR ID" type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <InputField
              icon={Mail} label="EMAIL" type="email"
              placeholder="operator@prism.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <div className="mb-6">
              <InputField
                icon={Lock} label="PASSPHRASE" type={showPw ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                rightElement={
                  <button type="button" onClick={() => setShowPw(!showPw)} className="text-neo-black hover:bg-neo-pink hover:text-white p-1 transition-colors border-2 border-transparent hover:border-neo-black rounded-sm">
                    {showPw ? <EyeOff className="w-5 h-5" strokeWidth={2.5} /> : <Eye className="w-5 h-5" strokeWidth={2.5} />}
                  </button>
                }
              />
              <PasswordStrength password={formData.password} />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-neo-yellow text-xl py-4 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin text-neo-black" strokeWidth={3} />
              ) : (
                <> ENGAGE SYSTEM <ArrowRight className="w-5 h-5" strokeWidth={3} /> </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-3 border-neo-black text-center">
            <p className="font-neo font-bold text-sm uppercase">
              ALREADY REGISTERED? <br />
              <Link to={`/login${location.search}`} className="inline-block mt-2 bg-neo-cyan border-2 border-neo-black px-3 py-1 shadow-brutal-sm hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
                AUTHENTICATE NOW →
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
