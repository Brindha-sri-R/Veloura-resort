import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';
import StayCard from '../components/StayCard';
import BookingSearch from '../components/BookingSearch';
import { staysData, roomCategories } from '../data/staysData';

export default function Stays() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All Stays';
  const initialGuests = parseInt(searchParams.get('guests')) || 0;

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [minGuests, setMinGuests] = useState(initialGuests);
  const [sortBy, setSortBy] = useState('recommended');

  const filteredStays = useMemo(() => {
    return staysData
      .filter((stay) => {
        // Category filter
        if (selectedCategory !== 'All Stays' && stay.category !== selectedCategory) {
          return false;
        }
        // Min Guests filter
        if (minGuests > 0 && stay.maxGuests < minGuests) {
          return false;
        }
        // Search Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = stay.name.toLowerCase().includes(q);
          const matchesDesc = stay.description.toLowerCase().includes(q);
          const matchesView = stay.view.toLowerCase().includes(q);
          const matchesFacilities = stay.facilities.some(f => f.toLowerCase().includes(q));
          if (!matchesName && !matchesDesc && !matchesView && !matchesFacilities) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
        if (sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // recommended order
      });
  }, [selectedCategory, minGuests, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All Stays');
    setSearchQuery('');
    setMinGuests(0);
    setSortBy('recommended');
  };

  return (
    <div className="pt-28 pb-24 bg-[#FAF7F2] min-h-screen">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-gold-600 font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Sanctuary Portfolio</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-forest-950 font-normal tracking-tight">
            Our Private Stays
          </h1>
          <p className="mt-4 text-sm sm:text-base text-forest-700/80 font-sans leading-relaxed">
            Secluded residences, cantilevered overwater pavilions, and botanical garden retreats crafted in dialogue with nature. Every villa includes dedicated island butler service.
          </p>
        </div>
      </div>

      {/* Main Filter & Search Control Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-luxury border border-sand-300/80 space-y-6">
          {/* Top Row: Search input & Sort */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Query */}
            <div className="md:col-span-8 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by villa name, feature (e.g. pool, sauna, lagoon)..."
                className="w-full pl-11 pr-4 py-3 bg-sand-50/70 border border-sand-200 rounded-2xl text-sm text-forest-950 placeholder-forest-400 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {/* Sort Selector */}
            <div className="md:col-span-4 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gold flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-3 px-3.5 bg-sand-50/70 border border-sand-200 rounded-2xl text-xs font-medium text-forest-950 focus:outline-none focus:border-gold cursor-pointer"
              >
                <option value="recommended">Sort: Curated Selection</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Guest Rating</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Category Pills & Guest Capacity */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-4 border-t border-sand-200/90">
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
              {roomCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 flex-shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-forest-900 text-white border-forest-900 font-medium shadow-sm'
                      : 'bg-sand-50/50 text-forest-800 border-sand-300 hover:border-gold'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Guest Capacity Filter & Reset */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              <div className="flex items-center gap-2 text-xs text-forest-800">
                <span className="text-forest-600">Min Guests:</span>
                <select
                  value={minGuests}
                  onChange={(e) => setMinGuests(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded-xl border border-sand-300 bg-sand-50 text-xs text-forest-950 focus:outline-none focus:border-gold"
                >
                  <option value={0}>Any</option>
                  <option value={2}>2+ Guests</option>
                  <option value={4}>4+ Guests</option>
                  <option value={6}>6+ Guests</option>
                </select>
              </div>

              {(selectedCategory !== 'All Stays' || searchQuery || minGuests > 0 || sortBy !== 'recommended') && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-700 hover:text-rose-900 font-medium px-3 py-1.5 rounded-full hover:bg-rose-50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between text-xs text-forest-600">
        <span>
          Showing <strong className="text-forest-950">{filteredStays.length}</strong> available sanctuaries
        </span>
        <span className="italic font-serif text-gold-700">
          All rates include complimentary island breakfast & butler
        </span>
      </div>

      {/* Stays Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredStays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {filteredStays.map((stay) => (
              <StayCard key={stay.id} stay={stay} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-sand-300 shadow-luxury max-w-lg mx-auto">
            <h3 className="font-serif text-2xl text-forest-950 mb-2">No Sanctuaries Match Your Criteria</h3>
            <p className="text-sm text-forest-600 mb-6 font-sans">
              Try adjusting your search terms, removing filters, or view our complete collection.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-forest-900 text-white rounded-full text-xs font-semibold tracking-luxury uppercase hover:bg-forest-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

