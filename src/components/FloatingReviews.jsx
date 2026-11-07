import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star, Sparkles } from 'lucide-react';
import { reviewsData, pressAccolades } from '../data/reviewsData';

export default function FloatingReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const activeReview = reviewsData[activeIndex];

  // Optional gentle autoplay that pauses when user interacts
  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviewsData.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isAutoplay]);

  const handlePrev = () => {
    setIsAutoplay(false);
    setActiveIndex((prev) => (prev === 0 ? reviewsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoplay(false);
    setActiveIndex((prev) => (prev + 1) % reviewsData.length);
  };

  const handleSelect = (index) => {
    setIsAutoplay(false);
    setActiveIndex(index);
  };

  // Pre-calculated orbital positions for the 6 avatars (desktop & tablet)
  const orbPositions = [
    { top: '8%', left: '2%', delay: 0 },          // Top-left
    { top: '48%', left: '1%', delay: 0.8 },       // Mid-left
    { top: '84%', left: '3%', delay: 1.4 },       // Bottom-left
    { top: '10%', right: '2%', delay: 0.4 },      // Top-right
    { top: '50%', right: '1%', delay: 1.1 },      // Mid-right
    { top: '86%', right: '3%', delay: 1.7 },      // Bottom-right
  ];

  return (
    <section className="py-28 sm:py-36 bg-[#F8F6F0] relative overflow-hidden border-t border-sand-300/60">
      {/* Reference 5 Abstract Fluid Organic Curves in Corners */}
      <div className="absolute -top-16 -right-16 w-80 sm:w-96 h-80 sm:h-96 pointer-events-none opacity-10 overflow-hidden">
        <svg viewBox="0 0 400 400" className="w-full h-full fill-forest-900">
          <path d="M0,0 C150,50 300,100 400,0 C350,150 400,300 300,400 C200,350 100,300 0,250 Z" />
        </svg>
      </div>
      <div className="absolute -bottom-16 -left-16 w-80 sm:w-96 h-80 sm:h-96 pointer-events-none opacity-10 overflow-hidden">
        <svg viewBox="0 0 400 400" className="w-full h-full fill-forest-900">
          <path d="M400,400 C250,350 100,300 0,400 C50,250 0,100 100,0 C200,50 300,100 400,150 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand-200/80 border border-gold/30 text-gold-700 text-xs uppercase tracking-luxury font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Discerning Words</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-forest-950 font-normal tracking-tight">
            Memories of Veloura
          </h2>
          <p className="mt-3 text-sm sm:text-base text-forest-700/80 font-sans leading-relaxed">
            Unfiltered reflections from those who have journeyed into our private ocean sanctuary.
          </p>
        </div>

        {/* Central Floating Stage with Orbital Avatars (Inspired by Reference 5) */}
        <div className="relative min-h-[500px] sm:min-h-[560px] flex items-center justify-center py-6 sm:py-10">

          {/* Floating Circular Avatar Orbs (Desktop & Large Tablets) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            {reviewsData.slice(0, 6).map((review, idx) => {
              const pos = orbPositions[idx];
              const isActive = idx === activeIndex;

              return (
                <motion.div
                  key={review.id}
                  style={{
                    top: pos.top,
                    left: pos.left,
                    right: pos.right,
                  }}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                    delay: pos.delay,
                  }}
                  className="absolute pointer-events-auto"
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(idx)}
                    className="group relative focus:outline-none transition-transform duration-300"
                    aria-label={`View review by ${review.name}`}
                  >
                    <div
                      className={`flex items-center gap-3 p-2 pr-4 rounded-full transition-all duration-300 backdrop-blur-md ${
                        isActive
                          ? 'bg-white shadow-[0_20px_40px_rgba(18,61,53,0.14)] ring-2 ring-gold scale-105 border border-gold/50'
                          : 'bg-white/90 hover:bg-white shadow-luxury hover:shadow-xl border border-sand-200/90 opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-full overflow-hidden border-2 border-gold/40 flex-shrink-0 shadow-sm">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="text-left whitespace-nowrap hidden xl:block">
                        <div className="text-xs font-serif font-semibold text-forest-950 leading-tight">
                          {review.name}
                        </div>
                        <div className="text-[10px] text-forest-600 font-sans mt-0.5">
                          {review.origin.split(',')[0]} • {review.stayType.split('•')[0]}
                        </div>
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Main Central Testimonial Card */}
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl sm:rounded-4xl p-8 sm:p-12 md:p-16 shadow-[0_25px_60px_rgba(18,61,53,0.08)] border border-sand-300/80 text-center">
            
            {/* Stars */}
            <div className="flex items-center justify-center gap-1.5 mb-6">
              {[...Array(activeReview.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-gold text-gold" />
              ))}
            </div>

            {/* Testimonial Quote with Smooth Fade & Scale Transition */}
            <div className="min-h-[140px] sm:min-h-[130px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeReview.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                >
                  <p className="font-serif text-lg sm:text-2xl md:text-3xl text-forest-950 font-light leading-relaxed italic px-2 sm:px-6">
                    "{activeReview.quote}"
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Reviewer Details (Direct Match to Reference 5 Style) */}
            <div className="mt-8 pt-6 border-t border-sand-200/90">
              <h4 className="font-serif text-lg sm:text-xl font-semibold text-forest-950 tracking-wide">
                {activeReview.name}
              </h4>
              <div className="text-xs sm:text-sm text-forest-700/80 font-sans mt-0.5">
                {activeReview.origin} • <span className="text-gold-700 font-medium">{activeReview.stayType}</span>
              </div>
            </div>

            {/* Navigation Controls: [ ← ] [ → ] (Reference 5 Navigation Pattern) */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-xl border border-sand-300 bg-sand-50/80 hover:bg-forest-900 hover:text-white hover:border-forest-900 text-forest-900 flex items-center justify-center transition-all duration-300 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Step indicator */}
              <div className="text-xs tracking-luxury text-forest-700 font-medium px-2 font-serif">
                0{activeIndex + 1} / 0{reviewsData.length}
              </div>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-xl border border-sand-300 bg-sand-50/80 hover:bg-forest-900 hover:text-white hover:border-forest-900 text-forest-900 flex items-center justify-center transition-all duration-300 shadow-sm"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Avatar Selector Bar (Accessible on mobile/tablet screens) */}
        <div className="flex lg:hidden items-center justify-center gap-3 mt-6 overflow-x-auto py-2">
          {reviewsData.slice(0, 6).map((review, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={review.id}
                type="button"
                onClick={() => handleSelect(idx)}
                aria-label={`Select review by ${review.name}`}
                className={`relative rounded-full transition-all duration-300 flex-shrink-0 ${
                  isActive
                    ? 'ring-3 ring-gold scale-110'
                    : 'opacity-50 hover:opacity-100 ring-1 ring-sand-300'
                }`}
              >
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-11 h-11 rounded-full object-cover"
                />
              </button>
            );
          })}
        </div>

        {/* Demo Content Disclosure */}
        <div className="text-center mt-6">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-gold-700 bg-sand-200/70 font-medium border border-gold/30">
            *Demonstration Content: Concept Guest Testimonials & Verified Guest Feedback
          </span>
        </div>

        {/* Press Accolades Ticker Banner */}
        <div className="mt-16 pt-12 border-t border-sand-300/80">
          <div className="text-center mb-8">
            <span className="text-[11px] uppercase tracking-luxury text-forest-600 font-semibold block">
              International Recognition & Honors
            </span>
            <span className="text-[10px] text-forest-500 uppercase tracking-widest block mt-0.5">
              *Hospitality design concept awards & press citations
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {pressAccolades.map((accolade, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/70 border border-sand-200 shadow-sm text-center hover:border-gold/40 transition-colors"
              >
                <div className="font-serif text-base sm:text-lg text-forest-950 font-semibold mb-1.5">
                  {accolade.publication}
                </div>
                <div className="text-xs text-forest-700/80 font-sans leading-relaxed">
                  {accolade.text}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

