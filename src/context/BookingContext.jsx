import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTodayDateString, calculateNights, generateBookingReference } from '../utils/formatters';
import { staysData } from '../data/staysData';

const BookingContext = createContext(null);

const STORAGE_KEY = 'veloura_reservations_v1';

export function BookingProvider({ children }) {
  // Default search parameters
  const [searchParams, setSearchParams] = useState({
    destination: 'All Sanctuaries',
    checkIn: getTodayDateString(7),
    checkOut: getTodayDateString(12),
    adults: 2,
    children: 0,
    category: 'All Stays'
  });

  // Active stay selected for booking
  const [selectedStay, setSelectedStay] = useState(staysData[0]);

  // Selected add-on amenities for booking
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Stored confirmed bookings from localStorage
  const [bookings, setBookings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse saved bookings from localStorage', e);
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save bookings to localStorage', e);
    }
  }, [bookings]);

  // Toast / notification banner state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const updateSearchParams = (params) => {
    setSearchParams(prev => ({ ...prev, ...params }));
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

  const createBooking = (bookingData) => {
    const reference = generateBookingReference();
    const nights = Math.max(1, calculateNights(bookingData.checkIn, bookingData.checkOut));
    const baseTotal = nights * bookingData.stay.pricePerNight;
    const addonsTotal = (bookingData.addons || []).reduce((sum, item) => sum + (item.price || 0), 0);
    const serviceFee = Math.round(baseTotal * 0.10);
    const taxes = Math.round(baseTotal * 0.12);
    const grandTotal = baseTotal + addonsTotal + serviceFee + taxes;

    const newBooking = {
      ...bookingData,
      id: reference,
      reference,
      createdAt: new Date().toISOString(),
      nights,
      financials: {
        pricePerNight: bookingData.stay.pricePerNight,
        baseTotal,
        addonsTotal,
        serviceFee,
        taxes,
        grandTotal
      },
      status: 'Confirmed (Demo)'
    };

    setBookings(prev => {
      const updated = [newBooking, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to sync to localStorage:', err);
      }
      return updated;
    });

    showToast(`Reservation ${reference} successfully created!`);
    return newBooking;
  };

  const cancelBooking = (reference) => {
    setBookings(prev => {
      const updated = prev.filter(b => b.reference !== reference);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to update localStorage on cancel:', err);
      }
      return updated;
    });
    showToast(`Reservation ${reference} has been cancelled.`, 'info');
  };

  const getBookingByReference = (reference) => {
    if (!reference) return null;
    const found = bookings.find(b => b.reference === reference);
    if (found) return found;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.find(b => b.reference === reference) || null;
      }
    } catch (e) {
      console.error('Error reading localStorage for reference:', e);
    }
    return null;
  };

  return (
    <BookingContext.Provider
      value={{
        searchParams,
        updateSearchParams,
        selectedStay,
        setSelectedStay,
        selectedAddons,
        setSelectedAddons,
        toggleAddon,
        bookings,
        createBooking,
        cancelBooking,
        getBookingByReference,
        toast,
        showToast
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

