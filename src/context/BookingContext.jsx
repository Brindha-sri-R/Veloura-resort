import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getTodayDateString, calculateNights, generateBookingReference } from '../utils/formatters';
import { staysData as fallbackStays } from '../data/staysData';
import api from '../utils/api';

const BookingContext = createContext(null);

const STORAGE_KEY = 'veloura_reservations_v1';

export function BookingProvider({ children }) {
  // Stays collection (initialized with curated data, synced with MongoDB Atlas)
  const [stays, setStays] = useState(fallbackStays);

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
  const [selectedStay, setSelectedStay] = useState(fallbackStays[0]);

  // Selected add-on amenities for booking
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Stored confirmed bookings (synced across MongoDB Atlas and localStorage)
  const [bookings, setBookings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse saved bookings from localStorage', e);
      return [];
    }
  });

  // Toast / notification banner state
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  // Fetch real stays from MongoDB Atlas on mount
  useEffect(() => {
    let isMounted = true;
    api.getStays()
      .then(res => {
        if (isMounted && res.success && res.stays?.length > 0) {
          setStays(res.stays);
          setSelectedStay(prev => {
            const matched = res.stays.find(s => s.id === prev.id || s.slug === prev.slug);
            return matched || res.stays[0];
          });
        }
      })
      .catch(err => {
        console.warn('Backend stays fetch fallback to offline dataset:', err.message);
      });
    return () => { isMounted = false; };
  }, []);

  // Sync to localStorage whenever bookings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save bookings to localStorage', e);
    }
  }, [bookings]);

  // Fetch user reservations from MongoDB Atlas
  const refreshBookings = useCallback(async (email) => {
    try {
      const res = await api.getMyBookings(email);
      if (res.success && res.bookings) {
        setBookings(prev => {
          // Merge remote bookings with existing local ones, avoiding duplicate references
          const map = new Map();
          res.bookings.forEach(b => map.set(b.reference, b));
          prev.forEach(b => {
            if (!map.has(b.reference)) {
              map.set(b.reference, b);
            }
          });
          return Array.from(map.values());
        });
      }
    } catch (err) {
      console.warn('Could not sync remote bookings from backend:', err.message);
    }
  }, []);

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

  /**
   * Create a reservation.
   * Calls Node/Express backend /api/bookings to generate MongoDB document and Razorpay order.
   * Gracefully falls back to client calculation if server is offline.
   */
  const createBooking = async (bookingData) => {
    try {
      // 1. Attempt Real Backend API Creation
      const apiPayload = {
        stayId: bookingData.stay?.slug || bookingData.stay?.id || bookingData.stay?._id,
        stay: bookingData.stay,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        adults: bookingData.adults,
        children: bookingData.children,
        guest: bookingData.guest,
        addons: bookingData.addons || []
      };

      const res = await api.createBooking(apiPayload);

      if (res.success && res.booking) {
        const serverBooking = res.booking;

        // Upsert into state
        setBookings(prev => {
          const filtered = prev.filter(b => b.reference !== serverBooking.reference);
          return [serverBooking, ...filtered];
        });

        return {
          booking: serverBooking,
          reference: serverBooking.reference,
          simulationData: res.simulationData,
          isBackend: true
        };
      }
    } catch (err) {
      console.warn('Backend reservation creation fell back to local handler:', err.message);
    }

    // 2. Offline / Local Fallback
    const reference = generateBookingReference();
    const nights = Math.max(1, calculateNights(bookingData.checkIn, bookingData.checkOut));
    const pricePerNight = bookingData.stay?.pricePerNight || 75000;
    const baseTotal = nights * pricePerNight;
    const addonsTotal = (bookingData.addons || []).reduce((sum, item) => sum + (item.price || 0), 0);
    const serviceFee = Math.round(baseTotal * 0.10);
    const taxes = Math.round(baseTotal * 0.12);
    const grandTotal = baseTotal + addonsTotal + serviceFee + taxes;

    const fallbackBooking = {
      ...bookingData,
      id: reference,
      reference,
      createdAt: new Date().toISOString(),
      nights,
      staySnapshot: {
        id: bookingData.stay?.id,
        name: bookingData.stay?.name,
        category: bookingData.stay?.category,
        pricePerNight,
        size: bookingData.stay?.size,
        view: bookingData.stay?.view,
        image: bookingData.stay?.images?.[0]
      },
      financials: {
        pricePerNight,
        baseTotal,
        addonsTotal,
        serviceFee,
        taxes,
        grandTotal
      },
      status: 'Confirmed (Local Demo)'
    };

    setBookings(prev => [fallbackBooking, ...prev]);
    showToast(`Reservation ${reference} created in local demo mode.`);
    return {
      booking: fallbackBooking,
      reference,
      simulationData: null,
      isBackend: false
    };
  };

  /**
   * Simulate Payment (Demo Simulation Mode)
   */
  const simulatePayment = async (verificationData) => {
    try {
      const res = await api.simulatePayment(verificationData);
      if (res.booking) {
        setBookings(prev =>
          prev.map(b => b.reference === res.booking.reference ? res.booking : b)
        );
        if (res.success) {
          showToast(`Reservation ${res.booking.reference} confirmed!`);
        } else {
          showToast(res.message || 'Simulated payment declined.', 'error');
        }
        return res.booking;
      }
    } catch (err) {
      console.warn('Simulation fallback:', err.message);
      if (verificationData.simulationOutcome === 'failure') {
        setBookings(prev =>
          prev.map(b => {
            if (b.reference === verificationData.bookingReference) {
              return { ...b, status: 'Payment Failed' };
            }
            return b;
          })
        );
        showToast('Simulated payment declined.', 'error');
        return { reference: verificationData.bookingReference, status: 'Payment Failed' };
      }
    }

    // Update locally if offline
    setBookings(prev =>
      prev.map(b => {
        if (b.reference === verificationData.bookingReference) {
          return { ...b, status: 'Confirmed', paidAt: new Date().toISOString() };
        }
        return b;
      })
    );
    showToast(`Reservation ${verificationData.bookingReference} confirmed!`);
    return null;
  };

  const verifyPayment = simulatePayment;

  /**
   * Cancel an existing reservation
   */
  const cancelBooking = async (reference) => {
    try {
      await api.cancelBooking(reference);
    } catch (err) {
      console.warn('Backend cancel failed, updating locally:', err.message);
    }

    setBookings(prev =>
      prev.map(b => {
        if (b.reference === reference) {
          return { ...b, status: 'Cancelled' };
        }
        return b;
      })
    );

    showToast(`Reservation ${reference} has been cancelled.`, 'info');
  };

  /**
   * Lookup reservation by reference
   */
  const getBookingByReference = (reference) => {
    if (!reference) return null;
    const cleanRef = reference.toUpperCase();
    const found = bookings.find(b => b.reference?.toUpperCase() === cleanRef);
    if (found) return found;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.find(b => b.reference?.toUpperCase() === cleanRef) || null;
      }
    } catch (e) {
      console.error('Error reading localStorage for reference:', e);
    }
    return null;
  };

  return (
    <BookingContext.Provider
      value={{
        stays,
        searchParams,
        updateSearchParams,
        selectedStay,
        setSelectedStay,
        selectedAddons,
        setSelectedAddons,
        toggleAddon,
        bookings,
        refreshBookings,
        createBooking,
        simulatePayment,
        verifyPayment,
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
