import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { luxuryEase } from '../utils/motion';

export default function EditorialGallery() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Gentle parallax movement for the left feature photograph
  const imageY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section
      ref={containerRef}
      className="py-24 sm:py-32 bg-[#F8F6F0] relative overflow-hidden border-t border-sand-300/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Premium Two-Column Editorial Header (Balanced: No Empty Space on Left) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-16 sm:mb-24">
          
          {/* LEFT COLUMN: Large High-Quality Tropical Architectural Photograph */}
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, ease: luxuryEase }}
            className="lg:col-span-6"
          >
            <div className="group relative rounded-3xl sm:rounded-4xl overflow-hidden aspect-[4/3] sm:aspect-[5/4] bg-forest-950 shadow-2xl border border-sand-300/80">
              <motion.img
                style={{ y: imageY }}
                src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1400&q=85"
                alt="Veloura Luxury Timber Pavilion with Private Infinity Pool and Tropical Greenery"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
                loading="lazy"
              />

              {/* Subtle ambient gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Floating Architectural Badge */}
              <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 flex items-center gap-2.5 px-4 py-2 rounded-full bg-forest-950/75 text-white backdrop-blur-md border border-white/20 text-xs shadow-lg">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="font-serif italic tracking-wide">
                  Timber Pavilion • West Point Sanctuary
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Editorial Narrative, Heading & Actions with Staggered Entrance */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ staggerChildren: 0.12 }}
            className="lg:col-span-6 space-y-6 lg:pl-2"
          >
            {/* Preserved Architectural Dialogue Label */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: luxuryEase } }
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand-200/80 border border-gold/30 text-gold-700 text-xs uppercase tracking-luxury font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Architectural Dialogue</span>
            </motion.div>

            {/* Preserved Heading */}
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: luxuryEase } }
              }}
              className="font-serif text-3xl sm:text-5xl lg:text-6xl text-forest-950 font-normal tracking-tight leading-[1.08]"
            >
              A Place To Call <span className="italic text-gold font-normal">Home</span>
            </motion.h2>

            {/* Preserved Descriptive Paragraphs */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: luxuryEase } }
              }}
              className="text-forest-800/90 font-sans text-base sm:text-lg font-light leading-relaxed max-w-xl"
            >
              To create an immersive, emotive and soulful sanctuary that showcases the Veloura portfolio while creating a spatial rhythm that is visually memorable, elevating every moment of your tropical stay.
            </motion.p>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: luxuryEase } }
              }}
              className="text-forest-700/80 font-sans text-xs sm:text-sm leading-relaxed max-w-lg"
            >
              Each pavilion dissolves the boundary between living reef and timber shelter. From sun-bleached basalt verandas to private horizon plunge pools, our architecture is conceived to let the ocean breeze wander through.
            </motion.p>

            {/* Preserved & Functional Explore The Collection Link with Animated Arrow */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: luxuryEase } }
              }}
              className="pt-2"
            >
              <Link
                to="/stays"
                className="inline-flex items-center gap-2.5 text-xs uppercase tracking-luxury text-forest-950 hover:text-gold-700 font-semibold group transition-colors"
              >
                <span className="border-b-2 border-forest-950 pb-0.5 group-hover:border-gold-600 transition-colors">
                  Explore The Collection
                </span>
                <ArrowUpRight className="w-4 h-4 text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </motion.div>

        </div>

        {/* 2. 5-Image Asymmetrical Editorial Collage with Scroll Reveal and Parallax Zoom */}
        <div className="space-y-6 sm:space-y-8">
          
          {/* Row 1: Top Asymmetrical Pair */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-end">
            
            {/* Top-Left: Small Veranda / Architecture (Cols 1-4) */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, ease: luxuryEase }}
              className="md:col-span-4"
            >
              <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3] bg-forest-950 shadow-luxury">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
                  alt="Veloura Overwater Pavilion Veranda"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 text-white text-xs font-serif italic opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Veranda Pavilion • North Lagoon
                </div>
              </div>
            </motion.div>

            {/* Top-Right: Wide Timber Villa in Lush Forest (Cols 5-12) */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: 0.15, ease: luxuryEase }}
              className="md:col-span-8"
            >
              <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/10] bg-forest-950 shadow-luxury">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                  alt="Timber Architectural Villa illuminated at twilight"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-5 left-5 text-white text-xs font-serif italic opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Canopy Villa Architecture • Twilight Ambience
                </div>
              </div>
            </motion.div>

          </div>

          {/* Row 2: Mid Asymmetrical Pair */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Mid-Left: Infinity Pool & Umbrella overlooking ocean (Cols 1-7) */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: luxuryEase }}
              className="md:col-span-7"
            >
              <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3] bg-forest-950 shadow-luxury">
                <img
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80"
                  alt="Turquoise Horizon Pool with Sunbeds"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-5 left-5 text-white text-xs font-serif italic opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Horizon Pool & Sunbeds • West Point
                </div>
              </div>
            </motion.div>

            {/* Mid-Right: Sensory Stone Plunge Bath Portrait (Cols 8-12) */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: 0.3, ease: luxuryEase }}
              className="md:col-span-5"
            >
              <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[3/4] bg-forest-950 shadow-luxury">
                <img
                  src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80"
                  alt="Guest unwinding in natural botanical stone plunge pool"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-5 left-5 text-white text-xs font-serif italic opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Basalt Stone Plunge Pool • Botanical Ritual
                </div>
              </div>
            </motion.div>

          </div>

          {/* Row 3: Bottom Full-Width Panoramic Lagoon (Cols 12) */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.85, delay: 0.35, ease: luxuryEase }}
            className="w-full"
          >
            <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/7] md:aspect-[21/8] bg-forest-950 shadow-luxury">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
                alt="Aerial turquoise lagoon shallow reef waters"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="absolute bottom-5 left-6 sm:bottom-8 sm:left-10 text-white">
                <span className="text-[10px] uppercase tracking-luxury text-gold block mb-1">
                  Outer Reef Lagoon
                </span>
                <div className="font-serif text-lg sm:text-2xl text-white">
                  Untouched Coral Waters & Shallows
                </div>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
