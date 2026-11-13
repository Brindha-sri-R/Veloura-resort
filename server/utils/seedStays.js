import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Stay from '../models/Stay.js';

dotenv.config();

const staysData = [
  {
    id: 'oceanfront-villa',
    name: 'Oceanfront Villa',
    subtitle: 'Panoramic Turquoise Horizons with Private Infinity Pool',
    category: 'Oceanfront Villa',
    slug: 'oceanfront-villa',
    featured: true,
    pricePerNight: 75000,
    rating: 4.98,
    reviewsCount: 84,
    size: '320 m² / 3,444 sq ft',
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 2,
    bedType: 'Custom King Cloud Bed',
    view: 'Unobstructed 180° Ocean & Reef View',
    tag: 'Signature Choice',
    shortDescription: 'Perched over crystalline waters with direct lagoon stairs, private freshwater infinity pool, and sunset sundeck.',
    description: `Immerse yourself in secluded overwater opulence. The Oceanfront Villa is conceived for those seeking an unbroken dialogue with the sea. Handcrafted from sustainably harvested teak and local limestone, this sanctuary features soaring vaulted ceilings, floor-to-ceiling glass pavilions that slide entirely open to the ocean breeze, and a private freshwater infinity pool suspended over the lagoon. 

Begin mornings with reef manta rays gliding beneath your glass-bottom living terrace, spend afternoons on sunken daybeds shaded by native palms, and end the evening stargazing from the open-air deep soaking marble bathtub.`,
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
    ],
    facilities: [
      'Private 12m Freshwater Infinity Pool',
      'Direct Lagoon Access Stairs',
      'Outdoor Rain Shower & Marble Soak Tub',
      'Dedicated 24/7 Island Host (Butler)',
      'Sub-Zero Wine Cellar & Artisanal Bar',
      'Bang & Olufsen 360 Acoustic System',
      'Twice-Daily Mindful Housekeeping',
      'Complimentary Sunset Champagne'
    ],
    amenityHighlights: [
      { name: 'Private Pool', icon: 'Waves' },
      { name: 'Ocean View', icon: 'Compass' },
      { name: 'Direct Lagoon', icon: 'Anchor' },
      { name: 'Private Butler', icon: 'UserCheck' },
      { name: 'High-Speed Wi-Fi', icon: 'Wifi' },
      { name: 'Wine Cellar', icon: 'Wine' }
    ],
    idealFor: 'Couples, Honeymoons, Discerning Solo Travellers'
  },
  {
    id: 'garden-retreat',
    name: 'Garden Retreat',
    subtitle: 'Botanical Sanctuary Enclosed by Ancient Banyan Trees',
    category: 'Garden Retreat',
    slug: 'garden-retreat',
    featured: true,
    pricePerNight: 45000,
    rating: 4.95,
    reviewsCount: 62,
    size: '260 m² / 2,798 sq ft',
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1.5,
    bedType: 'Emperor Silk-Draped Bed',
    view: 'Lush Botanical Rainforest & Lotus Pond',
    tag: 'Zen Sanctuary',
    shortDescription: 'Tucked into secluded tropical foliage, featuring outdoor stone bathing courts, meditation pavilions, and plunge pool.',
    description: `A haven of meditative stillness framed by vibrant orchids, whispering bamboo, and ancient banyans. The Garden Retreat dissolves the boundaries between architecture and pristine nature. Crafted with volcanic basalt stone, organic linen, and hand-carved mahogany, each suite offers a private walled courtyard where birdsong replaces the rush of the world.

Unwind in an open-sky thermal plunge pool, enjoy sunrise yoga on your private timber deck, and rejuvenate in a garden bathroom bordered by cascading tropical greenery and handcrafted organic amenities.`,
    images: [
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
    ],
    facilities: [
      'Heated Basalt Plunge Pool',
      'Private Meditation & Yoga Pavilion',
      'Open-Air Garden Bathing Court',
      'Custom Botanical Aromatherapy Bar',
      'Bespoke Pillow & Linen Menu',
      'Complimentary Morning Sound Bath',
      'Organic Herbal Tea Apothecary',
      'Electric Island Bicycles'
    ],
    amenityHighlights: [
      { name: 'Heated Plunge Pool', icon: 'Waves' },
      { name: 'Lush Garden', icon: 'Trees' },
      { name: 'Yoga Deck', icon: 'Sparkles' },
      { name: 'Sound Bath', icon: 'Music' },
      { name: 'Organic Bar', icon: 'Coffee' },
      { name: 'Free Bicycles', icon: 'Bike' }
    ],
    idealFor: 'Wellness Seekers, Creative Sabbaticals, Couples'
  },
  {
    id: 'beachside-suite',
    name: 'Beachside Suite',
    subtitle: 'Powder-White Sands Just Steps from Your Veranda',
    category: 'Beachside Suite',
    slug: 'beachside-suite',
    featured: true,
    pricePerNight: 60000,
    rating: 4.97,
    reviewsCount: 71,
    size: '280 m² / 3,013 sq ft',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    bedType: '1 King Bed + 2 Twin XL Beds',
    view: 'Direct Beachfront & Palm Grove',
    tag: 'Popular Choice',
    shortDescription: 'Step straight from your hardwood patio onto warm sands, with private beachfront cabana and outdoor lounge.',
    description: `Positioned directly along Veloura’s tranquil western cove where powdery white coral sands meet the gentle tide. The Beachside Suite captures the barefoot luxury essence of the tropics. Bi-folding floor-to-ceiling glass screens open seamlessly onto an expansive ironwood veranda adorned with plush daybeds, a shaded hammock pavilion, and an alfresco dining area.

Savor private beach dinners illuminated by flickering tiki torches, stroll the shoreline at dawn, and retreat into air-conditioned interior sanctuaries appointed with understated Scandinavian-tropical minimalism.`,
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ],
    facilities: [
      'Private Beach Cabana & Sun Loungers',
      'Spacious Shaded Ironwood Veranda',
      'Dual Master Suites with En-Suite Baths',
      'Direct Private Beach Pathway',
      'Outdoor Rainforest Shower',
      'Marshall Bluetooth Acoustic Speaker',
      'Nightly Beach Bonfire Service',
      'Paddleboards & Snorkel Kits Included'
    ],
    amenityHighlights: [
      { name: 'Direct Beach', icon: 'Sun' },
      { name: 'Private Cabana', icon: 'Umbrella' },
      { name: 'Dual Suites', icon: 'Bed' },
      { name: 'Water Sports', icon: 'Compass' },
      { name: 'Alfresco Dining', icon: 'Utensils' },
      { name: 'Bonfire Ritual', icon: 'Flame' }
    ],
    idealFor: 'Families with Older Children, Friends, Beach Lovers'
  },
  {
    id: 'family-residence',
    name: 'Family Residence',
    subtitle: 'Sprawling Multi-Pavilion Compound for Cherished Gatherings',
    category: 'Family Residence',
    slug: 'family-residence',
    featured: true,
    pricePerNight: 125000,
    rating: 4.99,
    reviewsCount: 48,
    size: '580 m² / 6,243 sq ft',
    maxGuests: 8,
    bedrooms: 3,
    bathrooms: 3.5,
    bedType: '2 King Master Suites + 2 Bunk/Twin Suites',
    view: 'Dual Ocean Lagoon & Private Palm Oasis',
    tag: 'Ultra-Exclusive',
    shortDescription: 'An expansive architectural estate featuring an Olympic-grade private pool, chef’s kitchen, and dedicated host team.',
    description: `Designed for multi-generational families and intimate group escapes who refuse to compromise on space, privacy, or luxury. The Family Residence is an estate within the sanctuary, secluded behind lush green living fences with its own private gateway.

It comprises three interconnected living pavilions surrounding a 20-metre saltwater pool, children’s shallow splash pool, open-concept show kitchen with private chef on call, and multiple sprawling living rooms filled with natural sea breezes and curated island artwork.`,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    facilities: [
      '20-Metre Private Saltwater Pool',
      'Children’s Dedicated Splash Lounge',
      'Gourmet Island Kitchen & Private Chef Option',
      'Dedicated Two-Person Butler & Concierge Team',
      'Private Cinema & Media Screening Room',
      'Customized Kids Nature Explorer Club',
      'Private Electric Golf Buggies',
      'In-Villa Barbecue & Seafood Banquet'
    ],
    amenityHighlights: [
      { name: '20m Pool', icon: 'Waves' },
      { name: 'Private Chef', icon: 'ChefHat' },
      { name: '3 En-Suite Bedrooms', icon: 'Home' },
      { name: 'Golf Buggy', icon: 'Car' },
      { name: 'Kids Concierge', icon: 'Heart' },
      { name: 'Private Cinema', icon: 'Tv' }
    ],
    idealFor: 'Families, Grand Celebrations, Multi-Generational Groups'
  },
  {
    id: 'overwater-horizon-pavilion',
    name: 'Overwater Horizon Pavilion',
    subtitle: 'Glass-Bottom Sanctuary Suspended Above the Coral Atoll',
    category: 'Oceanfront Villa',
    slug: 'overwater-horizon-pavilion',
    featured: false,
    pricePerNight: 95000,
    rating: 5.0,
    reviewsCount: 39,
    size: '360 m² / 3,875 sq ft',
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 2,
    bedType: 'Floating Custom King Bed',
    view: 'Infinite Western Sunset Horizon',
    tag: 'Signature Overwater',
    shortDescription: 'Cantilevered over the outer reef with catamaran net daybeds, infinity whirlpool, and unobstructed sunset vistas.',
    description: `Located at the furthest tip of our overwater pier for ultimate seclusion and zero foot traffic. The Overwater Horizon Pavilion showcases a transparent glass-bottom salon floor, a sunken outdoor lounge with fireplace, and an over-ocean catamaran netting suspended directly above luminous marine life.`,
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
    ],
    facilities: [
      'Over-Ocean Catamaran Netting Daybed',
      'Private Sunset Infinity Whirlpool',
      'Full Glass Bottom Salon Floor',
      'Dedicated Sommelier & Tailored Cellar',
      'Private Stargazing Telescope',
      'In-Villa Spa Treatment Terrace'
    ],
    amenityHighlights: [
      { name: 'Overwater Net', icon: 'Layers' },
      { name: 'Infinity Whirlpool', icon: 'Waves' },
      { name: 'Glass Floor', icon: 'Eye' },
      { name: 'Stargazing', icon: 'Moon' }
    ],
    idealFor: 'Anniversaries, Honeymoons, Romance'
  },
  {
    id: 'cliffside-wellness-sanctuary',
    name: 'Cliffside Wellness Sanctuary',
    subtitle: 'Elevated Coastal Haven with Thermal Springs & Sauna',
    category: 'Garden Retreat',
    slug: 'cliffside-wellness-sanctuary',
    featured: false,
    pricePerNight: 80000,
    rating: 4.96,
    reviewsCount: 34,
    size: '340 m² / 3,659 sq ft',
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 2,
    bedType: 'Ergonomic Organic Latex King Bed',
    view: 'Dramatic Coastal Bluff & Ocean Crags',
    tag: 'Wellness Focus',
    shortDescription: 'Perched high on granite bluffs, featuring a private cedar sauna, cold plunge, and open-air hot mineral bath.',
    description: `Ascend above the palms to Veloura’s elevated ridge. The Cliffside Wellness Sanctuary offers dramatic sweeping panoramas of both the untamed jungle canopy and crashing ocean waves below. Equipped with a private Finnish cedarwood sauna, ice plunge bath, and mineral soak pool.`,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
    ],
    facilities: [
      'Private Finnish Cedarwood Sauna',
      'Glacial Cold Plunge & Mineral Hot Pool',
      'Circadian Sleep Lighting System',
      'Acoustic Soundproofing & Pure Air Filtration',
      'Dedicated Ayurvedic Wellness Therapist',
      'Daily Sunrise Superfood Breakfast'
    ],
    amenityHighlights: [
      { name: 'Private Sauna', icon: 'Flame' },
      { name: 'Cold Plunge', icon: 'Snowflake' },
      { name: 'Therapist', icon: 'Activity' },
      { name: 'Circadian Lights', icon: 'Sun' }
    ],
    idealFor: 'Rejuvenation, Health Conscious, Deep Rest'
  }
];

async function seedStays() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('❌ MONGO_URI is not set in environment variables. Cannot seed stays.');
    process.exit(1);
  }

  try {
    console.log('🌿 Connecting to MongoDB Atlas for Stays Seeding...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas.');

    console.log('🧹 Clearing existing stays...');
    await Stay.deleteMany({});

    console.log(`🌱 Inserting ${staysData.length} luxury stays into MongoDB Atlas with INR pricing...`);
    const inserted = await Stay.insertMany(staysData);
    console.log(`✨ Successfully seeded ${inserted.length} stays:`);
    inserted.forEach((stay, index) => {
      console.log(`   ${index + 1}. ${stay.name} (${stay.category}) - ₹${stay.pricePerNight.toLocaleString('en-IN')}/night [slug: ${stay.slug}]`);
    });

    console.log('🌿 Seeding completed successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding stays:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

seedStays();

