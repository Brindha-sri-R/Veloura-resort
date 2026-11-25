import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Globe, Calendar, LogOut, Sparkles, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { isValidIndianPhone } from '../utils/formatters';

export default function Profile() {
  const { user, updateProfile, openSignOutModal } = useAuth();
  const { bookings, showToast } = useBooking();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState(user?.country || 'India');
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setCountry(user.country || 'India');
    }
  }, [user]);

  const validate = () => {
    const errors = {};
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      errors.name = 'Full name must be at least 2 characters.';
    }
    if (phone && phone.trim() !== '' && phone.trim() !== '+91') {
      if (!isValidIndianPhone(phone)) {
        errors.phone = 'Valid 10-digit Indian mobile number required (+91 98765 43210).';
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    if (saving || !validate()) return;

    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        country: country.trim() || 'India'
      });
      setStatusMessage('Profile details updated.');
      showToast('Guest profile updated successfully.');
    } catch (err) {
      setFieldErrors({ form: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-luxury text-gold-600 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guest Sanctuary Profile</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-forest-950 font-normal tracking-tight">
            Account Preferences
          </h1>
          <p className="mt-2.5 text-xs sm:text-sm text-forest-700/80 font-sans max-w-md mx-auto">
            Manage your personal details for faster villa reservations.
          </p>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-300 shadow-luxury space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-forest-900 text-gold font-serif text-xl font-bold flex items-center justify-center overflow-hidden flex-shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name ? user.name.charAt(0).toUpperCase() : 'G'
                )}
              </div>
              <div>
                <h2 className="font-serif text-2xl text-forest-950">{user?.name}</h2>
                <p className="text-xs text-forest-600">{user?.email}</p>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Guest ({user?.authProvider || 'email'})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/my-bookings"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-sand-300 hover:border-gold text-forest-900 text-xs font-medium transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-gold-600" />
                <span>Reservations ({bookings?.length || 0})</span>
              </Link>
              <button
                type="button"
                onClick={openSignOutModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {statusMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {fieldErrors.form && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{fieldErrors.form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-forest-800 font-medium mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setFieldErrors(prev => ({ ...prev, name: undefined }));
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border rounded-2xl text-xs text-forest-950 focus:outline-none transition-colors ${
                      fieldErrors.name ? 'border-rose-400 bg-rose-50/20' : 'border-sand-300 focus:border-gold-500'
                    }`}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{fieldErrors.name}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-forest-800 font-medium mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 bg-sand-100 border border-sand-200 rounded-2xl text-xs text-forest-600 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-forest-800 font-medium mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setFieldErrors(prev => ({ ...prev, phone: undefined }));
                    }}
                    placeholder="+91 98765 43210"
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border rounded-2xl text-xs text-forest-950 focus:outline-none transition-colors ${
                      fieldErrors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-sand-300 focus:border-gold-500'
                    }`}
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{fieldErrors.phone}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-forest-800 font-medium mb-1">
                  Country / Region
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-500" />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="India"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-sand-300 focus:border-gold-500 rounded-2xl text-xs text-forest-950 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-7 py-3 bg-forest-900 hover:bg-forest-800 disabled:opacity-60 text-white rounded-full text-xs font-semibold tracking-luxury uppercase transition-all shadow-md"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
