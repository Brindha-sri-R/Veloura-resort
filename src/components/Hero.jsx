import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Compass, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroResort from '../assets/hero-resort.jpg';
import MagneticButton from './MagneticButton';
import { luxuryEase } from '../utils/motion';

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth, subtle parallax on hero background photograph without layout shift
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  // Staggered words for cinematic headline reveal
  const titleWords = ["Escape", "into", "the"];

  return (
    <div
      ref={containerRef}
      className="relative bg-[#F8F6F0] pt-28 sm:pt-36 lg:pt-40 pb-20 sm:pb-28 lg:pb-36 overflow-hidden min-h-[85vh] flex flex-col justify-center"
    >
      {/* 1. Crisp, High-Quality Tropical Luxury Resort Photograph (Single Layer, No Ghosting) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Controlled, Smooth Fade-In on Page Load */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: luxuryEase }}
          className="w-full h-full"
        >
          <motion.img
            style={{ y: imageY }}
            src={heroResort}
            alt="Veloura Private Oceanfront Sanctuary with Thatched Villa, Turquoise Lagoon and Infinity Pool"
            className="w-full h-full object-cover object-[center_35%] lg:object-center select-none will-change-transform"
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>

        {/* Delicate Top Scrim: Seamless transition with the ivory navbar without fading the resort */}
        <div className="absolute top-0 inset-x-0 h-32 sm:h-44 bg-gradient-to-b from-[#F8F6F0] via-[#F8F6F0]/40 to-transparent" />

        {/* Delicate Bottom Grounding Scrim: Seamless transition into the booking search panel */}
        <div className="absolute bottom-0 inset-x-0 h-28 sm:h-40 bg-gradient-to-t from-[#F8F6F0] via-[#F8F6F0]/60 to-transparent" />
      </div>

      {/* 2. Editorial Side Vertical Micro-Typography (Guaranteed No Clipping) */}
      <div className="hidden xl:flex absolute left-6 lg:left-8 2xl:left-12 inset-y-0 my-auto h-fit flex-col items-center gap-4 pointer-events-none select-none z-10">
        <span className="[writing-mode:vertical-rl] rotate-180 tracking-[0.28em] text-[10px] text-forest-900/75 uppercase font-sans font-medium whitespace-nowrap drop-shadow-sm">
          Azure Atoll Sanctuary
        </span>
        <span className="w-px h-8 bg-gold/70 my-1" />
        <span className="[writing-mode:vertical-rl] rotate-180 tracking-[0.28em] text-[10px] text-gold-700 font-mono font-medium whitespace-nowrap drop-shadow-sm">
          04°12'N 73°30'E
        </span>
      </div>

      <div className="hidden xl:flex absolute right-6 lg:right-8 2xl:right-12 inset-y-0 my-auto h-fit flex-col items-center gap-4 pointer-events-none select-none z-10">
        <span className="[writing-mode:vertical-rl] rotate-180 tracking-[0.28em] text-[10px] text-forest-900/75 uppercase font-sans font-medium whitespace-nowrap drop-shadow-sm">
          Private Coral Reserve
        </span>
        <span className="w-px h-8 bg-gold/70 my-1" />
        <span className="[writing-mode:vertical-rl] rotate-180 tracking-[0.28em] text-[10px] text-gold-700 font-mono font-medium whitespace-nowrap drop-shadow-sm">
          Stillness & Solitude
        </span>
      </div>

      {/* 3. Main Editorial Content with Elevated Visual Separation */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto">
        <div className="bg-[#F8F6F0]/85 md:bg-[#F8F6F0]/90 backdrop-blur-md rounded-3xl sm:rounded-4xl p-6 sm:p-10 md:p-12 shadow-[0_20px_50px_rgba(18,61,53,0.10)] border border-white/80">
          
          {/* Luxury Sanctuary Badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: luxuryEase }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-sand-300/80 text-forest-900 mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span className="text-[10px] sm:text-xs uppercase tracking-luxury font-sans font-semibold">
              Veloura Sanctuary • Private Coral Atoll
            </span>
          </motion.div>

          {/* Cinematic Staggered Headline Reveal */}
          <h1 className="font-serif text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-forest-950 font-light tracking-tight leading-[1.08] sm:leading-[1.03] mb-6 max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4">
            {titleWords.map((word, idx) => (
              <span key={idx} className="overflow-hidden inline-block py-0.5">
                <motion.span
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1 * idx,
                    ease: luxuryEase,
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
            <span className="overflow-hidden inline-block py-0.5 w-full sm:w-auto">
              <motion.span
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: 0.85,
                  delay: 0.1 * titleWords.length,
                  ease: luxuryEase,
                }}
                className="inline-block font-serif italic text-gold font-normal"
              >
                extraordinary.
              </motion.span>
            </span>
          </h1>

          {/* Supporting Narrative - Crisp Editorial Readability */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.35, ease: luxuryEase }}
            className="max-w-xl sm:max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-forest-850 font-sans font-light leading-relaxed mb-8 sm:mb-10 px-2"
          >
            An intimate oceanfront sanctuary where biophilic timber architecture, turquoise coral lagoons, and mindful hospitality converge in effortless harmony.
          </motion.p>

          {/* Centered CTA Action Buttons with Magnetic Movement */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: luxuryEase }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 max-w-md sm:max-w-none mx-auto mb-8 sm:mb-10"
          >
            <MagneticButton maxDistance={5}>
              <Link
                to="/stays"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs tracking-luxury uppercase rounded-full shadow-luxury hover:shadow-2xl transition-all duration-300 transform active:scale-95"
              >
                <span>Explore Our Stays</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </MagneticButton>

            <MagneticButton maxDistance={5}>
              <Link
                to="/experiences"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 sm:py-4 bg-white hover:bg-sand-50 text-forest-900 border border-sand-300 hover:border-gold/70 text-xs tracking-luxury uppercase rounded-full shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
              >
                Discover Experiences
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Credentials Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.65, ease: luxuryEase }}
            className="pt-6 border-t border-sand-300/80 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto text-xs"
          >
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-white/70 border border-sand-200/80 shadow-xs">
              <Compass className="w-4 h-4 text-gold-600 flex-shrink-0" />
              <span className="font-medium text-forest-900">Secluded Seaplane Arrival</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-white/70 border border-sand-200/80 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-gold-600 flex-shrink-0" />
              <span className="font-medium text-forest-900">Dedicated 24/7 Island Butler</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-white/70 border border-sand-200/80 shadow-xs">
              <Sparkles className="w-4 h-4 text-gold-600 flex-shrink-0" />
              <span className="font-medium text-forest-900">100% Eco-Solar Sanctuary</span>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
