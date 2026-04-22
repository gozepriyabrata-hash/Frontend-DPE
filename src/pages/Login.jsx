import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
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

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/shop';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (!formData.email || !formData.password) throw new Error('Please fill in all fields');
      const loggedInUser = await login(formData.email, formData.password);
      if (redirectPath === '/checkout' && (!loggedInUser.address || !loggedInUser.address.street)) {
        navigate('/address?redirect=/checkout');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="mb-8 border-b-4 border-neo-black pb-6 text-center">
            <h1 className="font-display font-black text-4xl uppercase tracking-tighter mb-2">SYSTEM LOGIN</h1>
            <p className="font-neo font-bold text-sm bg-neo-black text-white inline-block px-2 py-0.5">AUTHENTICATE TO PROCEED</p>
          </div>

          {/* Error */}
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
              icon={Mail} label="EMAIL" type="email"
              placeholder="operator@prism.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <InputField
              icon={Lock} label="PASSPHRASE" type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              rightElement={
                <button type="button" onClick={() => setShowPw(!showPw)} className="text-neo-black hover:text-neo-pink p-1 transition-colors border-2 border-transparent hover:border-neo-black rounded-sm">
                  {showPw ? <EyeOff className="w-5 h-5" strokeWidth={2.5} /> : <Eye className="w-5 h-5" strokeWidth={2.5} />}
                </button>
              }
            />

            <div className="flex justify-end mb-6">
              <button type="button" className="font-neo font-bold text-xs uppercase underline decoration-2 decoration-neo-pink hover:bg-neo-pink hover:text-white transition-colors">
                FORGOT SECURITY KEY?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-neo-cyan text-xl py-4 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin text-neo-black" strokeWidth={3} />
              ) : (
                <> ENTER SYSTEM <ArrowRight className="w-5 h-5" strokeWidth={3} /> </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-3 border-neo-black text-center">
            <p className="font-neo font-bold text-sm uppercase">
              NO CLEARANCE YET? <br />
              <Link to={`/signup${location.search}`} className="inline-block mt-2 bg-neo-yellow border-2 border-neo-black px-3 py-1 shadow-brutal-sm hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
                REQUEST ACCESS →
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
