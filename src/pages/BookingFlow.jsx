import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, Calendar, Users, CheckCircle2, ChevronRight, 
  ArrowLeft, CreditCard, Sparkles, AlertCircle, Info, Lock
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { staysData } from '../data/staysData';
import { formatCurrency, formatDate, calculateNights, getTodayDateString } from '../utils/formatters';

const curatedAddons = [
  {
    id: 'floating-breakfast',
    name: 'Floating Horizon Champagne Breakfast',
    price: 180,
    desc: 'Served on a teak floating tray in your private pool with chilled Krug Champagne & tropical fruits.'
  },
  {
    id: 'seaplane-vip',
    name: 'Private Roundtrip Twin-Otter Seaplane Charter',
    price: 850,
    desc: 'Direct priority seaplane transfer with airport VIP lounge hostess escort.'
  },
  {
    id: 'sunset-teak-cruise',
    name: 'Sunset Dolphin Phinisi Cruise for Two',
    price: 450,
    desc: '3.5 hours on our hand-crafted wooden sailing yacht with caviar and wine pairing.'
  },
  {
    id: 'ayurvedic-couple-spa',
    name: 'Solace Overwater 120-min Ayurvedic Ritual',
    price: 360,
    desc: 'Holistic tandem massage, sound bath and floral bath above turquoise waters.'
  }
];

export default function BookingFlow() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const stayId = searchParams.get('stayId');

  const { 
    selectedStay, setSelectedStay, 
    searchParams: globalSearch, 
    createBooking, 
    showToast 
  } = useBooking();

  // Find stay from stayId param or fallback to context
  const currentStay = staysData.find(s => s.id === stayId) || selectedStay || staysData[0];

  useEffect(() => {
    if (currentStay) {
      setSelectedStay(currentStay);
    }
  }, [stayId]);

  // Step state: 1 = Customizations & Dates, 2 = Guest Info, 3 = Review & Demo Confirm
  const [currentStep, setCurrentStep] = useState(1);

  // Booking states
  const [checkIn, setCheckIn] = useState(globalSearch.checkIn || getTodayDateString(7));
  const [checkOut, setCheckOut] = useState(globalSearch.checkOut || getTodayDateString(12));
  const [adults, setAdults] = useState(globalSearch.adults || 2);
  const [children, setChildren] = useState(globalSearch.children || 0);
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Guest details form state
  const [guestInfo, setGuestInfo] = useState({
    title: 'Mr.',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'United States',
    arrivalTime: '14:00 - 16:00',
    specialRequests: '',
    occasion: 'None'
  });

  // Simulated Payment Form state
  const [paymentInfo, setPaymentInfo] = useState({
    cardholderName: '',
    cardNumber: '•••• •••• •••• 4242',
    expiry: '12/28',
    cvv: '•••'
  });

  const [step1Error, setStep1Error] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [paymentErrors, setPaymentErrors] = useState({});

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
    const cleanPhone = guestInfo.phone.replace(/[^0-9+]/g, '');
    if (!guestInfo.phone.trim() || cleanPhone.length < 7) {
      errors.phone = 'Valid phone number required (min 7 digits)';
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
      if (!paymentInfo.cardholderName.trim()) {
        setPaymentInfo(prev => ({
          ...prev,
          cardholderName: `${guestInfo.firstName} ${guestInfo.lastName}`.trim()
        }));
      }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const validateStep3 = () => {
    const errors = {};
    if (!paymentInfo.cardholderName.trim()) {
      errors.cardholderName = 'Cardholder name is required';
    }
    if (!paymentInfo.cardNumber.trim()) {
      errors.cardNumber = 'Card number is required';
    }
    if (!paymentInfo.expiry.trim()) {
      errors.expiry = 'Card expiry is required';
    }
    if (!paymentInfo.cvv.trim()) {
      errors.cvv = 'CVV is required';
    }
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    const bookingRecord = createBooking({
      stay: currentStay,
      checkIn,
      checkOut,
      adults,
      children,
      guest: guestInfo,
      addons: selectedAddons,
    });

    navigate(`/confirmation/${bookingRecord.reference}`);
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
                    className="w-full sm:w-44 h-32 rounded-2xl object-cover"
                  />
                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <span className="text-[10px] uppercase tracking-luxury text-gold-600 font-bold">
                      Selected Sanctuary
                    </span>
                    <h3 className="font-serif text-2xl text-forest-950 font-semibold">
                      {currentStay.name}
                    </h3>
                    <p className="text-xs text-forest-600 font-sans">
                      {currentStay.size} • Up to {currentStay.maxGuests} Guests • {currentStay.view}
                    </p>
                    <div className="pt-2 text-xs font-semibold text-forest-950">
                      {formatCurrency(currentStay.pricePerNight)} <span className="font-normal text-forest-600">/ night</span>
                    </div>
                  </div>
                </div>

                {/* Dates & Guests Adjustment */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-300 shadow-luxury space-y-4">
                  <h4 className="font-serif text-2xl text-forest-950">
                    Travel Itinerary Dates
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-sand-50 rounded-2xl border border-sand-200">
                      <label className="block text-[10px] uppercase tracking-luxury text-forest-700 font-semibold mb-1">
                        Arrival Date
                      </label>
                      <input
                        type="date"
                        min={getTodayDateString(0)}
                        value={checkIn}
                        onChange={handleCheckInChange}
                        className="w-full bg-transparent text-sm font-medium text-forest-950 focus:outline-none cursor-pointer"
                      />
                    </div>

                    <div className="p-3.5 bg-sand-50 rounded-2xl border border-sand-200">
                      <label className="block text-[10px] uppercase tracking-luxury text-forest-700 font-semibold mb-1">
                        Departure Date ({nights} Nights)
                      </label>
                      <input
                        type="date"
                        min={checkIn || getTodayDateString(1)}
                        value={checkOut}
                        onChange={handleCheckOutChange}
                        className="w-full bg-transparent text-sm font-medium text-forest-950 focus:outline-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {step1Error && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2 animate-[fadeIn_0.2s_ease-out]">
                      <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>{step1Error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3.5 bg-sand-50 rounded-2xl border border-sand-200">
                      <label className="block text-[10px] uppercase tracking-luxury text-forest-700 font-semibold mb-1">
                        Adults (13+)
                      </label>
                      <select
                        value={adults}
                        onChange={(e) => { setAdults(Number(e.target.value)); setStep1Error(''); }}
                        className="w-full bg-transparent text-sm font-medium text-forest-950 focus:outline-none cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>

                    <div className="p-3.5 bg-sand-50 rounded-2xl border border-sand-200">
                      <label className="block text-[10px] uppercase tracking-luxury text-forest-700 font-semibold mb-1">
                        Children (0-12)
                      </label>
                      <select
                        value={children}
                        onChange={(e) => { setChildren(Number(e.target.value)); setStep1Error(''); }}
                        className="w-full bg-transparent text-sm font-medium text-forest-950 focus:outline-none cursor-pointer"
                      >
                        {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Child{n !== 1 ? 'ren' : ''}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Curated Enhancements */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-300 shadow-luxury space-y-5">
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
                    Please provide the lead guest’s particulars for personal butler assignment and immigration clearance.
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
                      <option>Lord</option>
                      <option>Lady</option>
                    </select>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Julian"
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
                      placeholder="e.g. Montgomery"
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
                      placeholder="julian@montgomery.com"
                      value={guestInfo.email}
                      onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm bg-sand-50 focus:outline-none focus:border-gold ${formErrors.email ? 'border-rose-400' : 'border-sand-300'}`}
                    />
                    {formErrors.email && <span className="text-[11px] text-rose-500">{formErrors.email}</span>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 392-1092"
                      value={guestInfo.phone}
                      onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm bg-sand-50 focus:outline-none focus:border-gold ${formErrors.phone ? 'border-rose-400' : 'border-sand-300'}`}
                    />
                    {formErrors.phone && <span className="text-[11px] text-rose-500">{formErrors.phone}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                      Country of Residence
                    </label>
                    <input
                      type="text"
                      value={guestInfo.country}
                      onChange={(e) => setGuestInfo({ ...guestInfo, country: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-sand-300 text-sm bg-sand-50 focus:outline-none focus:border-gold"
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
                    placeholder="E.g., champagne on ice upon arrival, dairy-free / vegan dining preferences, feather-free pillows..."
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

            {/* STEP 3: Review & Simulated Reservation */}
            {currentStep === 3 && (
              <form onSubmit={handleFinalSubmit} className="space-y-6">
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

                  {guestInfo.specialRequests && (
                    <div className="p-3 bg-sand-50 rounded-xl text-xs text-forest-700 border border-sand-200">
                      <strong className="text-forest-950">Special Requests: </strong>
                      {guestInfo.specialRequests}
                    </div>
                  )}
                </div>

                {/* Simulated Payment Section with prominent DEMO Notice */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-300 shadow-luxury space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-luxury text-gold-600 font-semibold block mb-1">
                        Demonstration Security
                      </span>
                      <h4 className="font-serif text-2xl text-forest-950">
                        Guarantee Your Reservation
                      </h4>
                    </div>
                    <Lock className="w-5 h-5 text-gold-600" />
                  </div>

                  {/* Demo Alert Box */}
                  <div className="p-4 rounded-2xl bg-sand-100 border border-gold/40 flex items-start gap-3">
                    <Info className="w-5 h-5 text-gold-700 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-forest-900 leading-relaxed font-sans">
                      <strong>Demo Environment Notice:</strong> This is a portfolio demonstration website. No actual credit card charge, real transaction, or real reservation will occur. You may submit with the pre-filled mock details below to generate a demo reservation reference code.
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                        Cardholder Name (Demo)
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cardholderName}
                        onChange={(e) => {
                          setPaymentInfo({ ...paymentInfo, cardholderName: e.target.value });
                          if (paymentErrors.cardholderName) setPaymentErrors({ ...paymentErrors, cardholderName: '' });
                        }}
                        className={`w-full px-4 py-3 rounded-xl border text-sm bg-sand-50 text-forest-950 focus:outline-none focus:border-gold ${
                          paymentErrors.cardholderName ? 'border-rose-400' : 'border-sand-300'
                        }`}
                        required
                      />
                      {paymentErrors.cardholderName && <span className="text-[11px] text-rose-500 mt-1 block">{paymentErrors.cardholderName}</span>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      <div className="sm:col-span-7">
                        <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                          Card Number (Demo)
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                          <input
                            type="text"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => {
                              setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value });
                              if (paymentErrors.cardNumber) setPaymentErrors({ ...paymentErrors, cardNumber: '' });
                            }}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm bg-sand-50 text-forest-950 focus:outline-none focus:border-gold font-mono ${
                              paymentErrors.cardNumber ? 'border-rose-400' : 'border-sand-300'
                            }`}
                            required
                          />
                        </div>
                        {paymentErrors.cardNumber && <span className="text-[11px] text-rose-500 mt-1 block">{paymentErrors.cardNumber}</span>}
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.expiry}
                          onChange={(e) => {
                            setPaymentInfo({ ...paymentInfo, expiry: e.target.value });
                            if (paymentErrors.expiry) setPaymentErrors({ ...paymentErrors, expiry: '' });
                          }}
                          className={`w-full px-3.5 py-3 rounded-xl border text-sm bg-sand-50 text-forest-950 text-center font-mono focus:outline-none focus:border-gold ${
                            paymentErrors.expiry ? 'border-rose-400' : 'border-sand-300'
                          }`}
                          required
                        />
                        {paymentErrors.expiry && <span className="text-[11px] text-rose-500 mt-1 block">{paymentErrors.expiry}</span>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) => {
                            setPaymentInfo({ ...paymentInfo, cvv: e.target.value });
                            if (paymentErrors.cvv) setPaymentErrors({ ...paymentErrors, cvv: '' });
                          }}
                          className={`w-full px-3 py-3 rounded-xl border text-sm bg-sand-50 text-forest-950 text-center font-mono focus:outline-none focus:border-gold ${
                            paymentErrors.cvv ? 'border-rose-400' : 'border-sand-300'
                          }`}
                          required
                        />
                        {paymentErrors.cvv && <span className="text-[11px] text-rose-500 mt-1 block">{paymentErrors.cvv}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 rounded-full border border-sand-300 text-xs font-semibold uppercase tracking-wider text-forest-800 hover:bg-sand-100 transition-colors"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      className="px-8 py-4 bg-forest-900 hover:bg-forest-800 text-white rounded-full text-xs font-semibold tracking-luxury uppercase transition-all shadow-xl flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-gold" />
                      <span>Confirm Reservation (Demo)</span>
                    </button>
                  </div>
                </div>
              </form>
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
                  <span>Resort & Conservation (10%)</span>
                  <span className="font-medium text-forest-950">{formatCurrency(serviceFee)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tourism Sustainability Tax (12%)</span>
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
                    <span className="text-[10px] text-forest-500 font-sans block">Simulated Demo Amount</span>
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

