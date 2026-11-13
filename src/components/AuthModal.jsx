import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Phone, Globe, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { isValidIndianPhone } from '../utils/formatters';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, setAuthModalTab, login, register } = useAuth();
  const { showToast } = useBooking();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('India');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Reset form when modal opens or tab changes
  useEffect(() => {
    setErrorMessage('');
  }, [authModalTab, isAuthModalOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (authModalTab === 'login') {
        if (!email.trim() || !password) {
          setErrorMessage('Please provide both your email and password.');
          setLoading(false);
          return;
        }
        const res = await login(email, password);
        showToast(`Welcome back, ${res.user.name}. Your sanctuary awaits.`);
      } else {
        if (!name.trim() || !email.trim() || !password) {
          setErrorMessage('Please complete all required fields.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        if (phone && !isValidIndianPhone(phone)) {
          setErrorMessage('Please provide a valid 10-digit Indian mobile number (+91 98765 43210).');
          setLoading(false);
          return;
        }
        const res = await register({ name, email, password, phone, country });
        showToast(`Welcome to Veloura, ${res.user.name}. Your guest privileges are active.`);
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-forest-950/80 backdrop-blur-sm"
          onClick={closeAuthModal}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl border border-sand-300 shadow-2xl p-6 sm:p-8 z-10 overflow-hidden my-auto"
        >
          {/* Subtle Decorative Background Seal */}
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-gold/5 blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-full text-forest-700/70 hover:text-forest-950 hover:bg-sand-200/60 transition-colors focus:outline-none"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-luxury text-gold-600 font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Veloura Guest Sanctuary</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-forest-950 font-normal">
              {authModalTab === 'login' ? 'Sign In to Your Itinerary' : 'Create Guest Privilege Account'}
            </h3>
            <p className="mt-1.5 text-xs text-forest-700/80 font-sans">
              {authModalTab === 'login'
                ? 'Access your private reservations, concierge notes, and sanctuary preferences.'
                : 'Enjoy effortless reservation management and bespoke island host arrangements.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-sand-300 mb-6">
            <button
              type="button"
              onClick={() => { setAuthModalTab('login'); setErrorMessage(''); }}
              className={`flex-1 pb-3 text-xs uppercase tracking-luxury font-semibold transition-all relative ${
                authModalTab === 'login'
                  ? 'text-forest-950 font-bold'
                  : 'text-forest-700/60 hover:text-forest-950'
              }`}
            >
              Sign In
              {authModalTab === 'login' && (
                <motion.div
                  layoutId="auth-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-600 rounded-full"
                />
              )}
            </button>
            <button
              type="button"
              onClick={() => { setAuthModalTab('register'); setErrorMessage(''); }}
              className={`flex-1 pb-3 text-xs uppercase tracking-luxury font-semibold transition-all relative ${
                authModalTab === 'register'
                  ? 'text-forest-950 font-bold'
                  : 'text-forest-700/60 hover:text-forest-950'
              }`}
            >
              Create Account
              {authModalTab === 'register' && (
                <motion.div
                  layoutId="auth-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-600 rounded-full"
                />
              )}
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalTab === 'register' && (
              <>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-forest-800 font-medium mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand-300 rounded-2xl text-xs text-forest-950 placeholder:text-forest-400 focus:outline-none focus:border-gold-500 shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-forest-800 font-medium mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-500" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-3 py-2.5 bg-white border border-sand-300 rounded-2xl text-xs text-forest-950 placeholder:text-forest-400 focus:outline-none focus:border-gold-500 shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-forest-800 font-medium mb-1">
                      Country
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-500" />
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="India"
                        className="w-full pl-10 pr-3 py-2.5 bg-white border border-sand-300 rounded-2xl text-xs text-forest-950 placeholder:text-forest-400 focus:outline-none focus:border-gold-500 shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-forest-800 font-medium mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eleanor@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand-300 rounded-2xl text-xs text-forest-950 placeholder:text-forest-400 focus:outline-none focus:border-gold-500 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-forest-800 font-medium mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand-300 rounded-2xl text-xs text-forest-950 placeholder:text-forest-400 focus:outline-none focus:border-gold-500 shadow-sm"
                />
              </div>
              <p className="mt-1 text-[10px] text-forest-500">Minimum 6 characters.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-forest-900 hover:bg-forest-800 disabled:opacity-60 text-white rounded-full text-xs font-semibold uppercase tracking-luxury transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform active:scale-95"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{authModalTab === 'login' ? 'Sign In to Account' : 'Confirm Registration'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-sand-300 text-center">
            {authModalTab === 'login' ? (
              <p className="text-xs text-forest-700">
                New guest to Veloura?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthModalTab('register'); setErrorMessage(''); }}
                  className="text-gold-700 hover:text-gold-800 font-semibold underline underline-offset-2 ml-1"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p className="text-xs text-forest-700">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthModalTab('login'); setErrorMessage(''); }}
                  className="text-gold-700 hover:text-gold-800 font-semibold underline underline-offset-2 ml-1"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

