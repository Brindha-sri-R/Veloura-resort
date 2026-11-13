import mongoose from 'mongoose';

const amenityHighlightSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true }
}, { _id: false });

const staySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Oceanfront Villa', 'Garden Retreat', 'Beachside Suite', 'Family Residence'],
    index: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  pricePerNight: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 1,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  size: {
    type: String,
    required: true
  },
  maxGuests: {
    type: Number,
    required: true,
    min: 1
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 1
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 1
  },
  bedType: {
    type: String,
    required: true
  },
  view: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    default: 'Sanctuary'
  },
  shortDescription: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  facilities: [{
    type: String,
    required: true
  }],
  amenityHighlights: [amenityHighlightSchema],
  idealFor: {
    type: String,
    default: 'Discerning Guests'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Stay = mongoose.model('Stay', staySchema);

export default Stay;

