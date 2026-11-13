import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, Printer, Calendar, Users, MapPin, 
  ArrowRight, ShieldCheck, Sparkles, Download, Home, Phone, AlertCircle, XCircle
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import api from '../utils/api';

export default function BookingConfirmation() {
  const { reference } = useParams();
  const { getBookingByReference } = useBooking();

  const [booking, setBooking] = useState(() => getBookingByReference ? getBookingByReference(reference) : null);
  const [loading, setLoading] = useState(!booking);

  // If not found in local memory, attempt remote fetch from MongoDB Atlas
  useEffect(() => {
    if (!booking && reference) {
      setLoading(true);
      api.getBooking(reference)
        .then(res => {
          if (res.success && res.booking) {
            setBooking(res.booking);
          }
        })
        .catch(err => {
          console.warn('Could not fetch reservation remotely:', err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [reference, booking]);

  if (loading) {
    return (
      <div className="pt-36 pb-24 bg-[#FAF7F2] min-h-screen text-center px-4 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-forest-700 font-serif">Retrieving sanctuary itinerary...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="pt-36 pb-24 bg-[#FAF7F2] min-h-screen text-center px-4">
        <h2 className="font-serif text-3xl text-forest-950 mb-3">Reservation Not Found</h2>
        <p className="text-sm text-forest-600 mb-6 font-sans">
          We could not locate reservation reference {reference}.
        </p>
        <Link
          to="/stays"
          className="inline-flex px-6 py-3 bg-forest-900 text-white rounded-full text-xs font-semibold tracking-luxury uppercase"
        >
          Explore Stays
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const staySnapshot = booking.staySnapshot || {};
  const stayObj = booking.stay || {};
  const stayName = staySnapshot.name || stayObj.name || 'Veloura Sanctuary Residence';
  const stayCategory = staySnapshot.category || stayObj.category || 'Oceanfront Villa';
  const stayImage = staySnapshot.image || stayObj.images?.[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80';
  const staySize = staySnapshot.size || stayObj.size || '320 m² / 3,444 sq ft';
  const stayView = staySnapshot.view || stayObj.view || 'Panoramic Ocean View';
  const bedType = stayObj.bedType || 'Custom King Cloud Bed';

  const isConfirmed = booking.status === 'Confirmed' || booking.status?.includes('Confirmed');
  const isCancelled = booking.status === 'Cancelled';
  const isFailed = booking.status === 'Payment Failed';

  return (
    <div className="pt-28 pb-24 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Status Header Notification */}
        <div className="text-center mb-10 space-y-3">
          {isFailed ? (
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 mx-auto flex items-center justify-center shadow-sm">
              <XCircle className="w-8 h-8" />
            </div>
          ) : isCancelled ? (
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center shadow-sm">
              <AlertCircle className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          )}

          <span className="text-xs uppercase tracking-luxury text-gold-600 font-bold block">
            Reservation {isCancelled ? 'Cancelled' : isFailed ? 'Payment Simulated Decline' : 'Confirmed'}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-forest-950 font-normal">
            {isCancelled ? 'Itinerary Cancelled' : isFailed ? 'Simulated Payment Declined' : 'We Await Your Arrival'}
          </h1>
          <p className="text-sm text-forest-700/80 max-w-lg mx-auto font-sans leading-relaxed">
            {isCancelled
              ? `Reservation reference ${booking.reference} has been officially cancelled in our records.`
              : isFailed
              ? `Simulated transaction was declined for reservation ${booking.reference}. No funds were debited in demo mode.`
              : 'Your private sanctuary has been reserved and synchronized with our records.'}
          </p>
        </div>

        {/* Printable Reservation Voucher */}
        <div id="printable-voucher" className="bg-white rounded-3xl p-6 sm:p-10 border border-sand-300 shadow-luxury space-y-8">
          {/* Voucher Top Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-sand-200 gap-4">
            <div>
              <div className="font-serif text-3xl tracking-luxury text-forest-950 font-medium">
                VELOURA
              </div>
              <span className="text-[10px] uppercase tracking-widest text-gold-600 block">
                Sanctuary Booking Voucher (India)
              </span>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase tracking-luxury text-forest-500 block">
                Confirmation Reference
              </span>
              <span className="font-mono text-lg sm:text-xl font-bold text-forest-950 tracking-wider">
                {booking.reference}
              </span>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider mt-1 ${
                  isFailed
                    ? 'bg-rose-100 text-rose-800'
                    : isCancelled
                    ? 'bg-amber-100 text-amber-800'
                    : isConfirmed
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-sand-200 text-forest-800'
                }`}
              >
                {booking.status}
              </span>
            </div>
          </div>

          {/* Reserved Stay Profile */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center p-5 bg-sand-50 rounded-2xl border border-sand-200">
            <img
              src={stayImage}
              alt={stayName}
              className="sm:col-span-4 w-full h-36 rounded-xl object-cover"
            />
            <div className="sm:col-span-8 space-y-1.5">
              <span className="text-[10px] uppercase tracking-luxury text-gold-600 font-bold">
                {stayCategory}
              </span>
              <h3 className="font-serif text-2xl text-forest-950 font-semibold">
                {stayName}
              </h3>
              <p className="text-xs text-forest-700 font-sans">
                {staySize} • {stayView}
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-forest-800">
                <span className="px-2.5 py-0.5 rounded-md bg-white border border-sand-200">
                  {bedType}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-white border border-sand-200">
                  Private Butler Included
                </span>
              </div>
            </div>
          </div>

          {/* Key Stay Particulars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-sand-200 text-xs text-forest-800">
            <div>
              <span className="text-forest-500 uppercase text-[10px] block">Check-In</span>
              <strong className="text-forest-950 block mt-0.5">{formatDate(booking.checkIn)}</strong>
              <span className="text-[11px] text-forest-600">From 15:00</span>
            </div>

            <div>
              <span className="text-forest-500 uppercase text-[10px] block">Check-Out</span>
              <strong className="text-forest-950 block mt-0.5">{formatDate(booking.checkOut)}</strong>
              <span className="text-[11px] text-forest-600">Until 12:00 ({booking.nights} Nights)</span>
            </div>

            <div>
              <span className="text-forest-500 uppercase text-[10px] block">Guests</span>
              <strong className="text-forest-950 block mt-0.5">
                {booking.adults} Adults {booking.children > 0 ? `, ${booking.children} Kids` : ''}
              </strong>
            </div>

            <div>
              <span className="text-forest-500 uppercase text-[10px] block">Lead Guest</span>
              <strong className="text-forest-950 block mt-0.5">
                {booking.guest?.title} {booking.guest?.firstName} {booking.guest?.lastName}
              </strong>
              <span className="text-[11px] text-forest-600 truncate block">{booking.guest?.email}</span>
              <span className="text-[11px] text-forest-600 block">{booking.guest?.phone}</span>
            </div>
          </div>

          {/* Guest Indian Address Card */}
          {booking.guest?.streetAddress && (
            <div className="p-4 bg-sand-50/70 rounded-2xl border border-sand-200 flex items-start gap-3 text-xs text-forest-800">
              <MapPin className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-forest-500 uppercase text-[10px] font-semibold block">
                  Registered Indian Address
                </span>
                <p className="text-forest-950 font-medium">
                  {booking.guest.streetAddress}, {booking.guest.city}, {booking.guest.state} - {booking.guest.pinCode}, India
                </p>
              </div>
            </div>
          )}

          {/* Add-ons if any */}
          {booking.addons && booking.addons.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-luxury text-gold-600 font-semibold block">
                Selected Enhancements
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {booking.addons.map((addon) => (
                  <div key={addon.id} className="p-3 bg-sand-50 rounded-xl text-xs flex justify-between items-center border border-sand-200">
                    <span className="font-medium text-forest-950">{addon.name}</span>
                    <span className="font-semibold text-forest-700">{formatCurrency(addon.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial Breakdown */}
          <div className="bg-sand-50/80 rounded-2xl p-6 border border-sand-200 space-y-3 text-xs">
            <span className="text-[10px] uppercase tracking-luxury text-forest-600 font-bold block mb-1">
              Payment Summary (INR ₹)
            </span>
            <div className="flex justify-between text-forest-700">
              <span>Sanctuary Accommodations ({booking.nights} nights)</span>
              <span className="font-medium text-forest-950">{formatCurrency(booking.financials?.baseTotal || 0)}</span>
            </div>
            {booking.financials?.addonsTotal > 0 && (
              <div className="flex justify-between text-forest-700">
                <span>Enhancements & Experiences</span>
                <span className="font-medium text-forest-950">{formatCurrency(booking.financials.addonsTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-forest-700">
              <span>Resort Stewardship & Service Fee (10%)</span>
              <span className="font-medium text-forest-950">{formatCurrency(booking.financials?.serviceFee || 0)}</span>
            </div>
            <div className="flex justify-between text-forest-700">
              <span>Goods & Services Tax (GST 12%)</span>
              <span className="font-medium text-forest-950">{formatCurrency(booking.financials?.taxes || 0)}</span>
            </div>
            <div className="pt-3 border-t border-sand-300 flex justify-between items-center text-sm">
              <span className="font-bold text-forest-950 uppercase tracking-wider">Total Amount</span>
              <span className="font-serif text-2xl font-bold text-forest-950">
                {formatCurrency(booking.financials?.grandTotal || 0)}
              </span>
            </div>
          </div>

          {/* Host & Concierge Notes */}
          <div className="p-4 rounded-xl bg-forest-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gold flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gold">24/7 Island Concierge & Arrival Desk</p>
                <p className="text-[11px] text-white/70">Toll-Free: 1800-123-VELOURA | Direct: +91 (22) 6123-8356</p>
              </div>
            </div>
            <div className="text-right text-xs text-gold">
              concierge@velouraresort.in
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-sand-300 text-xs uppercase tracking-luxury font-semibold text-forest-900 hover:bg-sand-100 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 text-gold-600" />
            <span>Print Voucher</span>
          </button>

          <Link
            to="/my-bookings"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-900 text-white text-xs uppercase tracking-luxury font-semibold hover:bg-forest-800 transition-colors shadow-md"
          >
            <span>My Reservations</span>
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sand-200 text-forest-950 text-xs uppercase tracking-luxury font-semibold hover:bg-sand-300 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Sanctuary</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
