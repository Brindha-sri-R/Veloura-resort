import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Maximize, Star, BedDouble, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useBooking } from '../context/BookingContext';
import { luxuryEase } from '../utils/motion';

export default function StayCard({ stay, featured = false, index = null }) {
  const navigate = useNavigate();
  const { setSelectedStay } = useBooking();

  const handleBookNow = (e) => {
    e.stopPropagation();
    setSelectedStay(stay);
    navigate(`/book?stayId=${stay.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: luxuryEase }}
      className="group bg-white rounded-3xl overflow-hidden border border-sand-300/80 shadow-luxury hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between"
    >
      {/* Image Container with Smooth Hover Zoom */}
      <div className="relative aspect-[16/10] overflow-hidden bg-forest-950">
        <img
          src={stay.images[0]}
          alt={stay.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
          loading="lazy"
        />

        {/* Gradient Overlay for Tag Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-luxury uppercase bg-forest-950/80 text-gold-300 border border-gold/30 backdrop-blur-md shadow-sm">
            {stay.tag || stay.category}
          </span>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-forest-950 backdrop-blur-md shadow-sm">
            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
            <span>{stay.rating}</span>
            <span className="text-forest-500 text-[10px]">({stay.reviewsCount})</span>
          </div>
        </div>

        {/* Quick View Tag at bottom of image */}
        <div className="absolute bottom-3 left-4 text-xs text-white/90 font-serif italic">
          {stay.view}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          {/* Index Header (Inspired by References 1 & 3) */}
          {index && (
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-sand-200">
              <span className="text-xs font-serif tracking-widest text-forest-600 font-semibold">
                {index}
              </span>
              <span className="text-[10px] uppercase tracking-luxury text-gold-600 font-bold">
                {stay.category}
              </span>
            </div>
          )}

          {/* Room Name & Category */}
          <div className="mb-2">
            {!index && (
              <span className="text-[10px] uppercase tracking-luxury text-gold-600 font-bold block mb-1">
                {stay.category}
              </span>
            )}
            <h3 className="font-serif text-2xl sm:text-3xl text-forest-950 group-hover:text-forest-700 transition-colors">
              <Link to={`/stay/${stay.id}`} className="focus:outline-none">
                {stay.name}
              </Link>
            </h3>
          </div>

          {/* Subtitle / Description */}
          <p className="text-sm text-forest-700/80 font-sans leading-relaxed line-clamp-2 mb-4">
            {stay.shortDescription}
          </p>

          {/* Key Specs Pills */}
          <div className="flex flex-wrap items-center gap-3 py-3 border-y border-sand-200/90 text-xs text-forest-800">
            <div className="flex items-center gap-1.5" title="Maximum Capacity">
              <Users className="w-3.5 h-3.5 text-gold-600" />
              <span>Up to {stay.maxGuests} Guests</span>
            </div>
            <span className="text-sand-300">•</span>
            <div className="flex items-center gap-1.5" title="Villa Size">
              <Maximize className="w-3.5 h-3.5 text-gold-600" />
              <span>{stay.size}</span>
            </div>
            <span className="text-sand-300">•</span>
            <div className="flex items-center gap-1.5" title="Bedrooms">
              <BedDouble className="w-3.5 h-3.5 text-gold-600" />
              <span>{stay.bedrooms} Bed</span>
            </div>
          </div>

          {/* Key Facilities Highlights */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {stay.facilities.slice(0, 3).map((facility, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-sand-100 text-forest-800 font-medium"
              >
                {facility}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="mt-6 pt-5 border-t border-sand-200/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-2xl sm:text-3xl font-semibold text-forest-950">
                {formatCurrency(stay.pricePerNight)}
              </span>
              <span className="text-xs text-forest-600 font-sans">/ night</span>
            </div>
            <span className="text-[10px] text-forest-500 uppercase tracking-widest block font-sans">
              *Demo simulated rate
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to={`/stay/${stay.id}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-2.5 rounded-full border border-forest-900/30 text-forest-900 hover:border-forest-900 text-xs font-semibold tracking-wider uppercase transition-colors"
            >
              <span>View Details</span>
            </Link>
            <button
              type="button"
              onClick={handleBookNow}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold tracking-luxury uppercase transition-all duration-300 shadow-md hover:shadow-xl active:scale-95 group/btn"
            >
              <span>Reserve</span>
              <ArrowRight className="w-3 h-3 text-gold group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
