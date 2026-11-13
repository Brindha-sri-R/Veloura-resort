import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Users, Maximize, BedDouble, Bath, Compass, Star, Check, 
  Calendar, ArrowLeft, ShieldCheck, Sparkles, Heart, ChevronRight,
  Wifi, Waves, Anchor, Wine, Coffee, Eye, Flame, Award
} from 'lucide-react';
import { staysData } from '../data/staysData';
import { useBooking } from '../context/BookingContext';
import { formatCurrency, calculateNights, getTodayDateString } from '../utils/formatters';

export default function StayDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedStay, searchParams, updateSearchParams, showToast, stays } = useBooking();

  const stayList = stays && stays.length > 0 ? stays : staysData;
  const stay = stayList.find((s) => s.id === id || s.slug === id) || stayList[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Booking Widget local states initialized with searchParams
  const [checkIn, setCheckIn] = useState(searchParams.checkIn || getTodayDateString(7));
  const [checkOut, setCheckOut] = useState(searchParams.checkOut || getTodayDateString(12));
  const [adults, setAdults] = useState(searchParams.adults || 2);
  const [children, setChildren] = useState(searchParams.children || 0);
  const [validationError, setValidationError] = useState('');

  const rawNights = calculateNights(checkIn, checkOut);
  const nights = Math.max(1, rawNights);
  const basePrice = nights * stay.pricePerNight;
  const serviceFee = Math.round(basePrice * 0.10);
  const taxes = Math.round(basePrice * 0.12);
  const grandTotal = basePrice + serviceFee + taxes;

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);
    setValidationError('');
    if (checkOut) {
      const n = calculateNights(newCheckIn, checkOut);
      if (n < 1) {
        const d = new Date(newCheckIn);
        d.setDate(d.getDate() + 3);
        const autoCheckOut = d.toISOString().split('T')[0];
        setCheckOut(autoCheckOut);
      }
    }
  };

  const handleCheckOutChange = (e) => {
    const newCheckOut = e.target.value;
    setCheckOut(newCheckOut);
    if (checkIn) {
      const n = calculateNights(checkIn, newCheckOut);
      if (n < 1) {
        setValidationError('Check-out date must be at least 1 night after check-in.');
        return;
      }
    }
    setValidationError('');
  };

  const handleProceedToBooking = (e) => {
    e.preventDefault();
    if (!checkIn) {
      setValidationError('Please select an arrival date.');
      return;
    }
    if (!checkOut) {
      setValidationError('Please select a departure date.');
      return;
    }
    const calculatedNights = calculateNights(checkIn, checkOut);
    if (calculatedNights < 1) {
      setValidationError('Check-out date must be at least 1 night after check-in.');
      return;
    }
    if (adults < 1) {
      setValidationError('At least 1 adult guest is required.');
      return;
    }
    if (adults + children > stay.maxGuests) {
      setValidationError(`Maximum guest capacity for ${stay.name} is ${stay.maxGuests} guests.`);
      return;
    }

    setValidationError('');
    updateSearchParams({
      checkIn,
      checkOut,
      adults,
      children,
      category: stay.category
    });
    setSelectedStay(stay);
    showToast(`Proceeding to reservation for ${stay.name}...`);
    navigate(`/book?stayId=${stay.id}`);
  };

  const otherStays = staysData.filter((s) => s.id !== stay.id).slice(0, 2);

  return (
    <div className="pt-24 pb-24 bg-[#FAF7F2] min-h-screen">
      {/* Top Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-4">
        <div className="flex items-center justify-between text-xs text-forest-600">
          <Link
            to="/stays"
            className="inline-flex items-center gap-1.5 text-forest-800 hover:text-gold-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Stays</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-forest-500">
            <Link to="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/stays" className="hover:underline">Stays</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-forest-950 font-medium">{stay.name}</span>
          </div>
        </div>
      </div>

      {/* Main Gallery Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Featured Image */}
          <div className="lg:col-span-8 relative aspect-[16/10] rounded-3xl overflow-hidden bg-forest-950 shadow-luxury group cursor-pointer" onClick={() => setLightboxOpen(true)}>
            <img
              src={stay.images[activeImageIndex]}
              alt={stay.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 right-4 bg-forest-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs text-white border border-white/20">
              Click to Enlarge ({activeImageIndex + 1} / {stay.images.length})
            </div>
            <div className="absolute top-4 left-4 bg-forest-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs text-gold border border-gold/30 tracking-luxury uppercase font-semibold">
              {stay.tag || stay.category}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
            {stay.images.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-[16/10] lg:aspect-[16/7] rounded-2xl overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx ? 'border-gold shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${stay.name} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content & Sticky Booking Widget */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Details & Amenities */}
          <div className="lg:col-span-7 space-y-10">
            {/* Title Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-luxury text-gold-600 font-bold">
                  {stay.category}
                </span>
                <span className="text-sand-400">•</span>
                <div className="flex items-center gap-1 text-xs font-semibold text-forest-950">
                  <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                  <span>{stay.rating}</span>
                  <span className="text-forest-500 font-normal">({stay.reviewsCount} reviews)</span>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl text-forest-950 font-normal tracking-tight mb-2">
                {stay.name}
              </h1>
              <p className="font-serif italic text-lg text-gold-700">
                {stay.subtitle}
              </p>
            </div>

            {/* Quick Specs Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-sand-300 shadow-sm">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-forest-500">Space</span>
                <span className="font-semibold text-sm text-forest-950 mt-0.5">{stay.size}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-forest-500">Capacity</span>
                <span className="font-semibold text-sm text-forest-950 mt-0.5">Up to {stay.maxGuests} Guests</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-forest-500">Bedding</span>
                <span className="font-semibold text-sm text-forest-950 mt-0.5">{stay.bedType}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-forest-500">View</span>
                <span className="font-semibold text-sm text-forest-950 mt-0.5">{stay.view}</span>
              </div>
            </div>

            {/* Editorial Description */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-forest-950 font-normal">
                Architectural Story
              </h3>
              <p className="text-sm sm:text-base text-forest-800 leading-relaxed font-sans whitespace-pre-line">
                {stay.description}
              </p>
              <div className="p-4 bg-sand-100/70 border border-sand-300 rounded-2xl text-xs text-forest-800 flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-gold flex-shrink-0" />
                <span>
                  <strong>Ideal Sanctuary For:</strong> {stay.idealFor}
                </span>
              </div>
            </div>

            {/* Comprehensive Facilities */}
            <div className="space-y-6 pt-6 border-t border-sand-300">
              <h3 className="font-serif text-2xl text-forest-950 font-normal">
                Sanctuary Inclusions & Facilities
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {stay.facilities.map((fac, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-sand-200 shadow-sm text-xs text-forest-900"
                  >
                    <Check className="w-4 h-4 text-gold-600 flex-shrink-0" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Complimentary Hospitality Touches */}
            <div className="p-6 rounded-3xl bg-forest-950 text-white space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-xs uppercase tracking-luxury text-gold font-semibold">
                <Award className="w-4 h-4" />
                <span>Complimentary With Every Stay</span>
              </div>
              <p className="text-xs text-sand-300 leading-relaxed font-sans">
                Each reservation includes bespoke seaplane reception, chilled Krug champagne upon arrival, private 24/7 dedicated Island Butler, artisanal breakfast served in-villa or at L’Azur, and unmetered non-motorized reef watercraft.
              </p>
            </div>
          </div>

          {/* Right Column: Sticky Booking Card & Price Calculator */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-luxury-hover border border-sand-300/90 relative">
              {/* Price Header */}
              <div className="pb-6 border-b border-sand-200">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-serif text-3xl sm:text-4xl font-semibold text-forest-950">
                      {formatCurrency(stay.pricePerNight)}
                    </span>
                    <span className="text-xs text-forest-600 font-sans ml-1">/ night</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-forest-500 bg-sand-100 px-2.5 py-1 rounded-full">
                    Demo Simulated Rate
                  </span>
                </div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleProceedToBooking} className="mt-6 space-y-4">
                {/* Dates Selector */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-sand-50 rounded-2xl border border-sand-200">
                    <label className="block text-[10px] uppercase tracking-luxury text-forest-700 font-semibold mb-1">
                      Check-In
                    </label>
                    <input
                      type="date"
                      min={getTodayDateString(0)}
                      value={checkIn}
                      onChange={handleCheckInChange}
                      className="w-full bg-transparent text-xs font-medium text-forest-950 focus:outline-none cursor-pointer"
                      required
                    />
                  </div>

                  <div className="p-3 bg-sand-50 rounded-2xl border border-sand-200">
                    <label className="block text-[10px] uppercase tracking-luxury text-forest-700 font-semibold mb-1">
                      Check-Out
                    </label>
                    <input
                      type="date"
                      min={checkIn || getTodayDateString(1)}
                      value={checkOut}
                      onChange={handleCheckOutChange}
                      className="w-full bg-transparent text-xs font-medium text-forest-950 focus:outline-none cursor-pointer"
                      required
                    />
                  </div>
                </div>

                {/* Guests Selector */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-sand-50 rounded-2xl border border-sand-200">
                    <label className="block text-[10px] uppercase tracking-luxury text-forest-700 font-semibold mb-1">
                      Adults
                    </label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full bg-transparent text-xs font-medium text-forest-950 focus:outline-none cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div className="p-3 bg-sand-50 rounded-2xl border border-sand-200">
                    <label className="block text-[10px] uppercase tracking-luxury text-forest-700 font-semibold mb-1">
                      Children
                    </label>
                    <select
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                      className="w-full bg-transparent text-xs font-medium text-forest-950 focus:outline-none cursor-pointer"
                    >
                      {[0, 1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num} Child{num !== 1 ? 'ren' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {validationError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600">
                    {validationError}
                  </div>
                )}

                {/* Price Breakdown Calculation */}
                <div className="pt-4 border-t border-sand-200 space-y-2.5 text-xs text-forest-700">
                  <div className="flex items-center justify-between">
                    <span>{formatCurrency(stay.pricePerNight)} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                    <span className="font-medium text-forest-950">{formatCurrency(basePrice)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      Resort & Conservation Fee (10%)
                    </span>
                    <span className="font-medium text-forest-950">{formatCurrency(serviceFee)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Sustainable Tourism Tax (12%)</span>
                    <span className="font-medium text-forest-950">{formatCurrency(taxes)}</span>
                  </div>

                  <div className="flex items-center justify-between text-emerald-700">
                    <span>Champagne & Butler Service</span>
                    <span className="font-semibold uppercase tracking-wider text-[11px]">Complimentary</span>
                  </div>

                  <div className="pt-3 border-t border-sand-200 flex items-center justify-between text-base font-semibold text-forest-950">
                    <span className="font-serif text-lg">Total Investment</span>
                    <span className="font-serif text-2xl text-forest-950">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full mt-4 py-4 bg-forest-900 hover:bg-forest-800 text-white rounded-full text-xs font-semibold tracking-luxury uppercase transition-all duration-300 shadow-xl hover:shadow-forest-900/30 flex items-center justify-center gap-2"
                >
                  <span>Reserve This Sanctuary</span>
                  <ChevronRight className="w-4 h-4 text-gold" />
                </button>

                <p className="text-[11px] text-center text-forest-500 font-sans mt-2">
                  No payment charged now. Demo booking reservation simulation.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-forest-950/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white text-sm bg-forest-900/80 px-4 py-2 rounded-full border border-white/20 hover:bg-forest-800"
          >
            Close View (Esc)
          </button>
          <img
            src={stay.images[activeImageIndex]}
            alt={stay.name}
            className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}

