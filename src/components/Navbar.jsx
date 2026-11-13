import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Calendar, ArrowRight, User, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { bookings, showToast } = useBooking();
  const { user, logout, openAuthModal } = useAuth();
  const location = useLocation();

  // Booking count (strictly derived from state/localStorage, never hardcoded)
  const savedBookingsCount = bookings ? bookings.length : 0;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu upon navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Stays', path: '/stays' },
    { name: 'Experiences', path: '/experiences' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isLightHero = location.pathname === '/' || location.pathname.startsWith('/stay/');

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#F8F6F0]/95 backdrop-blur-md py-3 shadow-md border-b border-sand-300/80 text-forest-950'
            : 'bg-[#F8F6F0]/90 backdrop-blur-md py-4 sm:py-5 border-b border-sand-300/60 text-forest-950'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Navbar Flex Container: Logo Left, Links Center/Horizontally Aligned, CTA Right */}
          <div className="flex items-center justify-between gap-4 lg:gap-8">
            
            {/* 1. Logo Aligned to Left */}
            <Link
              to="/"
              className="group flex items-center gap-2.5 sm:gap-3 flex-shrink-0 focus:outline-none"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gold/50 flex items-center justify-center bg-sand-100 group-hover:border-gold transition-colors duration-300 flex-shrink-0 shadow-sm">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gold-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2C8 6 6 10 12 18C18 10 16 6 12 2Z" />
                  <circle cx="12" cy="12" r="2.5" fill="#C5A77A" />
                </svg>
              </div>
              <div className="flex flex-col whitespace-nowrap">
                <span className="font-serif text-2xl sm:text-3xl tracking-luxury font-medium text-forest-950 group-hover:text-gold-600 transition-colors duration-300 leading-none">
                  VELOURA
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-gold-700 font-sans mt-0.5">
                  Resort & Private Villas
                </span>
              </div>
            </Link>

            {/* 2. Desktop Navigation Links with Animated Gliding Underline */}
            <nav className="hidden lg:flex items-center justify-center gap-5 xl:gap-8 whitespace-nowrap">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-[11px] xl:text-xs tracking-luxury uppercase font-medium transition-colors duration-300 relative py-1.5 whitespace-nowrap ${
                      isActive ? 'text-forest-950 font-bold' : 'text-forest-700/80 hover:text-gold-700'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{link.name}</span>
                      {isActive && (
                        <motion.span
                          layoutId="navbar-active-indicator"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* 3. Desktop Actions Aligned to Right (Account + My Bookings + Book CTA) */}
            <div className="hidden lg:flex items-center gap-2.5 xl:gap-3.5 flex-shrink-0 whitespace-nowrap">
              {/* User Account Menu / Sign In */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="inline-flex items-center gap-2 text-[11px] xl:text-xs tracking-wider uppercase text-forest-900 px-3 py-1.5 rounded-full border border-sand-300 hover:border-gold/60 bg-white/90 transition-all shadow-sm"
                  >
                    <span className="w-6 h-6 rounded-full bg-forest-900 text-gold text-[10px] font-serif font-bold flex items-center justify-center">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'G'}
                    </span>
                    <span className="max-w-[100px] truncate font-medium">{user.name.split(' ')[0]}</span>
                    <ChevronDown className={`w-3 h-3 text-gold transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 mt-2 w-56 bg-[#FAF7F2] rounded-2xl border border-sand-300 shadow-xl py-2 z-50 text-xs overflow-hidden"
                      >
                        <div className="px-4 py-2 border-b border-sand-300/80">
                          <p className="text-[10px] uppercase tracking-wider text-gold-700 font-bold">Privileged Guest</p>
                          <p className="font-serif text-sm font-semibold text-forest-950 truncate">{user.name}</p>
                          <p className="text-[11px] text-forest-600 truncate">{user.email}</p>
                        </div>

                        <Link
                          to="/my-bookings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-forest-800 hover:bg-sand-200/60 hover:text-forest-950 transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5 text-gold-600" />
                          <span>My Reservations ({savedBookingsCount})</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                            showToast('Signed out of Veloura Sanctuary', 'info');
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-rose-700 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="group inline-flex items-center gap-1.5 text-[11px] xl:text-xs tracking-widest uppercase text-forest-800 hover:text-gold-700 px-3.5 py-2 rounded-full border border-sand-300 hover:border-gold/60 bg-white/80 hover:bg-white transition-all duration-300 whitespace-nowrap shadow-sm hover:shadow"
                >
                  <User className="w-3.5 h-3.5 text-gold flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Sign In</span>
                </button>
              )}

              {/* My Bookings Button - Always displays actual saved count, shows 0 when none */}
              <Link
                to="/my-bookings"
                className="group inline-flex items-center gap-2 text-[11px] xl:text-xs tracking-widest uppercase text-forest-800 hover:text-gold-700 px-3.5 py-2 rounded-full border border-sand-300 hover:border-gold/60 bg-white/80 hover:bg-white transition-all duration-300 whitespace-nowrap shadow-sm hover:shadow"
                title="View your saved demo reservations"
              >
                <Calendar className="w-3.5 h-3.5 text-gold flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>My Bookings</span>
                <span className="bg-forest-900 text-gold font-bold text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-sm">
                  {savedBookingsCount}
                </span>
              </Link>

              {/* Book Your Stay CTA Button with Arrow Animation */}
              <Link
                to="/stays"
                className="group relative inline-flex items-center justify-center gap-2 px-5 xl:px-6 py-2.5 text-[11px] xl:text-xs font-semibold tracking-luxury uppercase text-white bg-forest-900 hover:bg-forest-800 rounded-full transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap flex-shrink-0 overflow-hidden"
              >
                <span>Book Your Stay</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* 4. Mobile & Tablet Menu Button + Quick My Bookings Counter */}
            <div className="flex items-center gap-2.5 lg:hidden flex-shrink-0">
              <Link
                to="/my-bookings"
                className="flex items-center gap-1.5 text-xs text-forest-900 border border-sand-300 px-2.5 py-1.5 rounded-full bg-white/80 shadow-sm transition-colors whitespace-nowrap"
                title="View your reservations"
              >
                <Calendar className="w-3.5 h-3.5 text-gold" />
                <span className="bg-forest-900 text-gold text-[10px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                  {savedBookingsCount}
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-forest-950 hover:text-gold bg-sand-200/80 hover:bg-sand-200 border border-sand-300 transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-forest-950" /> : <Menu className="w-5 h-5 text-forest-950" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Responsive Mobile Drawer Navigation Menu */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop Overlay */}
        <div
          className="fixed inset-0 bg-forest-950/85 backdrop-blur-md transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-forest-900 border-l border-white/10 shadow-2xl p-6 flex flex-col justify-between transition-transform duration-300 ease-out z-10 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center bg-forest-950">
                  <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2C8 6 6 10 12 18C18 10 16 6 12 2Z" />
                    <circle cx="12" cy="12" r="2.5" fill="#C5A77A" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-2xl tracking-luxury text-white">VELOURA</span>
                  <span className="text-[8px] uppercase tracking-widest text-gold-300 -mt-0.5">Resort & Private Villas</span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full text-sand-300 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5 text-gold" />
              </button>
            </div>

            {/* Navigation Links in Drawer */}
            <div className="py-6 space-y-1">
              {/* User Account / Sign In within Mobile Drawer */}
              {user ? (
                <div className="p-3 mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-full bg-gold text-forest-950 font-serif font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'G'}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-serif text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-sand-300 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      showToast('Signed out of Veloura Sanctuary', 'info');
                    }}
                    className="p-1.5 text-rose-300 hover:text-rose-100 transition-colors ml-2 flex-shrink-0"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="w-full flex items-center gap-2.5 text-sm font-serif text-gold hover:text-white py-2.5 px-3 mb-3 rounded-xl bg-white/5 border border-gold/30 transition-colors"
                >
                  <User className="w-4 h-4 text-gold" />
                  <span>Sign In / Guest Privileges</span>
                </button>
              )}

              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `block text-base sm:text-lg font-serif tracking-wider transition-colors py-3 px-3 rounded-xl border-b border-white/5 ${
                      isActive ? 'text-gold bg-white/5 font-medium pl-4 border-l-2 border-gold' : 'text-sand-100 hover:text-gold hover:bg-white/5'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {/* My Reservations Link in Drawer (Shows actual saved count, zero if none) */}
              <NavLink
                to="/my-bookings"
                className={({ isActive }) =>
                  `flex items-center justify-between text-base font-serif py-3 px-3 rounded-xl border-b border-white/5 transition-colors ${
                    isActive ? 'text-gold bg-white/5 border-l-2 border-gold pl-4' : 'text-sand-100 hover:text-gold hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold" />
                  <span>My Reservations</span>
                </div>
                <span className="bg-gold text-forest-950 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {savedBookingsCount}
                </span>
              </NavLink>
            </div>
          </div>

          {/* Drawer Footer CTA */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            <Link
              to="/stays"
              className="w-full inline-flex items-center justify-center py-3.5 text-xs font-semibold tracking-luxury uppercase text-forest-950 bg-gold hover:bg-gold-300 rounded-full transition-colors shadow-lg"
            >
              Book Your Stay
            </Link>

            <div className="text-center text-xs text-sand-400 font-sans space-y-1">
              <p>Azure Atoll, Western Sanctuary</p>
              <p className="text-[11px] text-gold-400">concierge@velouraresort.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
