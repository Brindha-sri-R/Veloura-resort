import React, { useState } from 'react';
import { Compass, Sparkles, Filter, Phone, Mail } from 'lucide-react';
import ExperienceCard from '../components/ExperienceCard';
import ExperienceModal from '../components/ExperienceModal';
import { experiencesData } from '../data/experiencesData';

export default function Experiences() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState(null);

  const categories = ['All', 'Wellness', 'Culinary', 'Ocean & Sail', 'Marine Safari', 'Exclusive'];

  const filteredExperiences = activeCategory === 'All'
    ? experiencesData
    : experiencesData.filter(e => e.category === activeCategory);

  return (
    <div className="pt-28 pb-24 bg-[#FAF7F2] min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-gold-600 font-semibold mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Curated Island Journeys</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl text-forest-950 font-normal tracking-tight">
          Veloura Experiences
        </h1>
        <p className="mt-4 text-sm sm:text-base text-forest-700/80 font-sans max-w-2xl mx-auto leading-relaxed">
          From overwater holistic Ayurvedic rituals and sunset cruises on our private teak yacht to Michelin-grade treehouse gastronomy. Every moment is crafted around your rhythm.
        </p>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pt-8 pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-5 py-2.5 rounded-full border transition-all duration-300 flex-shrink-0 ${
                activeCategory === cat
                  ? 'bg-forest-900 text-white border-forest-900 shadow-md font-medium'
                  : 'bg-white text-forest-800 border-sand-300 hover:border-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExperiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              onSelect={(exp) => setSelectedExperience(exp)}
            />
          ))}
        </div>

        {/* Custom Tailored Itinerary Banner */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-forest-900 text-white border border-white/10 shadow-2xl">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs uppercase tracking-luxury text-gold font-semibold">
              Bespoke Requests
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal">
              Have a Dream Expedition in Mind?
            </h3>
            <p className="text-sm text-sand-300 leading-relaxed font-sans max-w-xl mx-auto">
              Our Head Island Concierge and Marine Expedition Team can arrange private seaplane flyovers, midnight bioluminescent night paddleboards, or secluded wedding proposals on private atolls.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:concierge@velouraresort.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold hover:bg-gold-300 text-forest-950 text-xs font-semibold tracking-luxury uppercase transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Island Concierge</span>
              </a>
              <a
                href="tel:+18005558356"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 hover:border-gold text-white text-xs tracking-luxury uppercase transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-gold" />
                <span>VIP WhatsApp: +1 (800) 555-VELOURA</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {selectedExperience && (
        <ExperienceModal
          experience={selectedExperience}
          onClose={() => setSelectedExperience(null)}
        />
      )}
    </div>
  );
}

