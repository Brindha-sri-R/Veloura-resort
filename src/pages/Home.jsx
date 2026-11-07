import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Sparkles, Compass, Check, Clock, MapPin } from 'lucide-react';
import Hero from '../components/Hero';
import BookingSearch from '../components/BookingSearch';
import StayCard from '../components/StayCard';
import EditorialGallery from '../components/EditorialGallery';
import ExperienceModal from '../components/ExperienceModal';
import FloatingReviews from '../components/FloatingReviews';
import AnimatedCounter from '../components/AnimatedCounter';
import MagneticButton from '../components/MagneticButton';
import { staysData, roomCategories } from '../data/staysData';
import { experiencesData } from '../data/experiencesData';
import { luxuryEase } from '../utils/motion';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All Stays');
  const [selectedExperience, setSelectedExperience] = useState(null);

  const filteredStays = activeCategory === 'All Stays'
    ? staysData.slice(0, 4) // Show the four core categories
    : staysData.filter(s => s.category === activeCategory);

  const flagshipExperience = experiencesData[0]; // Coral Reef Spa
  const remainingExperiences = experiencesData.slice(1, 4);

  return (
    <div className="bg-[#F8F6F0] min-h-screen">
      {/* 1. Editorial Brand Intro Hero */}
      <Hero />

      {/* 2. Booking Availability Search Panel (Casa Vela Aesthetic) */}
      <div className="-mt-8 sm:-mt-12 md:-mt-16 relative z-30 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-16 sm:mb-24">
        <BookingSearch />
      </div>

      {/* 3. Featured Stays: Editorial Staggered Layout & Index Numbering */}
      <section className="py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-gold-600 font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sanctuary Collection</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-forest-950 font-normal tracking-tight">
              Curated Private Residences
            </h2>
            <p className="mt-3 text-sm sm:text-base text-forest-700/80 font-sans max-w-xl leading-relaxed">
              Each villa is a discreet architectural sanctuary, conceived to frame the changing moods of the ocean and lush tropical canopy.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {roomCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 flex-shrink-0 ${
                  activeCategory === category
                    ? 'bg-forest-900 text-white border-forest-900 shadow-md font-medium'
                    : 'bg-white text-forest-800 border-sand-300 hover:border-gold hover:bg-sand-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stays Grid with Staggered Numbering (References 1 & 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredStays.map((stay, idx) => (
            <StayCard
              key={stay.id}
              stay={stay}
              index={`0${idx + 1} / 0${filteredStays.length}`}
            />
          ))}
        </div>

        {/* View All Stays Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: luxuryEase }}
          className="mt-14 text-center"
        >
          <MagneticButton maxDistance={4}>
            <Link
              to="/stays"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-forest-900 text-forest-950 hover:bg-forest-900 hover:text-white text-xs font-semibold tracking-luxury uppercase transition-all duration-300 shadow-sm group"
            >
              <span>Explore All Sanctuaries</span>
              <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </MagneticButton>
        </motion.div>
      </section>

      {/* 4. "A Place To Call Home" - Editorial Masonry Collage (Reference 1) */}
      <EditorialGallery />

      {/* 5. About Veloura - Magazine-Style Asymmetrical Split Layout (One & Only Mandarina Reference 2 & 3) */}
      <section className="py-24 sm:py-32 bg-white border-y border-sand-300/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Evocative Poetic Storytelling with Independent Reveal */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.85, ease: luxuryEase }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-gold-600 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                <span>Azure Atoll, Private Coral Sanctuary</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-forest-950 font-normal leading-[1.12]">
                Where Untamed Reef Meets <br />
                <span className="italic text-gold font-normal">Architectural Stillness</span>
              </h2>

              <p className="text-forest-700/85 font-sans leading-relaxed text-sm sm:text-base">
                Conceived as a tribute to the raw beauty of the outer reef, Veloura is an intimate sanctuary untouched by mass tourism. Here, every pavilion is oriented to catch the prevailing ocean breeze, shaded by mature indigenous palm canopies and bordered by crystal-clear waters.
              </p>

              <p className="text-forest-700/75 font-sans leading-relaxed text-sm">
                From our 100% solar-powered island energy grid and on-site marine coral restoration laboratory to our zero-plastic organic farm, sustainability is woven seamlessly into the fabric of uncompromising luxury.
              </p>

              {/* Minimalist Arrow Link */}
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-forest-900 hover:text-gold-600 font-bold transition-colors group"
                >
                  <span className="border-b border-forest-900 pb-0.5 group-hover:border-gold">
                    Discover Our Philosophy
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Asymmetrical Dual-Image Composition with Parallax Offset */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none pt-4 sm:pt-6">
                
                {/* Primary Tall Architectural Photo */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.9, ease: luxuryEase }}
                  className="rounded-3xl sm:rounded-4xl overflow-hidden aspect-[4/5] shadow-2xl border border-sand-300/80"
                >
                  <img
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
                    alt="Veloura Tropical Architecture & Infinity Pool overlooking ocean"
                    className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700 ease-out will-change-transform"
                    loading="lazy"
                  />
                </motion.div>

                {/* Secondary Offset Detail Photo */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.9, delay: 0.25, ease: luxuryEase }}
                  className="absolute -top-6 -right-3 sm:-right-8 w-44 sm:w-56 rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl border-2 border-white hidden sm:block"
                >
                  <img
                    src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
                    alt="Handcrafted Teak Veranda & Pool Detail"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-forest-950/20" />
                  <div className="absolute bottom-2 left-3 text-[10px] text-white font-serif italic drop-shadow">
                    Teak Pavilion Detail
                  </div>
                </motion.div>

                {/* Overlapping Floating Quote Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.35, ease: luxuryEase }}
                  className="absolute -bottom-8 -left-4 sm:-left-8 w-64 sm:w-80 bg-forest-950/95 text-white backdrop-blur-md p-6 rounded-2xl border border-gold/30 shadow-2xl hidden sm:block"
                >
                  <span className="text-[10px] uppercase tracking-luxury text-gold block mb-1">
                    Biophilic Philosophy
                  </span>
                  <p className="font-serif text-base sm:text-lg text-white font-light italic mb-2">
                    "We did not build on the atoll; we allowed the atoll to guide our architecture."
                  </p>
                  <span className="text-xs text-sand-300 block font-sans">
                    — Master Architect K. Alistair
                  </span>
                </motion.div>
              </div>
            </div>

          </div>

          {/* Sustainability & Sanctuary Metrics Row with Animated Counters */}
          <div className="mt-16 sm:mt-24 pt-12 border-t border-sand-300/70">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
              <div className="p-4">
                <span className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forest-950 font-normal block">
                  <AnimatedCounter value={100} suffix="%" />
                </span>
                <span className="text-xs uppercase tracking-luxury text-forest-600 font-semibold mt-2 block">
                  Solar Powered Island
                </span>
              </div>
              <div className="p-4">
                <span className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forest-950 font-normal block">
                  <AnimatedCounter value="24 / 7" />
                </span>
                <span className="text-xs uppercase tracking-luxury text-forest-600 font-semibold mt-2 block">
                  Dedicated Island Butler
                </span>
              </div>
              <div className="p-4">
                <span className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forest-950 font-normal block">
                  <AnimatedCounter value={12000} suffix="+" />
                </span>
                <span className="text-xs uppercase tracking-luxury text-forest-600 font-semibold mt-2 block">
                  Corals Restored
                </span>
              </div>
              <div className="p-4">
                <span className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forest-950 font-normal block">
                  <AnimatedCounter value="Zero" />
                </span>
                <span className="text-xs uppercase tracking-luxury text-forest-600 font-semibold mt-2 block">
                  Single-Use Plastics
                </span>
              </div>
            </div>
            <p className="text-center text-[10px] text-forest-500 font-sans italic pt-3">
              *Conceptual environmental design milestones established under the Veloura masterplan framework.
            </p>
          </div>

        </div>
      </section>

      {/* 6. Experiences Showcase - Asymmetrical Editorial Grid */}
      <section className="py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: luxuryEase }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-gold-600 font-semibold mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Resort Journeys</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-forest-950 font-normal tracking-tight">
              Curated Island Encounters
            </h2>
            <p className="mt-3 text-sm sm:text-base text-forest-700/80 font-sans max-w-xl leading-relaxed">
              Curated encounters with the ocean, the palate, and the spirit. Each activity is tailored by your personal Island Host.
            </p>
          </div>

          <Link
            to="/experiences"
            className="text-xs uppercase tracking-luxury text-forest-900 hover:text-gold-600 font-semibold inline-flex items-center gap-2 group"
          >
            <span>View All Journeys</span>
            <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Asymmetrical Grid: 1 Tall Flagship Feature on Left, 3 Staggered on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Flagship Hero Experience Card (Col Span 5) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.85, ease: luxuryEase }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="group h-full bg-white rounded-3xl overflow-hidden border border-sand-300/80 shadow-luxury hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between">
              <div className="relative aspect-[4/3] lg:aspect-[4/5] overflow-hidden bg-forest-950">
                <img
                  src={flagshipExperience.image}
                  alt={flagshipExperience.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/20 to-transparent" />

                <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                  <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[10px] font-semibold tracking-luxury uppercase bg-forest-950/80 text-gold-300 border border-gold/30 backdrop-blur-md">
                    Featured Journey
                  </span>
                  <span className="text-xs text-white font-serif italic">
                    01 / 04
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 text-sand-100">
                  <span className="text-xs uppercase tracking-widest text-gold block mb-1">
                    {flagshipExperience.category}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white">
                    {flagshipExperience.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-sand-300 mt-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      <span>{flagshipExperience.duration}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gold" />
                      <span>{flagshipExperience.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-gold-600 font-medium mb-2">
                    {flagshipExperience.subtitle}
                  </p>
                  <p className="text-sm text-forest-700/80 font-sans leading-relaxed mb-4">
                    {flagshipExperience.description}
                  </p>
                  <div className="space-y-1.5 py-3 border-t border-sand-200">
                    {flagshipExperience.highlights.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-forest-800">
                        <Check className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-sand-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-forest-500 block">
                      Investment
                    </span>
                    <span className="text-base font-serif font-semibold text-forest-950">
                      {flagshipExperience.price}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedExperience(flagshipExperience)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold tracking-luxury uppercase transition-all shadow-md active:scale-95 group/btn"
                  >
                    <span>Inquire Journey</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3 Staggered / Stacked Secondary Experiences (Col Span 7) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            {remainingExperiences.map((experience, idx) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.7, delay: 0.15 * (idx + 1), ease: luxuryEase }}
                className="group bg-white rounded-3xl overflow-hidden border border-sand-300/80 shadow-luxury hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col sm:flex-row"
              >
                {/* Horizontal thumbnail */}
                <div className="relative w-full sm:w-2/5 aspect-[16/10] sm:aspect-auto overflow-hidden bg-forest-950 flex-shrink-0">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] font-serif tracking-widest text-white/90 bg-forest-950/80 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                      0{idx + 2} / 04
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase tracking-luxury text-gold-600 font-bold">
                        {experience.category}
                      </span>
                      <span className="text-xs text-forest-600 font-medium">
                        {experience.duration}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl text-forest-950 group-hover:text-forest-700 transition-colors">
                      {experience.title}
                    </h3>
                    <p className="text-xs text-forest-700/80 font-sans leading-relaxed mt-2 line-clamp-2">
                      {experience.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-sand-200 flex items-center justify-between">
                    <span className="text-sm font-serif font-semibold text-forest-950">
                      {experience.price}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedExperience(experience)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-forest-900 text-forest-900 hover:bg-forest-900 hover:text-white text-xs font-semibold tracking-wider uppercase transition-colors active:scale-95 group/btn"
                    >
                      <span>Inquire</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gold group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. Discerning Praise & Floating Orbital Testimonials (Reference 5) */}
      <FloatingReviews />

      {/* 8. Brand Manifesto & Final Editorial CTA with Smooth Viewport Reveal */}
      <section className="relative py-28 sm:py-36 bg-forest-950 text-white overflow-hidden text-center">
        <motion.div
          initial={{ scale: 1.08, opacity: 0.15 }}
          whileInView={{ scale: 1, opacity: 0.2 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: luxuryEase }}
          className="absolute inset-0 pointer-events-none"
        >
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80"
            alt="Resort Horizon"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: luxuryEase }}
          >
            <span className="text-xs uppercase tracking-luxury text-gold block mb-4 font-medium">
              Your Private Escape Awaits
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-white font-light mb-6 leading-tight">
              Escape into the <br className="hidden sm:inline" />
              <span className="italic text-gold font-normal">extraordinary.</span>
            </h2>
            <p className="text-sand-200/80 font-sans max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-10">
              Allow us to craft your tailored island itinerary. Step into a world of unhurried stillness, ocean whispers, and bespoke luxury.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton maxDistance={5}>
                <Link
                  to="/stays"
                  className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold-300 text-forest-950 font-semibold text-xs tracking-luxury uppercase rounded-full shadow-2xl transition-all duration-300 transform active:scale-95"
                >
                  Reserve Your Sanctuary
                </Link>
              </MagneticButton>
              <MagneticButton maxDistance={5}>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/30 hover:border-gold text-white text-xs tracking-luxury uppercase rounded-full transition-colors active:scale-95"
                >
                  Contact Island Concierge
                </Link>
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Inquiry Modal */}
      {selectedExperience && (
        <ExperienceModal
          experience={selectedExperience}
          onClose={() => setSelectedExperience(null)}
        />
      )}
    </div>
  );
}
