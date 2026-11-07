import React from 'react';
import { Clock, MapPin, Sparkles, Check, ArrowRight } from 'lucide-react';

export default function ExperienceCard({ experience, onSelect }) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-sand-300/80 shadow-luxury hover:shadow-luxury-hover transition-all duration-500 flex flex-col justify-between">
      {/* Visual Image Header */}
      <div className="relative aspect-[16/11] overflow-hidden bg-forest-950">
        <img
          src={experience.image}
          alt={experience.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold tracking-luxury uppercase bg-forest-950/80 text-gold-300 border border-gold/30 backdrop-blur-md">
            {experience.category}
          </span>
          <span className="text-xs text-white/95 font-medium px-2.5 py-1 rounded-full bg-forest-900/60 backdrop-blur-md border border-white/10">
            {experience.tag}
          </span>
        </div>

        {/* Bottom meta tags on image */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-sand-200">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gold" />
            <span>{experience.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gold" />
            <span className="truncate max-w-[150px]">{experience.location}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-2xl text-forest-950 mb-1 group-hover:text-forest-700 transition-colors">
            {experience.title}
          </h3>
          <p className="text-xs text-gold-600 font-medium mb-3">
            {experience.subtitle}
          </p>
          <p className="text-sm text-forest-700/80 font-sans leading-relaxed mb-4">
            {experience.description}
          </p>

          {/* Highlights */}
          <div className="space-y-1.5 py-3 border-t border-sand-200/90">
            {experience.highlights.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-forest-800">
                <Check className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-6 pt-4 border-t border-sand-200/90 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-forest-500 block">
              Investment
            </span>
            <span className="text-sm font-semibold text-forest-950">
              {experience.price}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelect(experience)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold tracking-luxury uppercase transition-all duration-300 shadow-md"
          >
            <span>Inquire</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold" />
          </button>
        </div>
      </div>
    </div>
  );
}

