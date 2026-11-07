import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-forest-950 text-white flex items-center justify-center px-4 py-24 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center text-gold mx-auto">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '12s' }} />
        </div>
        <span className="text-xs uppercase tracking-luxury text-gold block">
          404 • Sanctuary Uncharted
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-normal">
          The Horizon You Seek Drifts Beyond Our Atoll
        </h1>
        <p className="text-sm text-sand-300 font-sans leading-relaxed">
          The sanctuary or destination page you requested cannot be located. Allow us to guide you back to our main shores.
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold hover:bg-gold-300 text-forest-950 font-semibold text-xs tracking-luxury uppercase rounded-full shadow-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Veloura</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

