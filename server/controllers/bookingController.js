import Booking from '../models/Booking.js';
import Stay from '../models/Stay.js';
import generateBookingReference from '../utils/generateReference.js';

// Helper: Calculate nights between YYYY-MM-DD strings in local/UTC dates
const calculateNights = (inDate, outDate) => {
  if (!inDate || !outDate) return 1;
  const start = new Date(inDate);
  const end = new Date(outDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
};

// @desc    Create a new booking with backend financial calculation in INR
// @route   POST /api/bookings
// @access  Public (Optional Auth for guest checkout)
export const createBooking = async (req, res, next) => {
  try {
    const {
      stayId,
      stay: clientStay,
      checkIn,
      checkOut,
      adults = 2,
      children = 0,
      guest,
      addons = [],
      paymentMethod = 'demo_simulation'
    } = req.body;

    // 1. Basic validation
    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Arrival and departure dates are required.'
      });
    }

    if (!guest || !guest.firstName || !guest.lastName || !guest.email || !guest.phone) {
      return res.status(400).json({
        success: false,
        message: 'Guest contact information (first name, last name, email, mobile) is required.'
      });
    }

    // 2. Fetch Stay details from DB
    const lookupId = stayId || (clientStay && (clientStay.slug || clientStay.id || clientStay._id));
    if (!lookupId) {
      return res.status(400).json({
        success: false,
        message: 'A valid sanctuary selection is required.'
      });
    }

    let stay = await Stay.findOne({
      $or: [
        { slug: lookupId },
        { id: lookupId },
        ...(lookupId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: lookupId }] : [])
      ]
    });

    // Fallback if stay not in DB yet
    let stayDocId = stay ? stay._id : null;
    let pricePerNight = stay ? stay.pricePerNight : (clientStay?.pricePerNight || 75000);

    const staySnapshot = {
      id: stay ? stay.id : (clientStay?.id || 'residence'),
      name: stay ? stay.name : (clientStay?.name || 'Veloura Sanctuary Residence'),
      category: stay ? stay.category : (clientStay?.category || 'Oceanfront Villa'),
      pricePerNight,
      size: stay ? stay.size : (clientStay?.size || '320 m² / 3,444 sq ft'),
      view: stay ? stay.view : (clientStay?.view || 'Panoramic Ocean View'),
      image: stay ? stay.images[0] : (clientStay?.images?.[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80')
    };

    if (!stayDocId) {
      const anyStay = await Stay.findOne();
      if (anyStay) {
        stayDocId = anyStay._id;
      }
    }

    // 3. Compute Financials strictly on the server in INR (₹)
    const nights = calculateNights(checkIn, checkOut);
    const baseTotal = nights * pricePerNight;
    const addonsTotal = (addons || []).reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    const serviceFee = Math.round(baseTotal * 0.10); // 10% Island Stewardship Service Fee
    const taxes = Math.round(baseTotal * 0.12);      // 12% Indian GST Hospitality Tax
    const grandTotal = baseTotal + addonsTotal + serviceFee + taxes;

    // 4. Generate unique luxury reference (e.g. VEL-4921-8201)
    const reference = generateBookingReference();

    // 5. Build Booking Record
    const booking = new Booking({
      reference,
      user: req.user ? req.user._id : null,
      stay: stayDocId,
      staySnapshot,
      checkIn,
      checkOut,
      nights,
      adults: Number(adults) || 1,
      children: Number(children) || 0,
      guest: {
        title: guest.title || 'Mr.',
        firstName: guest.firstName.trim(),
        lastName: guest.lastName.trim(),
        email: guest.email.trim().toLowerCase(),
        phone: guest.phone.trim(),
        country: guest.country || 'India',
        streetAddress: guest.streetAddress ? guest.streetAddress.trim() : '',
        city: guest.city ? guest.city.trim() : '',
        state: guest.state ? guest.state.trim() : '',
        pinCode: guest.pinCode ? String(guest.pinCode).trim() : '',
        arrivalTime: guest.arrivalTime || '14:00 - 16:00',
        specialRequests: guest.specialRequests || '',
        occasion: guest.occasion || 'None'
      },
      addons: (addons || []).map(a => ({
        id: a.id,
        name: a.name,
        price: a.price,
        desc: a.desc || ''
      })),
      financials: {
        pricePerNight,
        baseTotal,
        addonsTotal,
        serviceFee,
        taxes,
        grandTotal
      },
      payment: {
        method: paymentMethod || 'demo_simulation',
        status: 'pending',
        currency: 'INR',
        simulationMode: true
      },
      status: 'Pending Payment'
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Sanctuary reservation initiated. Ready for demo payment simulation.',
      booking,
      simulationData: {
        reference,
        amount: grandTotal,
        currency: 'INR',
        mode: 'Demo Simulation'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Simulate payment with success and failure states (Demo Simulation Mode)
// @route   POST /api/bookings/simulate-payment (and POST /api/bookings/verify)
// @access  Public
export const simulatePayment = async (req, res, next) => {
  try {
    const {
      bookingReference,
      simulationOutcome,
      outcome,
      paymentMethod,
      method
    } = req.body;

    const actualOutcome = simulationOutcome || outcome || 'success';
    const actualMethod = paymentMethod || method || 'demo_simulation';

    if (!bookingReference) {
      return res.status(400).json({
        success: false,
        message: 'Booking reference is required for payment simulation.'
      });
    }

    const booking = await Booking.findOne({ reference: bookingReference.toUpperCase() });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Reservation ${bookingReference} not found.`
      });
    }

    if (actualOutcome === 'failure') {
      booking.payment.status = 'failed';
      booking.payment.method = actualMethod;
      booking.payment.failureReason = 'Simulated payment declined by user / bank test decline.';
      booking.status = 'Payment Failed';
      await booking.save();

      return res.status(200).json({
        success: false,
        message: 'Demo payment simulated failure: transaction was declined as requested.',
        booking
      });
    }

    // Successful simulation
    booking.payment.status = 'paid';
    booking.payment.method = actualMethod;
    booking.payment.transactionId = `SIM-INR-${Date.now()}`;
    booking.payment.paidAt = new Date();
    booking.payment.failureReason = null;
    booking.status = 'Confirmed';

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Demo payment simulation completed successfully. Sanctuary reservation confirmed.',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// Alias verifyPayment to simulatePayment for backward compatibility
export const verifyPayment = simulatePayment;

// @desc    Get bookings for authenticated user or by guest email query
// @route   GET /api/bookings/my
// @access  Public / Optional Auth
export const getMyBookings = async (req, res, next) => {
  try {
    let query = null;

    if (req.user) {
      query = {
        $or: [
          { user: req.user._id },
          { 'guest.email': req.user.email.toLowerCase() }
        ]
      };
    } else if (req.query.email) {
      query = {
        'guest.email': req.query.email.trim().toLowerCase()
      };
    } else {
      return res.status(200).json({
        success: true,
        count: 0,
        bookings: []
      });
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lookup booking by reference & guest email
// @route   GET /api/bookings/lookup
// @access  Public
export const lookupBooking = async (req, res, next) => {
  try {
    const { reference, email } = req.query;
    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Reference is required for itinerary lookup.'
      });
    }

    const query = { reference: reference.toUpperCase() };
    if (email) {
      query['guest.email'] = email.trim().toLowerCase();
    }

    const booking = await Booking.findOne(query);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Reservation ${reference} was not found.`
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single reservation voucher by reference
// @route   GET /api/bookings/:reference
// @access  Public
export const getBookingByReference = async (req, res, next) => {
  try {
    const { reference } = req.params;
    const booking = await Booking.findOne({ reference: reference.toUpperCase() });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Reservation ${reference} was not found.`
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a reservation
// @route   PATCH /api/bookings/:reference/cancel
// @access  Public (Optionally authenticated)
export const cancelBooking = async (req, res, next) => {
  try {
    const { reference } = req.params;
    const booking = await Booking.findOne({ reference: reference.toUpperCase() });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Reservation ${reference} was not found.`
      });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: `Reservation ${reference} is already cancelled.`
      });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Reservation ${reference} has been cancelled.`,
      booking
    });
  } catch (error) {
    next(error);
  }
};
