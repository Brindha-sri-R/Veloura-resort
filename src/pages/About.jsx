import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Compass, ShieldCheck, Sun, Waves, TreePine, Award, ArrowRight } from 'lucide-react';

export default function About() {
  const pillars = [
    {
      title: 'Biophilic Architecture',
      icon: <TreePine className="w-5 h-5 text-gold" />,
      desc: 'Crafted from reclaimed tropical teak, porous volcanic basalt, and floor-to-ceiling glass screens that invite gentle sea breezes and ambient natural light.'
    },
    {
      title: 'Mindful Seclusion',
      icon: <Compass className="w-5 h-5 text-gold" />,
      desc: 'Positioned across 120 acres of protected coral atoll with generous buffer zones of lush rainforest ensuring complete acoustic and visual privacy for every villa.'
    },
    {
      title: '100% Eco-Solar Atoll',
      icon: <Sun className="w-5 h-5 text-gold" />,
      desc: 'Our microgrid is powered entirely by silent solar panels and advanced battery storage, coupled with an advanced thermodynamic seawater desalination facility.'
    },
    {
      title: 'Living Coral Foundation',
      icon: <Waves className="w-5 h-5 text-gold" />,
      desc: 'Our in-house team of resident marine biologists nurtures over 12,000 coral fragments annually, fostering thriving reef habitats for manta rays and sea turtles.'
    }
  ];

  return (
    <div className="pt-28 pb-24 bg-[#FAF7F2] min-h-screen">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-gold-600 font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Heritage & Vision</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl text-forest-950 font-normal tracking-tight max-w-4xl mx-auto">
          "Escape into the extraordinary."
        </h1>
        <p className="mt-4 text-base sm:text-lg text-forest-700/80 font-serif italic max-w-2xl mx-auto">
          The story of an uninhabited coral atoll reborn as a sanctuary of stillness, sustainable luxury, and biophilic serenity.
        </p>
      </div>

      {/* Visual Storytelling Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-forest-950">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80"
                alt="Veloura Aerial View"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-luxury text-gold-600 font-semibold block">
              The Genesis
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-forest-950 font-normal">
              A Love Letter to the Living Ocean
            </h2>
            <p className="text-sm sm:text-base text-forest-800 leading-relaxed font-sans">
              Veloura was founded on a singular premise: that true luxury in the twenty-first century is not defined by excess, but by space, silence, and genuine communion with pristine nature.
            </p>
            <p className="text-sm sm:text-base text-forest-800 leading-relaxed font-sans">
              When our founders first sailed into this azure cove in 2018, they found a virgin barrier reef and ancient tropical flora. Instead of flattening the landscape, our architects spent twelve months mapping every heritage banyan tree and coral outcrop, designing each villa to nestle harmoniously into existing topography.
            </p>
          </div>
        </div>
      </div>

      {/* The Four Pillars */}
      <div className="bg-forest-900 text-white py-24 mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-luxury text-gold font-semibold block mb-2">
              Our Core Ethos
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal">
              The Four Pillars of Veloura
            </h2>
            <p className="text-sm text-sand-300 mt-3 font-sans">
              Conceptual architectural, ecological, and hospitality standards guiding the sanctuary masterplan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-forest-950/70 p-7 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-forest-900 border border-gold/40 flex items-center justify-center mb-5">
                    {pillar.icon}
                  </div>
                  <h3 className="font-serif text-2xl text-white mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-sand-300 leading-relaxed font-sans">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sustainable Commitment */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-sand-300 shadow-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs uppercase tracking-luxury text-gold-600 font-semibold block">
                Conservation In Action
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-forest-950 font-normal">
                Protecting the Coral Heritage for Future Generations
              </h2>
              <p className="text-sm sm:text-base text-forest-800 leading-relaxed font-sans">
                As guests of this fragile atoll, 2% of every reservation is directed directly to the Veloura Marine Sanctuary Foundation. Guests are invited to participate in coral fragging with our marine scientists or snorkel alongside our turtle rescue initiatives.
              </p>
              <div className="pt-2">
                <Link
                  to="/stays"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-forest-900 hover:text-gold-700 font-semibold"
                >
                  <span>Explore Our Private Sanctuaries</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden bg-forest-950 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
                alt="Veloura Tropical Resort Architecture"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

