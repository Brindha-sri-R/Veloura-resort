import React, { useState } from 'react';
import { X, CheckCircle2, Clock, MapPin, Sparkles, Send } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function ExperienceModal({ experience, onClose }) {
  const { showToast } = useBooking();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    preferredDate: '',
    guestsCount: 2,
    specialRequests: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!experience) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast(`Inquiry for "${experience.title}" received! Our concierge will contact you.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-forest-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-sand-300 max-w-2xl w-full overflow-hidden z-10 animate-[fadeIn_0.3s_ease]">
        {/* Header Image */}
        <div className="relative h-56 sm:h-64 overflow-hidden bg-forest-950">
          <img
            src={experience.image}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-forest-950/70 border border-white/20 text-white flex items-center justify-center hover:bg-forest-900 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="text-[10px] uppercase tracking-luxury text-gold block font-semibold mb-1">
              {experience.category} • {experience.tag}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium">
              {experience.title}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-3xl text-forest-950">
                Inquiry Received
              </h4>
              <p className="text-sm text-forest-700 max-w-md mx-auto leading-relaxed">
                Thank you, {formData.name}. Our Head Island Concierge has received your interest for <strong>{experience.title}</strong> and will reach out to tailor your itinerary.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-forest-900 text-white rounded-full text-xs font-semibold tracking-luxury uppercase hover:bg-forest-800 transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-6 text-xs text-forest-700 pb-4 border-b border-sand-200">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gold-600" />
                  <span>Duration: {experience.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gold-600" />
                  <span>{experience.location}</span>
                </div>
              </div>

              <div>
                <h5 className="text-xs uppercase tracking-luxury text-forest-600 font-semibold mb-2">
                  Experience Overview
                </h5>
                <p className="text-sm text-forest-800 leading-relaxed font-sans">
                  {experience.description}
                </p>
                <p className="text-xs text-forest-600 mt-2 italic font-serif">
                  {experience.details}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-sand-200">
                <h5 className="text-xs uppercase tracking-luxury text-forest-900 font-bold">
                  Bespoke Concierge Inquiry
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lady Evelyn Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:border-forest-800 bg-sand-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. evelyn@vance.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:border-forest-800 bg-sand-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:border-forest-800 bg-sand-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={formData.guestsCount}
                      onChange={(e) => setFormData({ ...formData, guestsCount: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:border-forest-800 bg-sand-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                    Special Requests or Dietary Requirements
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Tell us about special occasions, dietary desires, or tailored timing..."
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:border-forest-800 bg-sand-50/50"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-full border border-sand-300 text-forest-800 text-xs font-semibold tracking-wider uppercase hover:bg-sand-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-forest-900 hover:bg-forest-800 text-white rounded-full text-xs font-semibold tracking-luxury uppercase transition-colors shadow-md"
                  >
                    <Send className="w-3.5 h-3.5 text-gold" />
                    <span>Submit Inquiry</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

