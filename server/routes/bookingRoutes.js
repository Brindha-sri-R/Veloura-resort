import express from 'express';
import {
  createBooking,
  simulatePayment,
  verifyPayment,
  getMyBookings,
  lookupBooking,
  getBookingByReference,
  cancelBooking
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.post('/simulate-payment', protect, simulatePayment);
router.post('/verify', protect, verifyPayment);
router.get('/my', protect, getMyBookings);
router.get('/lookup', protect, lookupBooking);
router.get('/:reference', protect, getBookingByReference);
router.patch('/:reference/cancel', protect, cancelBooking);

export default router;

