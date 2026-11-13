import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Instagram, Facebook, Youtube, MapPin, Phone, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }
    setError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-forest-950 text-sand-200 border-t border-forest-800/80">
      {/* Top Newsletter & Sanctuary Bar */}
      <div className="border-b border-forest-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <span className="text-xs uppercase tracking-luxury text-gold block mb-2 font-medium">
                The Veloura Gazette
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal mb-3">
                Stories of Stillness & Exclusive Escapes
              </h3>
              <p className="text-sm text-sand-300 font-sans leading-relaxed max-w-xl">
                Subscribe to receive seasonal invitations, private island retreat dispatches, and culinary stories curated for the discerning wanderer.
              </p>
            </div>

            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-forest-900 border border-gold/30 text-gold-200">
                  <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                  <p className="text-sm">
                    Thank you for joining our private circle. We look forward to sharing our world with you.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        placeholder="Enter your email address"
                        className="w-full pl-11 pr-4 py-3.5 bg-forest-900/90 border border-forest-700/60 rounded-full text-sm text-white placeholder-sand-400 focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gold hover:bg-gold-300 text-forest-950 text-xs font-semibold tracking-luxury uppercase rounded-full transition-all duration-300 shadow-md flex-shrink-0"
                    >
                      <span>Subscribe</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  {error && <p className="text-xs text-rose-400 pl-4">{error}</p>}
                  <p className="text-[11px] text-sand-400 pl-4">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl tracking-luxury text-white">VELOURA</span>
              <span className="block text-[10px] uppercase tracking-widest text-gold -mt-1">
                Resort & Private Villas
              </span>
            </Link>
            <p className="font-serif italic text-gold text-lg">
              "Escape into the extraordinary."
            </p>
            <p className="text-sm text-sand-300/90 font-sans leading-relaxed max-w-sm">
              A secluded sanctuary of untouched tropical reefs, biophilic architecture, and soulful hospitality designed to restore harmony between humans and the natural world.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="#instagram"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-forest-900 border border-forest-700 flex items-center justify-center text-sand-300 hover:text-gold hover:border-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-forest-900 border border-forest-700 flex items-center justify-center text-sand-300 hover:text-gold hover:border-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#youtube"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-forest-900 border border-forest-700 flex items-center justify-center text-sand-300 hover:text-gold hover:border-gold transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Stays & Villas */}
          <div>
            <h4 className="text-xs uppercase tracking-luxury text-gold font-medium mb-5">
              The Sanctuaries
            </h4>
            <ul className="space-y-3 text-sm text-sand-300 font-sans">
              <li>
                <Link to="/stay/oceanfront-villa" className="hover:text-gold transition-colors">
                  Oceanfront Villa
                </Link>
              </li>
              <li>
                <Link to="/stay/garden-retreat" className="hover:text-gold transition-colors">
                  Garden Retreat
                </Link>
              </li>
              <li>
                <Link to="/stay/beachside-suite" className="hover:text-gold transition-colors">
                  Beachside Suite
                </Link>
              </li>
              <li>
                <Link to="/stay/family-residence" className="hover:text-gold transition-colors">
                  Family Residence
                </Link>
              </li>
              <li>
                <Link to="/stays" className="text-gold hover:underline text-xs tracking-wider inline-flex items-center gap-1 pt-1">
                  View All Stays &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Resort Experiences */}
          <div>
            <h4 className="text-xs uppercase tracking-luxury text-gold font-medium mb-5">
              Experiences
            </h4>
            <ul className="space-y-3 text-sm text-sand-300 font-sans">
              <li>
                <Link to="/experiences" className="hover:text-gold transition-colors">
                  Solace Overwater Spa
                </Link>
              </li>
              <li>
                <Link to="/experiences" className="hover:text-gold transition-colors">
                  Treehouse & Beach Dining
                </Link>
              </li>
              <li>
                <Link to="/experiences" className="hover:text-gold transition-colors">
                  Phinisi Teak Sunset Cruise
                </Link>
              </li>
              <li>
                <Link to="/experiences" className="hover:text-gold transition-colors">
                  Bioluminescent Reef Safari
                </Link>
              </li>
              <li>
                <Link to="/experiences" className="hover:text-gold transition-colors">
                  Coral Restoration Project
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div>
            <h4 className="text-xs uppercase tracking-luxury text-gold font-medium mb-5">
              Sanctuary Haven
            </h4>
            <div className="space-y-3 text-sm text-sand-300 font-sans">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Veloura Private Coral Atoll, South Azure Archipelago</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>+91 (22) 6123-8356 / 1800-123-VELOURA</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>concierge@velouraresort.com</span>
              </div>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded-full bg-forest-900 border border-forest-700 text-xs text-gold">
                  Seaplane: Coordinates 04°12'N 73°30'E
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Disclaimer & Copyright Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-forest-900 flex flex-col md:flex-row items-center justify-between text-xs text-sand-400 font-sans gap-4">
          <p>© {new Date().getFullYear()} VELOURA Hospitality Group. All rights reserved.</p>
          <div className="p-2.5 bg-forest-900/60 border border-white/5 rounded-lg text-center md:text-right max-w-lg">
            <p className="text-[11px] text-sand-300">
              <strong className="text-gold">Demonstration Notice:</strong> Veloura is a concept luxury hospitality experience created for portfolio presentation. All room prices, availability, and reservations are simulated frontend demo data.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

