import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, Printer, Calendar, Users, MapPin, 
  ArrowRight, ShieldCheck, Sparkles, Download, Home, Phone
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function BookingConfirmation() {
  const { reference } = useParams();
  const { getBookingByReference, bookings } = useBooking();

  const booking = getBookingByReference(reference);

  if (!booking) {
    return (
      <div className="pt-36 pb-24 bg-[#FAF7F2] min-h-screen text-center px-4">
        <h2 className="font-serif text-3xl text-forest-950 mb-3">Reservation Not Found</h2>
        <p className="text-sm text-forest-600 mb-6 font-sans">
          We could not locate reference {reference}. It may have been cleared from local demo storage.
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

  return (
    <div className="pt-28 pb-24 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header Notification */}
        <div className="text-center mb-10 space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-luxury text-gold-600 font-bold block">
            Reservation Confirmed
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-forest-950 font-normal">
            We Await Your Arrival
          </h1>
          <p className="text-sm text-forest-700/80 max-w-lg mx-auto font-sans leading-relaxed">
            Your private sanctuary has been reserved. A confirmation dispatch has been logged to your demo records.
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
                Sanctuary Booking Voucher
              </span>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase tracking-luxury text-forest-500 block">
                Confirmation Reference
              </span>
              <span className="font-mono text-lg sm:text-xl font-bold text-forest-950 tracking-wider">
                {booking.reference}
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 uppercase tracking-wider mt-1">
                Demo Confirmed
              </span>
            </div>
          </div>

          {/* Reserved Stay Profile */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center p-5 bg-sand-50 rounded-2xl border border-sand-200">
            <img
              src={booking.stay.images[0]}
              alt={booking.stay.name}
              className="sm:col-span-4 w-full h-36 rounded-xl object-cover"
            />
            <div className="sm:col-span-8 space-y-1.5">
              <span className="text-[10px] uppercase tracking-luxury text-gold-600 font-bold">
                {booking.stay.category}
              </span>
              <h3 className="font-serif text-2xl text-forest-950 font-semibold">
                {booking.stay.name}
              </h3>
              <p className="text-xs text-forest-700 font-sans">
                {booking.stay.size} • {booking.stay.view}
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-forest-800">
                <span className="px-2.5 py-0.5 rounded-md bg-white border border-sand-200">
                  {booking.stay.bedType}
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
                {booking.guest.title} {booking.guest.firstName} {booking.guest.lastName}
              </strong>
              <span className="text-[11px] text-forest-600 truncate block">{booking.guest.email}</span>
            </div>
          </div>

          {/* Add-ons if any */}
          {booking.addons && booking.addons.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-luxury text-gold-600 font-semibold block">
                Selected Enhancements
              </span>
              <div className="space-y-1.5">
                {booking.addons.map((addon) => (
                  <div key={addon.id} className="flex justify-between text-xs text-forest-800 p-2.5 bg-sand-50 rounded-xl">
                    <span>{addon.name}</span>
                    <span className="font-semibold">{formatCurrency(addon.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial Breakdown */}
          <div className="p-5 bg-sand-50/70 rounded-2xl border border-sand-200 space-y-2 text-xs text-forest-700">
            <div className="flex justify-between">
              <span>Sanctuary Nightly Rate ({booking.nights} Nights)</span>
              <span className="font-medium text-forest-950">{formatCurrency(booking.financials.baseTotal)}</span>
            </div>
            {booking.financials.addonsTotal > 0 && (
              <div className="flex justify-between">
                <span>Selected Enhancements Total</span>
                <span className="font-medium text-forest-950">{formatCurrency(booking.financials.addonsTotal)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Resort & Ecological Service Fee (10%)</span>
              <span className="font-medium text-forest-950">{formatCurrency(booking.financials.serviceFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tourism Sustainability Tax (12%)</span>
              <span className="font-medium text-forest-950">{formatCurrency(booking.financials.taxes)}</span>
            </div>

            <div className="pt-3 border-t border-sand-300 flex justify-between items-center text-sm font-semibold text-forest-950">
              <span className="font-serif text-base">Grand Total (Demo Guaranteed)</span>
              <span className="font-serif text-2xl text-forest-950">
                {formatCurrency(booking.financials.grandTotal)}
              </span>
            </div>
          </div>

          {/* Demonstration Notice Box */}
          <div className="p-4 rounded-xl bg-forest-950 text-sand-200 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-gold font-semibold uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Simulated Portfolio Demonstration</span>
            </div>
            <p className="leading-relaxed font-sans text-sand-300">
              This reservation has been persisted to your browser’s LocalStorage. No real payment, charge, or real-world hotel booking occurred. You may review or cancel this simulated reservation at any time from "My Bookings".
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-sand-200">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-forest-900 text-forest-900 hover:bg-forest-900 hover:text-white text-xs font-semibold tracking-luxury uppercase transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Reservation Voucher</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                to="/my-bookings"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center px-6 py-3 rounded-full bg-sand-200 hover:bg-sand-300 text-forest-950 text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                My Bookings
              </Link>
              <Link
                to="/"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center px-6 py-3 rounded-full bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold tracking-luxury uppercase transition-all shadow-md"
              >
                <span>Return Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

