import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Trash2, ExternalLink, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function MyBookings() {
  const { bookings, cancelBooking } = useBooking();

  return (
    <div className="pt-28 pb-24 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-gold-600 font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guest Itineraries</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-forest-950 font-normal tracking-tight">
            My Reservations
          </h1>
          <p className="mt-3 text-sm text-forest-700/80 font-sans max-w-lg mx-auto">
            Review and manage your active and past reservations saved locally in this browser.
          </p>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.reference}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-300 shadow-luxury flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-luxury-hover transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <img
                    src={booking.stay.images[0]}
                    alt={booking.stay.name}
                    className="w-full sm:w-36 h-28 rounded-2xl object-cover"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gold-700 bg-sand-100 px-2.5 py-0.5 rounded-full">
                        {booking.reference}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Demo Active
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl text-forest-950 font-semibold">
                      {booking.stay.name}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-forest-700">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gold-600" />
                        <span>{formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}</span>
                      </div>
                      <span className="text-sand-300">•</span>
                      <span>{booking.nights} Nights</span>
                    </div>

                    <div className="text-xs text-forest-600">
                      Lead Guest: <span className="font-medium text-forest-900">{booking.guest.firstName} {booking.guest.lastName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-sand-200">
                  <div className="md:text-right">
                    <span className="text-[10px] uppercase tracking-wider text-forest-500 block">Total Investment</span>
                    <span className="font-serif text-2xl font-bold text-forest-950">
                      {formatCurrency(booking.financials.grandTotal)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/confirmation/${booking.reference}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sand-100 hover:bg-sand-200 text-forest-950 text-xs font-medium transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Voucher</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Are you sure you wish to cancel reservation ${booking.reference}?`)) {
                          cancelBooking(booking.reference);
                        }
                      }}
                      className="p-2 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Cancel Demo Reservation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-sand-300 shadow-luxury max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-sand-100 text-forest-700 mx-auto flex items-center justify-center">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl text-forest-950 font-normal">
              No Active Reservations
            </h3>
            <p className="text-sm text-forest-600 leading-relaxed font-sans">
              You haven't reserved any sanctuaries yet. Explore our curated villas and retreat into luxury.
            </p>
            <div className="pt-2">
              <Link
                to="/stays"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-forest-900 hover:bg-forest-800 text-white rounded-full text-xs font-semibold tracking-luxury uppercase transition-all shadow-md"
              >
                <span>Browse Sanctuaries</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

