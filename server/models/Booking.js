import mongoose from 'mongoose';

const addonSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  desc: { type: String }
}, { _id: false });

const guestDetailsSchema = new mongoose.Schema({
  title: { type: String, default: 'Mr.' },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  country: { type: String, default: 'India' },
  streetAddress: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pinCode: { type: String, default: '' },
  arrivalTime: { type: String, default: '14:00 - 16:00' },
  specialRequests: { type: String, default: '' },
  occasion: { type: String, default: 'None' }
}, { _id: false });

const financialsSchema = new mongoose.Schema({
  pricePerNight: { type: Number, required: true },
  baseTotal: { type: Number, required: true },
  addonsTotal: { type: Number, default: 0 },
  serviceFee: { type: Number, required: true }, // 10%
  taxes: { type: Number, required: true },      // 12% GST
  grandTotal: { type: Number, required: true }
}, { _id: false });

const paymentDetailsSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['demo_simulation', 'demo_upi', 'demo_card', 'demo_netbanking'],
    default: 'demo_simulation'
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  currency: {
    type: String,
    default: 'INR'
  },
  simulationMode: {
    type: Boolean,
    default: true
  },
  transactionId: {
    type: String,
    default: null
  },
  failureReason: {
    type: String,
    default: null
  },
  paidAt: {
    type: Date,
    default: null
  }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  stay: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stay',
    required: true
  },
  // Cached snapshot of stay for voucher generation even if stay details change
  staySnapshot: {
    id: String,
    name: String,
    category: String,
    pricePerNight: Number,
    size: String,
    view: String,
    image: String
  },
  checkIn: {
    type: String, // YYYY-MM-DD
    required: true
  },
  checkOut: {
    type: String, // YYYY-MM-DD
    required: true
  },
  nights: {
    type: Number,
    required: true,
    min: 1
  },
  adults: {
    type: Number,
    required: true,
    min: 1
  },
  children: {
    type: Number,
    default: 0
  },
  guest: {
    type: guestDetailsSchema,
    required: true
  },
  addons: [addonSchema],
  financials: {
    type: financialsSchema,
    required: true
  },
  payment: {
    type: paymentDetailsSchema,
    default: () => ({})
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Pending Payment', 'Payment Failed', 'Cancelled'],
    default: 'Pending Payment',
    index: true
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
