import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, Send, MessageSquare, Clock, 
  HelpCircle, ChevronDown, CheckCircle2, Sparkles, Compass
} from 'lucide-react';
import { faqData } from '../data/faqData';
import { useBooking } from '../context/BookingContext';

export default function Contact() {
  const { showToast } = useBooking();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dates: '',
    subject: 'General Concierge Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been delivered to the Head Island Concierge.');
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  return (
    <div className="pt-28 pb-24 bg-[#FAF7F2] min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-gold-600 font-semibold mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Island Relations & Concierge</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl text-forest-950 font-normal tracking-tight">
          Connect with Veloura
        </h1>
        <p className="mt-4 text-sm sm:text-base text-forest-700/80 font-sans max-w-xl mx-auto leading-relaxed">
          Whether you desire bespoke arrival transfers, customized dietary arrangements, or private island buyouts, our concierge team is at your disposal.
        </p>
      </div>

      {/* Main Grid: Form & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-sand-300 shadow-luxury">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-3xl text-forest-950">
                  Message Received with Honor
                </h3>
                <p className="text-sm text-forest-700 max-w-md mx-auto leading-relaxed">
                  Thank you, {formData.name}. Your inquiry has been routed directly to our Head Island Concierge desk. We reply to all inquiries within two hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', dates: '', subject: 'General Concierge Inquiry', message: '' }); }}
                  className="mt-4 px-6 py-2.5 rounded-full bg-forest-900 text-white text-xs font-semibold tracking-luxury uppercase hover:bg-forest-800 transition-colors"
                >
                  Send Another Dispatch
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <span className="text-xs uppercase tracking-luxury text-gold-600 font-semibold block mb-1">
                    Bespoke Inquiry
                  </span>
                  <h3 className="font-serif text-2xl text-forest-950">
                    Send a Message to Our Concierge
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lord Alexander Wright"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-sand-300 text-sm focus:outline-none focus:border-gold bg-sand-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alexander@wright.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-sand-300 text-sm focus:outline-none focus:border-gold bg-sand-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-sand-300 text-sm focus:outline-none focus:border-gold bg-sand-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                      Target Travel Window
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Spring 2026 / 7 Nights"
                      value={formData.dates}
                      onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-sand-300 text-sm focus:outline-none focus:border-gold bg-sand-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                    Inquiry Type
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand-300 text-sm focus:outline-none focus:border-gold bg-sand-50/50 cursor-pointer"
                  >
                    <option value="General Concierge Inquiry">General Concierge Inquiry</option>
                    <option value="Private Villa Reservation">Private Villa Reservation</option>
                    <option value="Special Celebration & Honeymoon">Special Celebration & Honeymoon</option>
                    <option value="Island Buyout & Filming">Island Buyout & Filming</option>
                    <option value="Seaplane & Private Yacht Charter">Seaplane & Private Yacht Charter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-forest-700 uppercase tracking-wider mb-1">
                    Your Message & Special Desires *
                  </label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Tell us about your envisioned stay, villa preferences, or any specific requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand-300 text-sm focus:outline-none focus:border-gold bg-sand-50/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-forest-900 hover:bg-forest-800 text-white rounded-full text-xs font-semibold tracking-luxury uppercase transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-gold" />
                  <span>Transmit to Island Concierge</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Direct Contacts & Location Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-forest-950 text-white rounded-3xl p-8 border border-forest-800/80 shadow-luxury space-y-6">
              <span className="text-xs uppercase tracking-luxury text-gold font-semibold block">
                Sanctuary Headquarters
              </span>
              <h3 className="font-serif text-2xl text-white">
                Veloura Private Coral Atoll
              </h3>

              <div className="space-y-4 text-xs text-sand-200">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-white block">Location</span>
                    <span>South Azure Archipelago, Atoll 4</span>
                    <span className="block text-sand-400 mt-0.5">GPS: 04°12'26"N 73°30'44"E</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-white block">VIP Concierge Telephone</span>
                    <span>+1 (800) 555-VELOURA (Toll Free)</span>
                    <span className="block text-sand-400 mt-0.5">+1 (800) 555-8356 (International)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-white block">Electronic Correspondence</span>
                    <span>concierge@velouraresort.com</span>
                    <span className="block text-sand-400 mt-0.5">reservations@velouraresort.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-white block">Concierge Hours</span>
                    <span>24 Hours Daily • 365 Days a Year</span>
                  </div>
                </div>
              </div>

              {/* Seaplane Transfer Notice */}
              <div className="p-4 rounded-2xl bg-forest-900 border border-gold/30 text-xs text-sand-300 space-y-1">
                <span className="font-serif text-sm text-gold block">
                  Arrival by Seaplane
                </span>
                <p>
                  Transfers operate in daylight hours. Our VIP Lounge at the international terminal welcomes all guests with cold refreshments and private boarding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-luxury text-gold-600 font-semibold block mb-2">
            Inquiries & Clarity
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-forest-950 font-normal">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-sand-300/80 overflow-hidden shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="font-serif text-lg sm:text-xl text-forest-950 font-medium">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gold-600 flex-shrink-0 transition-transform duration-300 ${
                    openFaqIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openFaqIndex === index && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-forest-700 font-sans leading-relaxed border-t border-sand-200">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

