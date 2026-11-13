import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, Calendar, Users, CheckCircle2, ChevronRight, 
  ArrowLeft, CreditCard, Sparkles, AlertCircle, Info, Lock, Check,
  Smartphone, Landmark, MapPin, XCircle
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { staysData } from '../data/staysData';
import { 
  formatCurrency, 
  formatDate, 
  calculateNights, 
  getTodayDateString, 
  isValidIndianPhone, 
  isValidIndianPinCode, 
  indianStates 
} from '../utils/formatters';

const curatedAddons = [
  {
    id: 'floating-breakfast',
    name: 'Floating Horizon Champagne Breakfast',
    price: 9500,
    desc: 'Served on a teak floating tray in your private plunge pool with chilled sparkling beverages, exotic fruits and freshly brewed Malabar coffee.'
  },
  {
    id: 'seaplane-vip',
    name: 'Private Roundtrip Luxury Speedboat / Seaplane Transfer',
    price: 35000,
    desc: 'Priority island speedboat / seaplane transfer with airport VIP lounge hostess escort, refreshing tender coconut water and chilled towels.'
  },
  {
    id: 'sunset-teak-cruise',
    name: 'Sunset Dolphin Teak Yacht Cruise for Two',
    price: 22500,
    desc: '3.5 hours on our hand-crafted wooden sailing yacht with coastal hors d’oeuvres and curated sommelier pairing.'
  },
  {
    id: 'ayurvedic-couple-spa',
    name: 'Solace Overwater 120-min Ayurvedic Ritual',
    price: 18000,
    desc: 'Traditional Abhyanga tandem massage, sound bath and organic floral petal therapy above crystal waters.'
  }
];

export default function BookingFlow() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const stayId = searchParams.get('stayId');

  const { user } = useAuth();
  const { 
    selectedStay, setSelectedStay, 
    searchParams: globalSearch, 
    createBooking, 
    simulatePayment,
    showToast,
    stays 
  } = useBooking();

  // Find stay from stayId param or fallback to context
  const stayList = stays && stays.length > 0 ? stays : staysData;
  const currentStay = stayList.find(s => s.id === stayId || s.slug === stayId) || selectedStay || stayList[0];

  useEffect(() => {
    if (currentStay) {
      setSelectedStay(currentStay);
    }
  }, [stayId]);

  // Step state: 1 = Customizations & Dates, 2 = Guest Info, 3 = Review & Demo Simulation
  const [currentStep, setCurrentStep] = useState(1);

  // Booking states
  const [checkIn, setCheckIn] = useState(globalSearch.checkIn || getTodayDateString(7));
  const [checkOut, setCheckOut] = useState(globalSearch.checkOut || getTodayDateString(12));
  const [adults, setAdults] = useState(globalSearch.adults || 2);
  const [children, setChildren] = useState(globalSearch.children || 0);
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Payment method simulation & submission state
  const [paymentMethod, setPaymentMethod] = useState('demo_upi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guest details form state
  const [guestInfo, setGuestInfo] = useState({
    title: 'Mr.',
    firstName: '',
    lastName: '',
    email: '',
    phone: '+91 ',
    country: 'India',
    streetAddress: '',
    city: '',
    state: 'Maharashtra',
    pinCode: '',
    arrivalTime: '14:00 - 16:00',
    specialRequests: '',
    occasion: 'None'
  });

  // Pre-populate guestInfo when authenticated user is detected
  useEffect(() => {
    if (user) {
      const parts = (user.name || '').trim().split(' ');
      const fName = parts[0] || '';
      const lName = parts.slice(1).join(' ') || '';
      setGuestInfo(prev => ({
        ...prev,
        firstName: prev.firstName || fName,
        lastName: prev.lastName || lName,
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '+91 ',
        country: prev.country || user.country || 'India',
        streetAddress: prev.streetAddress || user.streetAddress || '',
        city: prev.city || user.city || '',
        state: prev.state || user.state || 'Maharashtra',
        pinCode: prev.pinCode || user.pinCode || ''
      }));
    }
  }, [user]);

  const [step1Error, setStep1Error] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const rawNights = calculateNights(checkIn, checkOut);
  const nights = Math.max(1, rawNights);
  const baseTotal = nights * currentStay.pricePerNight;
  const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const serviceFee = Math.round(baseTotal * 0.10);
  const taxes = Math.round(baseTotal * 0.12);
  const grandTotal = baseTotal + addonsTotal + serviceFee + taxes;

  const handleCheckInChange = (e) => {
    const val = e.target.value;
    setCheckIn(val);
    setStep1Error('');
    if (checkOut) {
      const n = calculateNights(val, checkOut);
      if (n < 1) {
        const d = new Date(val);
        d.setDate(d.getDate() + 3);
        setCheckOut(d.toISOString().split('T')[0]);
      }
    }
  };

  const handleCheckOutChange = (e) => {
    const val = e.target.value;
    setCheckOut(val);
    if (checkIn) {
      const n = calculateNights(checkIn, val);
      if (n < 1) {
        setStep1Error('Departure date must be at least 1 night after arrival date.');
        return;
      }
    }
    setStep1Error('');
  };

  const toggleAddon = (addon) => {
    setSelectedAddons(prev => {
      const exists = prev.find(item => item.id === addon.id);
      if (exists) {
        return prev.filter(item => item.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const validateStep1 = () => {
    if (!checkIn) {
      setStep1Error('Please specify your arrival date.');
      return false;
    }
    if (!checkOut) {
      setStep1Error('Please specify your departure date.');
      return false;
    }
    const n = calculateNights(checkIn, checkOut);
    if (n < 1) {
      setStep1Error('Departure date must be at least 1 night after arrival date.');
      return false;
    }
    if (adults < 1) {
      setStep1Error('At least 1 adult guest is required for sanctuary reservation.');
      return false;
    }
    if (adults + children > currentStay.maxGuests) {
      setStep1Error(`This ${currentStay.name} accommodates up to ${currentStay.maxGuests} guests. Please adjust guests count or select a larger residence.`);
      return false;
    }
    setStep1Error('');
    return true;
  };

  const handleStep1Next = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const validateStep2 = () => {
    const errors = {};
    if (!guestInfo.firstName.trim() || guestInfo.firstName.trim().length < 2) {
      errors.firstName = 'First name is required (min 2 characters)';
    }
    if (!guestInfo.lastName.trim() || guestInfo.lastName.trim().length < 2) {
      errors.lastName = 'Last name is required (min 2 characters)';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!guestInfo.email.trim() || !emailRegex.test(guestInfo.email.trim())) {
      errors.email = 'Please provide a valid email address (e.g. name@domain.com)';
    }
    if (!guestInfo.phone.trim() || !isValidIndianPhone(guestInfo.phone)) {
      errors.phone = 'Valid 10-digit Indian mobile number required (e.g. +91 98765 43210)';
    }
    if (!guestInfo.streetAddress.trim() || guestInfo.streetAddress.trim().length < 5) {
      errors.streetAddress = 'House / Flat number and street address required (min 5 characters)';
    }
    if (!guestInfo.city.trim() || guestInfo.city.trim().length < 2) {
      errors.city = 'City is required';
    }
    if (!guestInfo.state.trim()) {
      errors.state = 'State / Union Territory is required';
    }
    if (!guestInfo.pinCode.trim() || !isValidIndianPinCode(guestInfo.pinCode)) {
      errors.pinCode = 'Valid 6-digit Indian PIN code required (e.g. 400001)';
    }
    if (!guestInfo.country.trim()) {
      errors.country = 'Country is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStep2Next = (e) => {
    e.preventDefault();
    if (validateStep2()) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Demo Payment Simulation Submission Handler
  const handleSimulatePayment = async (outcome = 'success') => {
    setIsSubmitting(true);
    try {
      const result = await createBooking({
        stay: currentStay,
        checkIn,
        checkOut,
        adults,
        children,
        guest: guestInfo,
        addons: selectedAddons,
        paymentMethod
      });

      const bookingRef = result.reference;

      await simulatePayment({
        bookingReference: bookingRef,
        outcome,
        method: paymentMethod
      });

      navigate(`/confirmation/${bookingRef}`);
    } catch (err) {
      showToast(err.message || 'Failed to complete reservation.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#FAF7F2] min-h-screen">
      {/* Header & Steps Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center justify-between pb-6 border-b border-sand-300">
          <Link
            to={`/stay/${currentStay.id}`}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-forest-700 hover:text-gold font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sanctuary Details</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-6 text-xs">
            <div className={`flex items-center gap-1.5 ${currentStep >= 1 ? 'text-forest-950 font-bold' : 'text-forest-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 1 ? 'bg-forest-900 text-white' : 'bg-sand-200'}`}>
                1
              </span>
              <span className="hidden sm:inline">Sanctuary & Enhancements</span>
            </div>

            <ChevronRight className="w-3 h-3 text-sand-400" />

            <div className={`flex items-center gap-1.5 ${currentStep >= 2 ? 'text-forest-950 font-bold' : 'text-forest-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 2 ? 'bg-forest-900 text-white' : 'bg-sand-200'}`}>
                2
              </span>
              <span className="hidden sm:inline">Guest Details</span>
            </div>

            <ChevronRight className="w-3 h-3 text-sand-400" />

            <div className={`flex items-center gap-1.5 ${currentStep >= 3 ? 'text-forest-950 font-bold' : 'text-forest-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 3 ? 'bg-forest-900 text-white' : 'bg-sand-200'}`}>
                3
              </span>
              <span className="hidden sm:inline">Review & Demo Confirm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Booking Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Flow Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* STEP 1: Dates & Curated Enhancements */}
            {currentStep === 1 && (
              <div className="space-y-8">
                {/* Stay Summary Mini Banner */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sand-300 shadow-luxury flex flex-col sm:flex-row gap-5 items-center">
                  <img
                    src={currentStay.images[0]}
                    alt={currentStay.name}
                    className="w-full sm:w-36 h-28 object-cover rounded-2xl"
                  />
                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <span className="text-[10px] uppercase tracking-luxury text-gold-600 font-bold">
                      Selected Sanctuary
                    </span>
                    <h3 className="font-serif text-2xl text-forest-950 font-semibold">
                      {currentStay.name}
                    </h3>
                    <p className="text-xs text-forest-700 font-sans">
                      {currentStay.size} • {currentStay.view}
                    </p>
                    <div className="pt-1 text-sm font-semibold text-forest-950">
                      {formatCurrency(currentStay.pricePerNight)} <span className="text-xs font-normal text-forest-600">/ night</span>
                    </div>
                  </div>
                </div>

                {/* Reservation Dates & Guests Form */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-300 shadow-luxury space-y-6">
                  <div>
                    <span className="text-xs uppercase tracking-luxury text-gold-600 font-semibold block mb-1">
                      Step 1 of 3
                    </span>
                    <h4 className="font-serif text-2xl text-forest-950">
                      Dates & Guests
                    </h4>
                  </div>

                  {step1Error && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>{step1Error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                        Arrival Date (Check-in)
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                        <input
                          type="date"
                          value={checkIn}
                          min={getTodayDateString(0)}
                          onChange={handleCheckInChange}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 text-sm bg-sand-50 text-forest-950 focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                        Departure Date (Check-out)
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                        <input
                          type="date"
                          value={checkOut}
                          min={checkIn || getTodayDateString(1)}
                          onChange={handleCheckOutChange}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 text-sm bg-sand-50 text-forest-950 focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                        Adult Guests
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                        <select
                          value={adults}
                          onChange={(e) => setAdults(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 text-sm bg-sand-50 text-forest-950 focus:outline-none focus:border-gold cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <option key={n} value={n}>{n} {n === 1 ? 'Adult' : 'Adults'}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                        Children (Under 12)
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                        <select
                          value={children}
                          onChange={(e) => setChildren(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 text-sm bg-sand-50 text-forest-950 focus:outline-none focus:border-gold cursor-pointer"
                        >
                          {[0, 1, 2, 3, 4].map(n => (
                            <option key={n} value={n}>{n} Children</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Curated Enhancements */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-300 shadow-luxury space-y-6">
                  <div>
                    <span className="text-xs uppercase tracking-luxury text-gold-600 font-semibold block mb-1">
                      Bespoke Inclusions
                    </span>
                    <h4 className="font-serif text-2xl text-forest-950">
                      Curate Your Experience
                    </h4>
                    <p className="text-xs text-forest-600 font-sans mt-1">
                      Select optional touches to tailor your arrival and stay before check-in.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {curatedAddons.map((addon) => {
                      const isSelected = selectedAddons.some(a => a.id === addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                            isSelected
                              ? 'border-gold bg-gold/5 shadow-sm'
                              : 'border-sand-200 hover:border-sand-300 bg-sand-50/40'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${isSelected ? 'bg-gold border-gold text-forest-950' : 'border-sand-400'}`}>
                                {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                              </div>
                              <h5 className="font-serif text-base font-semibold text-forest-950">
                                {addon.name}
                              </h5>
                            </div>
                            <p className="text-xs text-forest-700 pl-6 font-sans">
                              {addon.desc}
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-forest-950 whitespace-nowrap">
                            +{formatCurrency(addon.price)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleStep1Next}
                      className="px-8 py-3.5 bg-forest-900 hover:bg-forest-800 text-white rounded-full text-xs font-semibold tracking-luxury uppercase transition-all shadow-md flex items-center gap-2"
                    >
                      <span>Continue to Guest Details</span>
                      <ChevronRight className="w-4 h-4 text-gold" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Guest Details Form */}
            {currentStep === 2 && (
              <form onSubmit={handleStep2Next} className="bg-white rounded-3xl p-6 sm:p-10 border border-sand-300 shadow-luxury space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-luxury text-gold-600 font-semibold block mb-1">
                    Step 2 of 3
                  </span>
                  <h3 className="font-serif text-3xl text-forest-950">
                    Primary Guest Information
                  </h3>
                  <p className="text-xs text-forest-600 font-sans mt-1">
                    Please provide the lead guest’s particulars for personal butler assignment and island hospitality services.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                      Title
                    </label>
                    <select
                      value={guestInfo.title}
                      onChange={(e) => setGuestInfo({ ...guestInfo, title: e.target.value })}
                      className="w-full px-3.5 py-3 rounded-xl border border-sand-300 text-sm bg-sand-50 focus:outline-none focus:border-gold"
                    >
                      <option>Mr.</option>
                      <option>Ms.</option>
                      <option>Mrs.</option>
                      <option>Dr.</option>
                    </select>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priya"
                      value={guestInfo.firstName}
                      onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm bg-sand-50 focus:outline-none focus:border-gold ${formErrors.firstName ? 'border-rose-400' : 'border-sand-300'}`}
                    />
                    {formErrors.firstName && <span className="text-[11px] text-rose-500">{formErrors.firstName}</span>}
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sharma"
                      value={guestInfo.lastName}
                      onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm bg-sand-50 focus:outline-none focus:border-gold ${formErrors.lastName ? 'border-rose-400' : 'border-sand-300'}`}
                    />
                    {formErrors.lastName && <span className="text-[11px] text-rose-500">{formErrors.lastName}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="priya.sharma@example.com"
                      value={guestInfo.email}
                      onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm bg-sand-50 focus:outline-none focus:border-gold ${formErrors.email ? 'border-rose-400' : 'border-sand-300'}`}
                    />
                    {formErrors.email && <span className="text-[11px] text-rose-500">{formErrors.email}</span>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                      Mobile Number (India +91) *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={guestInfo.phone}
                      onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm bg-sand-50 focus:outline-none focus:border-gold ${formErrors.phone ? 'border-rose-400' : 'border-sand-300'}`}
                    />
                    {formErrors.phone && <span className="text-[11px] text-rose-500">{formErrors.phone}</span>}
                  </div>
                </div>

                {/* Indian Address Fields */}
                <div className="space-y-4 pt-2 border-t border-sand-200">
                  <span className="text-xs uppercase tracking-luxury text-gold-600 font-semibold block">
                    Residential Address (India)
                  </span>

                  <div>
                    <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                      Flat / House No. & Street Address *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 402, Sea View Apartments, Juhu Tara Road"
                      value={guestInfo.streetAddress}
                      onChange={(e) => setGuestInfo({ ...guestInfo, streetAddress: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm bg-sand-50 focus:outline-none focus:border-gold ${formErrors.streetAddress ? 'border-rose-400' : 'border-sand-300'}`}
                    />
                    {formErrors.streetAddress && <span className="text-[11px] text-rose-500">{formErrors.streetAddress}</span>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai"
                        value={guestInfo.city}
                        onChange={(e) => setGuestInfo({ ...guestInfo, city: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border text-sm bg-sand-50 focus:outline-none focus:border-gold ${formErrors.city ? 'border-rose-400' : 'border-sand-300'}`}
                      />
                      {formErrors.city && <span className="text-[11px] text-rose-500">{formErrors.city}</span>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                        State / UT *
                      </label>
                      <select
                        value={guestInfo.state}
                        onChange={(e) => setGuestInfo({ ...guestInfo, state: e.target.value })}
                        className="w-full px-3.5 py-3 rounded-xl border border-sand-300 text-sm bg-sand-50 focus:outline-none focus:border-gold cursor-pointer"
                      >
                        {indianStates.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                      {formErrors.state && <span className="text-[11px] text-rose-500">{formErrors.state}</span>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                        PIN Code (6 digits) *
                      </label>
                      <input
                        type="text"
                        maxLength="6"
                        placeholder="400049"
                        value={guestInfo.pinCode}
                        onChange={(e) => setGuestInfo({ ...guestInfo, pinCode: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border text-sm bg-sand-50 focus:outline-none focus:border-gold font-mono ${formErrors.pinCode ? 'border-rose-400' : 'border-sand-300'}`}
                      />
                      {formErrors.pinCode && <span className="text-[11px] text-rose-500">{formErrors.pinCode}</span>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={guestInfo.country}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-sand-200 text-sm bg-sand-100 text-forest-900 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                      Estimated Arrival Window
                    </label>
                    <select
                      value={guestInfo.arrivalTime}
                      onChange={(e) => setGuestInfo({ ...guestInfo, arrivalTime: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-sand-300 text-sm bg-sand-50 focus:outline-none focus:border-gold cursor-pointer"
                    >
                      <option>Morning (08:00 - 12:00)</option>
                      <option>Early Afternoon (12:00 - 15:00)</option>
                      <option>Late Afternoon (15:00 - 18:00)</option>
                      <option>Evening / Private Flight (After 18:00)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                    Special Celebration / Occasion
                  </label>
                  <select
                    value={guestInfo.occasion}
                    onChange={(e) => setGuestInfo({ ...guestInfo, occasion: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand-300 text-sm bg-sand-50 focus:outline-none focus:border-gold cursor-pointer"
                  >
                    <option value="None">Relaxing Holiday / Escape</option>
                    <option value="Honeymoon">Honeymoon</option>
                    <option value="Wedding Anniversary">Wedding Anniversary</option>
                    <option value="Birthday Celebration">Birthday Celebration</option>
                    <option value="Wellness Retreat">Wellness & Health Retreat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                    Dietary Desires & Special Requests
                  </label>
                  <textarea
                    rows="3"
                    placeholder="E.g., traditional vegetarian culinary preferences, Jain options, flower garlands upon arrival, feather-free pillows..."
                    value={guestInfo.specialRequests}
                    onChange={(e) => setGuestInfo({ ...guestInfo, specialRequests: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand-300 text-sm bg-sand-50 focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 rounded-full border border-sand-300 text-xs font-semibold uppercase tracking-wider text-forest-800 hover:bg-sand-100 transition-colors"
                  >
                    Back to Inclusions
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-forest-900 hover:bg-forest-800 text-white rounded-full text-xs font-semibold tracking-luxury uppercase transition-all shadow-md flex items-center gap-2"
                  >
                    <span>Proceed to Review</span>
                    <ChevronRight className="w-4 h-4 text-gold" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Review & Demo Simulation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Guest Profile Review Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-300 shadow-luxury space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-sand-200">
                    <h4 className="font-serif text-2xl text-forest-950">
                      Guest & Stay Verification
                    </h4>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs text-gold-700 hover:underline font-semibold"
                    >
                      Edit Particulars
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-forest-800">
                    <div>
                      <span className="text-forest-500 block text-[10px] uppercase">Lead Guest</span>
                      <strong className="text-forest-950 font-medium">
                        {guestInfo.title} {guestInfo.firstName} {guestInfo.lastName}
                      </strong>
                    </div>
                    <div>
                      <span className="text-forest-500 block text-[10px] uppercase">Contact</span>
                      <span className="text-forest-950 truncate block">{guestInfo.email}</span>
                      <span className="text-forest-600 block">{guestInfo.phone}</span>
                    </div>
                    <div>
                      <span className="text-forest-500 block text-[10px] uppercase">Occasion</span>
                      <span className="text-forest-950 font-medium">{guestInfo.occasion}</span>
                    </div>
                  </div>

                  {guestInfo.streetAddress && (
                    <div className="text-xs text-forest-800 pt-2 border-t border-sand-100 flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gold-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-forest-500 block text-[10px] uppercase">Billing Address</span>
                        <span>{guestInfo.streetAddress}, {guestInfo.city}, {guestInfo.state} - {guestInfo.pinCode}, India</span>
                      </div>
                    </div>
                  )}

                  {guestInfo.specialRequests && (
                    <div className="p-3 bg-sand-50 rounded-xl text-xs text-forest-700 border border-sand-200">
                      <strong className="text-forest-950">Special Requests: </strong>
                      {guestInfo.specialRequests}
                    </div>
                  )}
                </div>

                {/* Demo Payment Simulation Section */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-300 shadow-luxury space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-sand-200">
                    <div>
                      <span className="text-xs uppercase tracking-luxury text-gold-600 font-semibold block mb-1">
                        Demo Simulation
                      </span>
                      <h4 className="font-serif text-2xl text-forest-950">
                        Demo Payment Simulation
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-gold-600" />
                      <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">
                        Simulation Mode
                      </span>
                    </div>
                  </div>

                  {/* Clearly Labeled Notice */}
                  <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-start gap-3.5 text-xs text-amber-950">
                    <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <strong className="font-semibold block text-amber-900">
                        Demonstration Environment Active:
                      </strong>
                      <p className="text-amber-800/90 leading-relaxed font-sans">
                        No real payment credentials, bank account numbers, UPI PINs, PAN, or KYC documents are ever requested or stored. You may simulate an instant successful reservation or a simulated payment decline using the buttons below.
                      </p>
                    </div>
                  </div>

                  {/* Payment Simulation Channels */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-medium text-forest-700 uppercase tracking-wider block">
                      Select Simulated Payment Channel
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div
                        onClick={() => setPaymentMethod('demo_upi')}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          paymentMethod === 'demo_upi'
                            ? 'border-forest-900 bg-sand-50/80 shadow-sm ring-1 ring-forest-900'
                            : 'border-sand-300 bg-white hover:border-sand-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <Smartphone className="w-4 h-4 text-forest-900" />
                          {paymentMethod === 'demo_upi' && (
                            <div className="w-3.5 h-3.5 rounded-full bg-forest-900 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                        <h6 className="font-serif text-sm font-semibold text-forest-950">Demo UPI</h6>
                        <p className="text-[11px] text-forest-600 font-sans mt-0.5">GPay, PhonePe, Paytm, BHIM</p>
                      </div>

                      <div
                        onClick={() => setPaymentMethod('demo_netbanking')}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          paymentMethod === 'demo_netbanking'
                            ? 'border-forest-900 bg-sand-50/80 shadow-sm ring-1 ring-forest-900'
                            : 'border-sand-300 bg-white hover:border-sand-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <Landmark className="w-4 h-4 text-forest-900" />
                          {paymentMethod === 'demo_netbanking' && (
                            <div className="w-3.5 h-3.5 rounded-full bg-forest-900 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                        <h6 className="font-serif text-sm font-semibold text-forest-950">Demo NetBanking</h6>
                        <p className="text-[11px] text-forest-600 font-sans mt-0.5">HDFC, ICICI, SBI, Axis</p>
                      </div>

                      <div
                        onClick={() => setPaymentMethod('demo_card')}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          paymentMethod === 'demo_card'
                            ? 'border-forest-900 bg-sand-50/80 shadow-sm ring-1 ring-forest-900'
                            : 'border-sand-300 bg-white hover:border-sand-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <CreditCard className="w-4 h-4 text-forest-900" />
                          {paymentMethod === 'demo_card' && (
                            <div className="w-3.5 h-3.5 rounded-full bg-forest-900 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                        <h6 className="font-serif text-sm font-semibold text-forest-950">Demo Card</h6>
                        <p className="text-[11px] text-forest-600 font-sans mt-0.5">RuPay, Visa, Mastercard</p>
                      </div>
                    </div>
                  </div>

                  {/* Dual Action Simulation Controls */}
                  <div className="pt-4 border-t border-sand-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 rounded-full border border-sand-300 text-xs font-semibold uppercase tracking-wider text-forest-800 hover:bg-sand-100 transition-colors disabled:opacity-50 text-center"
                    >
                      Back
                    </button>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      {/* Simulate Payment Failure Option */}
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleSimulatePayment('failure')}
                        className="w-full sm:w-auto px-5 py-3.5 border border-rose-300 bg-rose-50/60 hover:bg-rose-100/80 text-rose-800 rounded-full text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Simulate Payment Failure</span>
                      </button>

                      {/* Simulate Successful Payment Button */}
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleSimulatePayment('success')}
                        className="w-full sm:w-auto px-8 py-3.5 bg-forest-900 hover:bg-forest-800 disabled:opacity-70 text-white rounded-full text-xs font-semibold tracking-luxury uppercase transition-all shadow-xl flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                            <span>Confirming Simulation...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 text-gold" />
                            <span>Simulate Successful Payment ({formatCurrency(grandTotal)})</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sticky Summary Sidebar */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sand-300 shadow-luxury space-y-6">
              <div className="flex items-center gap-4 pb-5 border-b border-sand-200">
                <img
                  src={currentStay.images[0]}
                  alt={currentStay.name}
                  className="w-20 h-20 rounded-2xl object-cover"
                />
                <div>
                  <span className="text-[10px] uppercase tracking-luxury text-gold-600 font-bold block">
                    {currentStay.category}
                  </span>
                  <h4 className="font-serif text-xl text-forest-950 font-semibold">
                    {currentStay.name}
                  </h4>
                  <span className="text-xs text-forest-600 font-sans">
                    {nights} Nights • {adults} Adults {children > 0 ? `, ${children} Children` : ''}
                  </span>
                </div>
              </div>

              {/* Travel Dates */}
              <div className="space-y-2 text-xs text-forest-800 pb-5 border-b border-sand-200">
                <div className="flex justify-between">
                  <span className="text-forest-500">Check-in:</span>
                  <span className="font-medium">{formatDate(checkIn)} (15:00)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest-500">Check-out:</span>
                  <span className="font-medium">{formatDate(checkOut)} (12:00)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest-500">Duration:</span>
                  <span className="font-medium">{nights} Nights</span>
                </div>
              </div>

              {/* Itemized Calculation */}
              <div className="space-y-3 text-xs text-forest-700">
                <div className="flex justify-between">
                  <span>{formatCurrency(currentStay.pricePerNight)} × {nights} nights</span>
                  <span className="font-medium text-forest-950">{formatCurrency(baseTotal)}</span>
                </div>

                {selectedAddons.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-sand-100">
                    <span className="text-[11px] uppercase tracking-wider text-gold-700 font-semibold block">
                      Enhancements:
                    </span>
                    {selectedAddons.map(addon => (
                      <div key={addon.id} className="flex justify-between text-forest-800 pl-2">
                        <span className="truncate pr-2">• {addon.name}</span>
                        <span className="font-medium">{formatCurrency(addon.price)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t border-sand-100">
                  <span>Resort Stewardship & Service Fee (10%)</span>
                  <span className="font-medium text-forest-950">{formatCurrency(serviceFee)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Goods & Services Tax (GST 12%)</span>
                  <span className="font-medium text-forest-950">{formatCurrency(taxes)}</span>
                </div>

                <div className="flex justify-between text-emerald-700">
                  <span>Dedicated Island Butler</span>
                  <span className="uppercase tracking-wider font-semibold text-[10px]">Complimentary</span>
                </div>

                {/* Grand Total */}
                <div className="pt-4 border-t border-sand-200 flex items-center justify-between">
                  <div>
                    <span className="font-serif text-lg text-forest-950 block">Grand Total</span>
                    <span className="text-[10px] text-forest-500 font-sans block">Simulated Demo Amount in INR</span>
                  </div>
                  <span className="font-serif text-2xl sm:text-3xl font-semibold text-forest-950">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Complimentary Guarantee */}
              <div className="p-3.5 bg-sand-50 rounded-2xl border border-sand-200 text-xs text-forest-700 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Complimentary date flexibility up to 14 days prior to arrival.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
