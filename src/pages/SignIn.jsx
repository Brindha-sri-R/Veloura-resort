import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, User, Phone, Globe, Sparkles, ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth, getLoginHistory, removeSavedAccount } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { isValidIndianPhone } from '../utils/formatters';

export default function SignIn() {
  const { user, login, register, googleLogin, appleLogin } = useAuth();
  const { showToast } = useBooking();
  const navigate = useNavigate();
  const location = useLocation();

  // Tab: 'login' | 'register'
  const [tab, setTab] = useState('login');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('India');

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field errors
  const [fieldErrors, setFieldErrors] = useState({});

  // Status
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState(
    () => location.state?.message || (location.state?.from ? 'Please sign in to continue.' : '')
  );

  // Destination to return after successful login (preserve pathname + query + hash)
  const fromLocation = location.state?.from;
  const destination = fromLocation
    ? `${fromLocation.pathname || '/'}${fromLocation.search || ''}${fromLocation.hash || ''}`
    : '/';

  // If already authenticated, redirect to destination
  useEffect(() => {
    if (user) {
      navigate(destination, { replace: true });
    }
  }, [user, navigate, destination]);

  // Load Google Identity Services script if not present
  useEffect(() => {
    if (window.google?.accounts?.id || window.google?.accounts?.oauth2) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  // Filter accounts used on this specific device with 2+ logins
  const [historyState, setHistoryState] = useState(() => {
    try {
      return getLoginHistory() || {};
    } catch {
      return {};
    }
  });

  const eligibleAccounts = Object.values(historyState).filter(
    (acc) => (acc.loginCount || 0) >= 2
  );

  const handleRemoveAccount = (targetEmail) => {
    removeSavedAccount(targetEmail);
    try {
      setHistoryState(getLoginHistory() || {});
    } catch {
      setHistoryState({});
    }
    if (email.toLowerCase().trim() === targetEmail.toLowerCase().trim()) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const clearError = (field) => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (errorMessage) setErrorMessage('');
  };

  // Client validation
  const validateForm = () => {
    const errors = {};
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }

    if (tab === 'login') {
      if (!password) {
        errors.password = 'Password is required.';
      }
    } else {
      const trimmedName = name.trim();
      if (!trimmedName) {
        errors.name = 'Full name is required.';
      } else if (trimmedName.length < 2) {
        errors.name = 'Name must be at least 2 characters.';
      }

      if (phone && phone.trim() !== '' && phone.trim() !== '+91') {
        if (!isValidIndianPhone(phone)) {
          errors.phone = 'Valid 10-digit Indian mobile number required (+91 98765 43210).';
        }
      }

      if (!password) {
        errors.password = 'Password is required.';
      } else if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters long.';
      } else if (!/[a-zA-Z]/.test(password) || !/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.password = 'Password must include at least one letter and one number or symbol.';
      }

      if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your password.';
      } else if (confirmPassword !== password) {
        errors.confirmPassword = 'Passwords do not match.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Real Google Sign-In flow
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setInfoMessage('');
    setFieldErrors({});

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // Check if Google Client ID is configured
    if (!googleClientId || googleClientId.includes('your-google-client-id') || googleClientId.trim() === '') {
      setErrorMessage(
        'Google Sign-In is not configured. Please add VITE_GOOGLE_CLIENT_ID to your environment variables to enable Google OAuth.'
      );
      return;
    }

    // Verify Google Identity Services is available
    if (!window.google?.accounts?.oauth2) {
      setErrorMessage('Google authentication service is loading or unavailable. Please check your connection and try again.');
      return;
    }

    setSocialLoading(true);

    try {
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
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
            });

            if (!userInfoRes.ok) {
              throw new Error('Failed to retrieve verified user profile from Google.');
            }

            const profile = await userInfoRes.json();

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
            navigate(destination, { replace: true });
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

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      setSocialLoading(false);
      setErrorMessage(err.message || 'Could not initiate Google sign-in.');
    }
  };

  // Apple ID trigger
  const handleAppleSignIn = () => {
    setErrorMessage('');
    setInfoMessage('');
    setErrorMessage('Apple ID authentication is not configured for this domain.');
  };

  // Standard email & password submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    if (loading || socialLoading) return;

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (tab === 'login') {
        const res = await login(email.trim().toLowerCase(), password);
        showToast(`Welcome back, ${res.user.name}. Your sanctuary awaits.`);
        navigate(destination, { replace: true });
      } else {
        const res = await register({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
          phone: phone.trim(),
          country: country.trim() || 'India'
        });
        showToast(`Welcome to Veloura, ${res.user.name}. Your account is active.`);
        navigate(destination, { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-28 pb-20 flex items-center justify-center px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white rounded-3xl border border-sand-300 shadow-luxury p-7 sm:p-9 relative"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-luxury text-gold-600 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Veloura Guest Sanctuary</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-forest-950 font-normal">
            {tab === 'login' ? 'Sign In to Your Itinerary' : 'Create Guest Account'}
          </h1>
          <p className="mt-2 text-xs text-forest-700/80 font-sans">
            {tab === 'login'
              ? 'Access your private reservations, concierge notes, and sanctuary preferences.'
              : 'Enjoy effortless reservation management and island privileges.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Info Alert */}
        {infoMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{infoMessage}</span>
          </div>
        )}

        {/* Returning user quick-fill (ONLY if 2+ previous logins on this device) */}
        {eligibleAccounts.length > 0 && tab === 'login' && (
          <div className="mb-5 p-3.5 bg-sand-100/70 border border-sand-300 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-forest-700 font-bold">
                Welcome back
              </span>
              <span className="text-[10px] text-forest-500">
                Recent on this device
              </span>
            </div>
            <div className="space-y-1.5">
              {eligibleAccounts.map((acc) => (
                <div
                  key={acc.email}
                  className="flex items-center justify-between p-2 rounded-xl bg-white border border-sand-200 hover:border-gold-500 transition-all group"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(acc.email);
                      setPassword('');
                      setConfirmPassword('');
                      setFieldErrors({});
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
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          {tab === 'register' && (
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
                    onChange={(e) => {
                      setName(e.target.value);
                      clearError('name');
                    }}
                    placeholder="Your Name"
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border rounded-2xl text-xs text-forest-950 placeholder:text-forest-400 focus:outline-none transition-colors shadow-xs ${
                      fieldErrors.name ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-sand-300 focus:border-gold-500'
                    }`}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="mt-1 text-[11px] text-rose-600 font-sans flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{fieldErrors.name}</span>
                  </p>
                )}
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
                      onChange={(e) => {
                        setPhone(e.target.value);
                        clearError('phone');
                      }}
                      placeholder="+91 98765 43210"
                      className={`w-full pl-10 pr-3 py-2.5 bg-[#FAF7F2] border rounded-2xl text-xs text-forest-950 placeholder:text-forest-400 focus:outline-none transition-colors shadow-xs ${
                        fieldErrors.phone ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-sand-300 focus:border-gold-500'
                      }`}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="mt-1 text-[11px] text-rose-600 font-sans flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{fieldErrors.phone}</span>
                    </p>
                  )}
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
                      className="w-full pl-10 pr-3 py-2.5 bg-[#FAF7F2] border border-sand-300 rounded-2xl text-xs text-forest-950 placeholder:text-forest-400 focus:outline-none focus:border-gold-500 shadow-xs"
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError('email');
                }}
                placeholder="name@domain.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border rounded-2xl text-xs text-forest-950 placeholder:text-forest-400 focus:outline-none transition-colors shadow-xs ${
                  fieldErrors.email ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-sand-300 focus:border-gold-500'
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-[11px] text-rose-600 font-sans flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-forest-800 font-medium mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={tab === 'register' ? 8 : 6}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError('password');
                }}
                placeholder={tab === 'register' ? 'Min 8 chars (letters & numbers)' : '••••••••'}
                className={`w-full pl-10 pr-10 py-2.5 bg-[#FAF7F2] border rounded-2xl text-xs text-forest-950 placeholder:text-forest-400 focus:outline-none transition-colors shadow-xs ${
                  fieldErrors.password ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-sand-300 focus:border-gold-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-forest-400 hover:text-forest-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {fieldErrors.password ? (
              <p className="mt-1 text-[11px] text-rose-600 font-sans flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{fieldErrors.password}</span>
              </p>
            ) : tab === 'register' ? (
              <p className="mt-1 text-[10px] text-forest-500">Minimum 8 characters with at least one letter and one number or symbol.</p>
            ) : null}
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-forest-800 font-medium mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearError('confirmPassword');
                  }}
                  placeholder="Repeat password"
                  className={`w-full pl-10 pr-10 py-2.5 bg-[#FAF7F2] border rounded-2xl text-xs text-forest-950 placeholder:text-forest-400 focus:outline-none transition-colors shadow-xs ${
                    fieldErrors.confirmPassword ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-sand-300 focus:border-gold-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-forest-400 hover:text-forest-700"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-[11px] text-rose-600 font-sans flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{fieldErrors.confirmPassword}</span>
                </p>
              )}
            </div>
          )}

          {/* Primary Pill Button: Sign in → */}
          <button
            type="submit"
            disabled={loading || socialLoading}
            className="w-full mt-3 py-3 bg-[#111827] hover:bg-forest-950 disabled:opacity-60 text-white rounded-full text-xs font-semibold tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99]"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{tab === 'login' ? 'Sign in' : 'Create account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider: Or continue with */}
        <div className="relative flex items-center justify-center my-5">
          <div className="border-t border-sand-300 w-full" />
          <span className="bg-white px-3 text-xs text-forest-700/60 font-sans whitespace-nowrap">
            Or continue with
          </span>
          <div className="border-t border-sand-300 w-full" />
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
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
            onClick={handleAppleSignIn}
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
          {tab === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setErrorMessage('');
                  setInfoMessage('');
                  setFieldErrors({});
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
                  setTab('login');
                  setErrorMessage('');
                  setInfoMessage('');
                  setFieldErrors({});
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
  );
}
