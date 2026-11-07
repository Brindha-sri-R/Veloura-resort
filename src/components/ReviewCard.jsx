import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-3xl p-7 sm:p-8 border border-sand-300/80 shadow-luxury flex flex-col justify-between relative overflow-hidden">
      {/* Decorative Watermark Quote */}
      <Quote className="absolute -bottom-4 -right-4 w-28 h-28 text-sand-100 -rotate-12 pointer-events-none" />

      <div>
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-gold text-gold" />
          ))}
        </div>

        {/* Title */}
        <h4 className="font-serif text-xl sm:text-2xl text-forest-950 font-normal mb-3">
          "{review.title}"
        </h4>

        {/* Quote */}
        <p className="text-sm text-forest-800/85 font-sans leading-relaxed italic mb-6">
          "{review.quote}"
        </p>
      </div>

      {/* Guest Profile */}
      <div className="flex items-center gap-4 pt-4 border-t border-sand-200/90 relative z-10">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-gold/40 shadow-sm"
          loading="lazy"
        />
        <div>
          <div className="font-serif text-base font-semibold text-forest-950">
            {review.name}
          </div>
          <div className="text-xs text-forest-600 font-sans">
            {review.origin}
          </div>
          <div className="text-[11px] text-gold-600 font-medium">
            {review.stayType}
          </div>
        </div>
      </div>
    </div>
  );
}

