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
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, createBooking);
router.post('/simulate-payment', simulatePayment);
router.post('/verify', verifyPayment);
router.get('/my', optionalAuth, getMyBookings);
router.get('/lookup', lookupBooking);
router.get('/:reference', getBookingByReference);
router.patch('/:reference/cancel', optionalAuth, cancelBooking);

export default router;

