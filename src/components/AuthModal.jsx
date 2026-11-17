import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Phone, Globe, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth, getLoginHistory, removeSavedAccount } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { isValidIndianPhone } from '../utils/formatters';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab, 
    setAuthModalTab, 
    login, 
    register, 
    googleLogin 
  } = useAuth();
  const { showToast } = useBooking();

  // Primary form state - completely clean and blank for every new user
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('India');

  // Async & UI state
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Login history stored strictly on this device
  const [historyState, setHistoryState] = useState({});

  // Refresh login history whenever modal opens
  const refreshHistory = () => {
    try {
      const hist = getLoginHistory();
      setHistoryState(hist || {});
    } catch {
      setHistoryState({});
    }
  };

  // Reset form and view state on modal open or tab change
  useEffect(() => {
    setErrorMessage('');
    if (isAuthModalOpen) {
      refreshHistory();
    }
  }, [authModalTab, isAuthModalOpen]);

  // Load Google Identity Services script if not already present
  useEffect(() => {
    if (window.google?.accounts?.id || window.google?.accounts?.oauth2) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

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

  // Filter accounts used on this specific device that have logged in at least 2 times
  // 1st time users or users with < 2 logins see zero saved emails
  const eligibleAccounts = Object.values(historyState).filter(
    (acc) => (acc.loginCount || 0) >= 2
  );

  const handleRemoveAccount = (targetEmail) => {
    removeSavedAccount(targetEmail);
    refreshHistory();
    if (email.toLowerCase().trim() === targetEmail.toLowerCase().trim()) {
      setEmail('');
      setPassword('');
    }
  };

  // Real Google Sign-In trigger
  const handleGoogleClick = async () => {
    setErrorMessage('');
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // Check if Google Client ID is configured
    if (!googleClientId || googleClientId.includes('your-google-client-id') || googleClientId.trim() === '') {
      setErrorMessage(
        'Google Sign-In is not configured. Please add VITE_GOOGLE_CLIENT_ID to your environment variables to enable Google authentication.'
      );
      return;
    }

    // Check if Google Identity Services library is loaded
    if (!window.google?.accounts?.oauth2) {
      setErrorMessage('Google authentication service is currently loading. Please check your connection and try again.');
      return;
    }

    setSocialLoading(true);

    try {
      // Initiate Google OAuth 2.0 Token Client with account selector
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setSocialLoading(false);
            if (tokenResponse.error === 'access_denied') {
              setErrorMessage('Google sign-in was cancelled.');
            } else {
              setErrorMessage(`Google authentication error: ${tokenResponse.error}`);
            }
            return;
          }

          if (!tokenResponse.access_token) {
            setSocialLoading(false);
            setErrorMessage('No authentication token received from Google.');
            return;
          }

          try {
            // Retrieve verified user profile from Google userinfo API
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
            });

            if (!userInfoRes.ok) {
              throw new Error('Failed to retrieve verified user profile from Google.');
            }

            const profile = await userInfoRes.json();

            // Submit verified Google identity to Veloura backend
            const res = await googleLogin({
              profile: {
                name: profile.name,
                email: profile.email,
                avatar: profile.picture,
                googleId: profile.sub
              },
              accessToken: tokenResponse.access_token
            });

            showToast(`Welcome, ${res.user.name}. Signed in with Google.`);
            closeAuthModal();
          } catch (err) {
            setErrorMessage(err.message || 'Google authentication failed.');
          } finally {
            setSocialLoading(false);
          }
        },
        error_callback: (error) => {
          setSocialLoading(false);
          if (error?.type === 'popup_closed') {
            setErrorMessage('Google sign-in window was closed.');
          } else {
            setErrorMessage(error?.message || 'Google sign-in cancelled.');
          }
        }
      });

      // Display Google's official account selection screen
      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      setSocialLoading(false);
      setErrorMessage(err.message || 'Could not initiate Google sign-in.');
    }
  };

  // Apple ID trigger
  const handleAppleClick = () => {
    setErrorMessage('');
    setErrorMessage('Apple ID authentication is not configured for this domain.');
  };

  // Primary email & password submission
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

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl border border-sand-300 shadow-2xl p-6 sm:p-8 z-10 overflow-hidden my-auto"
        >
          {/* Subtle Ambient Glow */}
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
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-luxury text-gold-600 font-semibold mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Veloura Guest Sanctuary</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-forest-950 font-normal">
              {authModalTab === 'login'
                ? 'Sign In to Your Itinerary'
                : 'Create Guest Privilege Account'}
            </h3>
            <p className="mt-1 text-xs text-forest-700/80 font-sans">
              {authModalTab === 'login'
                ? 'Access your private reservations and sanctuary preferences.'
                : 'Enjoy effortless reservation management and island privileges.'}
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* RETURNING USER CHIP: ONLY shown on this device if logged in 2 or more times */}
          {eligibleAccounts.length > 0 && authModalTab === 'login' && (
            <div className="mb-5 p-3 bg-white/80 border border-sand-300 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-forest-700 font-bold">
                  Welcome back
                </span>
                <span className="text-[10px] text-forest-500">
                  Recent account
                </span>
              </div>
              <div className="space-y-1.5">
                {eligibleAccounts.map((acc) => (
                  <div
                    key={acc.email}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#FAF7F2] border border-sand-200 hover:border-gold-500 transition-all group"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setEmail(acc.email);
                        setPassword('');
                      }}
                      className="flex items-center gap-2.5 text-left flex-1"
                    >
                      {acc.avatar ? (
                        <img src={acc.avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-sand-200" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-forest-900 text-gold text-xs font-semibold flex items-center justify-center">
                          {acc.name?.charAt(0) || 'G'}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-forest-950 group-hover:text-gold-700 transition-colors">
                          {acc.name}
                        </p>
                        <p className="text-[11px] text-forest-600 font-sans">
                          {acc.email}
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveAccount(acc.email);
                      }}
                      className="p-1 text-forest-400 hover:text-red-500 transition-colors ml-2"
                      title="Forget account on this device"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
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
                      placeholder="Your Name"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand-300 rounded-2xl text-xs text-forest-950 placeholder:text-forest-400 focus:outline-none focus:border-gold-500 shadow-xs"
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
                        className="w-full pl-10 pr-3 py-2.5 bg-white border border-sand-300 rounded-2xl text-xs text-forest-950 placeholder:text-forest-400 focus:outline-none focus:border-gold-500 shadow-xs"
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
                        className="w-full pl-10 pr-3 py-2.5 bg-white border border-sand-300 rounded-2xl text-xs text-forest-950 placeholder:text-forest-400 focus:outline-none focus:border-gold-500 shadow-xs"
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
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand-300 rounded-2xl text-xs text-forest-950 placeholder:text-forest-400 focus:outline-none focus:border-gold-500 shadow-xs"
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
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand-300 rounded-2xl text-xs text-forest-950 placeholder:text-forest-400 focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>
            </div>

            {/* Primary Pill Button: Sign in → */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 bg-[#111827] hover:bg-forest-950 disabled:opacity-60 text-white rounded-full text-xs font-semibold tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{authModalTab === 'login' ? 'Sign in' : 'Create account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider: Or continue with */}
          <div className="relative flex items-center justify-center my-5">
            <div className="border-t border-sand-300 w-full" />
            <span className="bg-[#FAF7F2] px-3 text-xs text-forest-700/60 font-sans whitespace-nowrap">
              Or continue with
            </span>
            <div className="border-t border-sand-300 w-full" />
          </div>

          {/* Side-by-side Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={loading || socialLoading}
              className="py-2.5 px-3 rounded-xl border border-sand-300 bg-white hover:bg-sand-50/80 text-forest-950 text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-xs hover:border-gold-500 active:scale-[0.99] disabled:opacity-60"
            >
              {socialLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-forest-900 border-t-transparent rounded-full animate-spin" />
              ) : (
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
              )}
              <span className="truncate">{socialLoading ? 'Connecting...' : 'Continue with Google'}</span>
            </button>

            {/* Apple ID */}
            <button
              type="button"
              onClick={handleAppleClick}
              disabled={loading || socialLoading}
              className="py-2.5 px-3 rounded-xl border border-sand-300 bg-white hover:bg-sand-50/80 text-forest-950 text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-xs hover:border-gold-500 active:scale-[0.99] disabled:opacity-60"
            >
              <svg className="w-4 h-4 fill-current text-forest-950 flex-shrink-0" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.59-7.71-11.72-14-4.58-7.07-8.24-15.04-10.99-23.91-2.76-8.88-4.14-17.38-4.14-25.5 0-13.44 3.37-24.8 10.12-34.08 6.74-9.28 15.2-13.97 25.38-14.07 5.43 0 11.25 1.52 17.47 4.57 6.22 3.05 10.16 4.62 11.83 4.7 1.45 0 5.61-1.63 12.5-4.9 6.89-3.27 12.82-4.7 17.8-4.3 13.25 1.04 23.36 5.86 30.33 14.46-11.75 7.07-17.51 16.89-17.27 29.46.24 9.77 3.97 17.97 11.19 24.6 7.22 6.63 15.77 10.37 25.66 11.22-2.17 6.74-4.78 13.3-7.83 19.68zM119.22 31.84c0-7.39 2.65-14.15 7.95-20.28 5.3-6.13 11.78-9.85 19.44-11.16.22 1.3.33 2.45.33 3.44 0 7.39-2.72 14.31-8.16 20.76-5.44 6.45-12.01 10.09-19.7 10.92-.11-1.19-.17-2.42-.17-3.68z"/>
              </svg>
              <span className="truncate">Apple ID</span>
            </button>
          </div>

          {/* Footer switch */}
          <div className="mt-6 text-center text-xs text-forest-700/80">
            {authModalTab === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('register');
                    setErrorMessage('');
                  }}
                  className="font-bold text-forest-950 hover:underline ml-1"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('login');
                    setErrorMessage('');
                  }}
                  className="font-bold text-forest-950 hover:underline ml-1"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
