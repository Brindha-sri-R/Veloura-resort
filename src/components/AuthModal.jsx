import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Phone, Globe, Sparkles, ArrowRight, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { isValidIndianPhone } from '../utils/formatters';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, setAuthModalTab, login, register, googleLogin } = useAuth();
  const { showToast } = useBooking();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('India');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  const googleButtonRef = useRef(null);

  // Reset form when modal opens or tab changes
  useEffect(() => {
    setErrorMessage('');
    setShowGoogleChooser(false);
  }, [authModalTab, isAuthModalOpen]);

  // Load Google Identity Services script if not already present
  useEffect(() => {
    if (window.google?.accounts?.id) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      // Keep script cached in document
    };
  }, []);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        if (showGoogleChooser) {
          setShowGoogleChooser(false);
        } else {
          closeAuthModal();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, showGoogleChooser, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setGoogleLoading(true);

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // If real Google Client ID is configured and GIS loaded, try real Google Prompt
    if (googleClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            if (response.credential) {
              try {
                const res = await googleLogin({ credential: response.credential });
                showToast(`Welcome, ${res.user.name}. Signed in with Google.`);
              } catch (err) {
                setErrorMessage(err.message || 'Google sign-in failed.');
              } finally {
                setGoogleLoading(false);
              }
            }
          }
        });

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback to seamless Google chooser
            setShowGoogleChooser(true);
            setGoogleLoading(false);
          }
        });
        return;
      } catch (err) {
        console.warn('Google One Tap init fallback:', err);
      }
    }

    // Default seamless luxury Google chooser for immediate sign-in
    setShowGoogleChooser(true);
    setGoogleLoading(false);
  };

  // Process chosen Google profile
  const handleChooseGoogleAccount = async (profile) => {
    setGoogleLoading(true);
    setErrorMessage('');
    try {
      const res = await googleLogin({ profile });
      showToast(`Welcome to Veloura, ${res.user.name}. Signed in with Google.`);
      setShowGoogleChooser(false);
    } catch (err) {
      setErrorMessage(err.message || 'Google authentication failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleCustomGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!customGoogleEmail.trim() || !customGoogleEmail.includes('@')) {
      setErrorMessage('Please provide a valid Google email address.');
      return;
    }
    const profileName = customGoogleName.trim() || customGoogleEmail.split('@')[0];
    await handleChooseGoogleAccount({
      name: profileName,
      email: customGoogleEmail.trim().toLowerCase(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}&background=123D35&color=C5A77A`,
      googleId: `google_sim_${Date.now()}`
    });
  };

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
              {showGoogleChooser
                ? 'Sign in with Google'
                : authModalTab === 'login'
                ? 'Sign In to Your Itinerary'
                : 'Create Guest Privilege Account'}
            </h3>
            <p className="mt-1.5 text-xs text-forest-700/80 font-sans">
              {showGoogleChooser
                ? 'Choose a Google account to continue to Veloura Luxury Resort.'
                : authModalTab === 'login'
                ? 'Access your private reservations, concierge notes, and sanctuary preferences.'
                : 'Enjoy effortless reservation management and bespoke island host arrangements.'}
            </p>
          </div>

          {/* Google Account Chooser View */}
          {showGoogleChooser ? (
            <div className="space-y-4">
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase tracking-wider text-forest-600 font-semibold block">
                  Select Google Account
                </span>

                {/* Pre-configured Quick Accounts */}
                <button
                  type="button"
                  disabled={googleLoading}
                  onClick={() => handleChooseGoogleAccount({
                    name: 'Brindha Sri',
                    email: 'brindhas085@gmail.com',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                    googleId: 'google_brindha_085'
                  })}
                  className="w-full p-3.5 bg-white hover:bg-sand-100/80 rounded-2xl border border-sand-300 hover:border-gold-500 transition-all flex items-center justify-between text-left shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                      alt="Avatar"
                      className="w-9 h-9 rounded-full object-cover border border-sand-200"
                    />
                    <div>
                      <p className="text-xs font-semibold text-forest-950 group-hover:text-gold-700 transition-colors">
                        Brindha Sri
                      </p>
                      <p className="text-[11px] text-forest-600 font-sans">
                        brindhas085@gmail.com
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-forest-400 group-hover:text-gold-600 transition-colors" />
                </button>

                <button
                  type="button"
                  disabled={googleLoading}
                  onClick={() => handleChooseGoogleAccount({
                    name: 'Priya Sharma',
                    email: 'priya.sharma@gmail.com',
                    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
                    googleId: 'google_priya_sharma'
                  })}
                  className="w-full p-3.5 bg-white hover:bg-sand-100/80 rounded-2xl border border-sand-300 hover:border-gold-500 transition-all flex items-center justify-between text-left shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                      alt="Avatar"
                      className="w-9 h-9 rounded-full object-cover border border-sand-200"
                    />
                    <div>
                      <p className="text-xs font-semibold text-forest-950 group-hover:text-gold-700 transition-colors">
                        Priya Sharma
                      </p>
                      <p className="text-[11px] text-forest-600 font-sans">
                        priya.sharma@gmail.com
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-forest-400 group-hover:text-gold-600 transition-colors" />
                </button>
              </div>

              {/* Or enter any Gmail */}
              <form onSubmit={handleCustomGoogleSubmit} className="pt-2 border-t border-sand-200 space-y-3">
                <span className="text-[10px] uppercase tracking-wider text-forest-600 font-semibold block">
                  Or Sign In with Another Google Email
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-sand-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-gold-500"
                  />
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-sand-300 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={googleLoading}
                  className="w-full py-2.5 bg-forest-900 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  {googleLoading ? (
                    <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Continue with this Google Account</span>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setShowGoogleChooser(false)}
                  className="text-xs text-forest-600 hover:text-forest-950 underline underline-offset-2"
                >
                  ← Back to Email Sign In
                </button>
              </div>
            </div>
          ) : (
            <>
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

              {/* Google Sign In Button */}
              <div className="mb-5">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading || googleLoading}
                  className="w-full py-3 px-4 rounded-2xl bg-white border border-sand-300 hover:border-gold-500 hover:bg-sand-50/80 text-forest-950 text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60"
                >
                  {/* Official Google 'G' SVG Logo */}
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{googleLoading ? 'Signing in with Google...' : 'Continue with Google'}</span>
                </button>

                {/* Elegant Divider */}
                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-sand-300 w-full" />
                  <span className="bg-[#FAF7F2] px-3 text-[10px] uppercase tracking-luxury text-forest-700/60 font-semibold whitespace-nowrap">
                    or continue with email
                  </span>
                  <div className="border-t border-sand-300 w-full" />
                </div>
              </div>

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
                      placeholder="name@domain.com"
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
                      <span>{authModalTab === 'login' ? 'Sign In with Email' : 'Confirm Registration'}</span>
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
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
