import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, MapPin, Search, ChevronDown, Check, AlertCircle } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { destinationsList, roomCategories } from '../data/staysData';
import { getTodayDateString, calculateNights } from '../utils/formatters';

export default function BookingSearch({ className = '' }) {
  const navigate = useNavigate();
  const { searchParams, updateSearchParams, showToast } = useBooking();

  const [destination, setDestination] = useState(searchParams.destination || 'All Sanctuaries');
  const [checkIn, setCheckIn] = useState(searchParams.checkIn || getTodayDateString(7));
  const [checkOut, setCheckOut] = useState(searchParams.checkOut || getTodayDateString(12));
  const [adults, setAdults] = useState(searchParams.adults || 2);
  const [children, setChildren] = useState(searchParams.children || 0);
  const [category, setCategory] = useState(searchParams.category || 'All Stays');

  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);
  const [validationError, setValidationError] = useState('');

  const checkInInputRef = useRef(null);
  const checkOutInputRef = useRef(null);
  const guestDropdownRef = useRef(null);

  const nights = calculateNights(checkIn, checkOut);
  const totalGuests = adults + children;

  // Click outside to close guest popover
  useEffect(() => {
    function handleClickOutside(event) {
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target)) {
        setGuestDropdownOpen(false);
      }
    }
    if (guestDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [guestDropdownOpen]);

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);
    setValidationError('');

    // If checkout is on or before new checkin, auto advance checkout to checkIn + 3 days
    if (new Date(checkOut) <= new Date(newCheckIn)) {
      const d = new Date(newCheckIn);
      d.setDate(d.getDate() + 3);
      setCheckOut(d.toISOString().split('T')[0]);
    }
  };

  const handleCheckOutChange = (e) => {
    const newCheckOut = e.target.value;
    if (new Date(newCheckOut) <= new Date(checkIn)) {
      setValidationError('Check-out date must be at least 1 night after check-in date.');
      setCheckOut(newCheckOut);
      return;
    }
    setValidationError('');
    setCheckOut(newCheckOut);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!checkIn) {
      setValidationError('Please select a valid check-in date.');
      return;
    }

    if (!checkOut || new Date(checkOut) <= new Date(checkIn)) {
      setValidationError('Check-out date must be after check-in date.');
      return;
    }

    if (adults < 1) {
      setValidationError('At least one adult guest is required.');
      return;
    }

    if (totalGuests > 8) {
      setValidationError('Our private residences accommodate up to 8 guests per sanctuary.');
      return;
    }

    setValidationError('');

    updateSearchParams({
      destination,
      checkIn,
      checkOut,
      adults,
      children,
      category
    });

    showToast(`Displaying available sanctuaries for ${nights} night${nights > 1 ? 's' : ''}...`);

    navigate(`/stays?category=${encodeURIComponent(category)}&guests=${totalGuests}&destination=${encodeURIComponent(destination)}`);
  };

  return (
    <motion.div
      id="booking-search-section"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className={`relative z-20 w-full max-w-6xl mx-auto ${className}`}
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-sand-300/80 p-5 sm:p-7 md:p-8">
        <form onSubmit={handleSearch} className="space-y-4 sm:space-y-5">
          {/* 4 Consistent Field Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            
            {/* 1. Destination / Sanctuary Wing Selector */}
            <div className="relative group p-4 bg-sand-50/70 hover:bg-sand-100/80 border border-sand-200/90 hover:border-gold/60 focus-within:border-gold rounded-2xl transition-all duration-300 min-h-[82px] flex flex-col justify-between cursor-pointer">
              <div className="flex items-center justify-between">
                <label htmlFor="destination-select" className="text-[10px] uppercase tracking-luxury text-forest-700 font-semibold cursor-pointer">
                  Sanctuary Wing
                </label>
                <span className="text-[10px] text-forest-500 font-serif italic">Atoll Shore</span>
              </div>
              <div className="flex items-center gap-2.5 mt-1">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 group-hover:text-gold-500 transition-colors" />
                <select
                  id="destination-select"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-forest-950 focus:outline-none cursor-pointer truncate pr-2"
                >
                  <option value="All Sanctuaries">All Sanctuaries</option>
                  {destinationsList.map((dest) => (
                    <option key={dest} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Check-In Date Selector */}
            <div
              onClick={() => {
                try {
                  checkInInputRef.current?.showPicker();
                } catch {
                  checkInInputRef.current?.focus();
                }
              }}
              className="relative group p-4 bg-sand-50/70 hover:bg-sand-100/80 border border-sand-200/90 hover:border-gold/60 focus-within:border-gold rounded-2xl transition-all duration-300 min-h-[82px] flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <label htmlFor="check-in-input" className="text-[10px] uppercase tracking-luxury text-forest-700 font-semibold cursor-pointer">
                  Check-In
                </label>
                <span className="text-[10px] text-gold-600 font-medium font-sans">From 15:00</span>
              </div>
              <div className="flex items-center gap-2.5 mt-1">
                <Calendar className="w-4 h-4 text-gold flex-shrink-0 group-hover:text-gold-500 transition-colors" />
                <input
                  ref={checkInInputRef}
                  id="check-in-input"
                  type="date"
                  min={getTodayDateString(0)}
                  value={checkIn}
                  onChange={handleCheckInChange}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-forest-950 focus:outline-none cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* 3. Check-Out Date Selector */}
            <div
              onClick={() => {
                try {
                  checkOutInputRef.current?.showPicker();
                } catch {
                  checkOutInputRef.current?.focus();
                }
              }}
              className={`relative group p-4 bg-sand-50/70 hover:bg-sand-100/80 border ${
                validationError.includes('Check-out') ? 'border-rose-400 bg-rose-50/40' : 'border-sand-200/90 hover:border-gold/60 focus-within:border-gold'
              } rounded-2xl transition-all duration-300 min-h-[82px] flex flex-col justify-between cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <label htmlFor="check-out-input" className="text-[10px] uppercase tracking-luxury text-forest-700 font-semibold cursor-pointer">
                  Check-Out
                </label>
                <span className="text-[10px] text-forest-600 font-medium font-serif italic">
                  {nights} {nights === 1 ? 'Night' : 'Nights'}
                </span>
              </div>
              <div className="flex items-center gap-2.5 mt-1">
                <Calendar className="w-4 h-4 text-gold flex-shrink-0 group-hover:text-gold-500 transition-colors" />
                <input
                  ref={checkOutInputRef}
                  id="check-out-input"
                  type="date"
                  min={checkIn || getTodayDateString(1)}
                  value={checkOut}
                  onChange={handleCheckOutChange}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-forest-950 focus:outline-none cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* 4. Guests Selector */}
            <div
              ref={guestDropdownRef}
              className="relative p-4 bg-sand-50/70 hover:bg-sand-100/80 border border-sand-200/90 hover:border-gold/60 focus-within:border-gold rounded-2xl transition-all duration-300 min-h-[82px] flex flex-col justify-between cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-luxury text-forest-700 font-semibold">
                  Guests
                </span>
                <span className="text-[10px] text-forest-500 font-serif italic">Max 8</span>
              </div>

              <button
                type="button"
                onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
                className="w-full flex items-center justify-between text-left focus:outline-none mt-1"
                aria-expanded={guestDropdownOpen}
                aria-haspopup="true"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-gold flex-shrink-0 group-hover:text-gold-500 transition-colors" />
                  <span className="text-xs sm:text-sm font-medium text-forest-950 truncate">
                    {adults} Adult{adults > 1 ? 's' : ''}
                    {children > 0 && `, ${children} Child${children > 1 ? 'ren' : ''}`}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-forest-700 transition-transform duration-300 ${guestDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Guest Counts Popover */}
              {guestDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-sand-300 p-5 z-50 animate-[fadeIn_0.2s_ease-out]">
                  <div className="space-y-4">
                    {/* Adults */}
                    <div className="flex items-center justify-between pb-3 border-b border-sand-200">
                      <div>
                        <div className="text-sm font-semibold text-forest-950">Adults</div>
                        <div className="text-xs text-forest-600">Ages 13 and above</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setAdults(Math.max(1, adults - 1)); }}
                          className="w-8 h-8 rounded-full border border-sand-300 flex items-center justify-center text-forest-950 hover:border-gold hover:text-gold hover:bg-sand-50 transition-colors"
                          aria-label="Decrease adults"
                        >
                          -
                        </button>
                        <span className="font-semibold text-sm w-4 text-center">{adults}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setAdults(Math.min(8 - children, adults + 1)); }}
                          className="w-8 h-8 rounded-full border border-sand-300 flex items-center justify-center text-forest-950 hover:border-gold hover:text-gold hover:bg-sand-50 transition-colors"
                          aria-label="Increase adults"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between pb-3 border-b border-sand-200">
                      <div>
                        <div className="text-sm font-semibold text-forest-950">Children</div>
                        <div className="text-xs text-forest-600">Ages 0 to 12</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setChildren(Math.max(0, children - 1)); }}
                          className="w-8 h-8 rounded-full border border-sand-300 flex items-center justify-center text-forest-950 hover:border-gold hover:text-gold hover:bg-sand-50 transition-colors"
                          aria-label="Decrease children"
                        >
                          -
                        </button>
                        <span className="font-semibold text-sm w-4 text-center">{children}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setChildren(Math.min(8 - adults, children + 1)); }}
                          className="w-8 h-8 rounded-full border border-sand-300 flex items-center justify-center text-forest-950 hover:border-gold hover:text-gold hover:bg-sand-50 transition-colors"
                          aria-label="Increase children"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setGuestDropdownOpen(false); }}
                      className="w-full py-2.5 bg-forest-900 text-white rounded-xl text-xs font-semibold tracking-wider uppercase hover:bg-forest-800 transition-colors"
                    >
                      Confirm Guests ({totalGuests})
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Validation Notice Feedback */}
          {validationError && (
            <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5 animate-[fadeIn_0.2s_ease-out]">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
            {/* Category Quick Selector */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-[11px] uppercase tracking-widest text-forest-600 flex-shrink-0 hidden md:inline">
                Category:
              </span>
              {roomCategories.slice(0, 4).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-300 flex-shrink-0 ${
                    category === cat
                      ? 'bg-forest-900 text-white border-forest-900 font-medium shadow-sm'
                      : 'bg-sand-50/60 text-forest-800 border-sand-300 hover:border-gold hover:bg-sand-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Availability Button */}
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold tracking-luxury uppercase rounded-full shadow-xl hover:shadow-forest-900/20 transition-all duration-300 transform hover:-translate-y-0.5 flex-shrink-0"
            >
              <Search className="w-4 h-4 text-gold" />
              <span>Search Availability</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
