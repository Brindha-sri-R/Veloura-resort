# VELOURA — Luxury Tropical Resort Booking Experience

> *"Escape into the extraordinary."*

**VELOURA** is an award-winning, editorial-style luxury resort booking web application for an intimate private coral atoll sanctuary. Built with **React 18**, **Vite**, **Framer Motion**, and **Tailwind CSS**, the platform merges high-fashion travel magazine aesthetics with an interactive, end-to-end booking flow and motion design system.

---

## ✨ Design Direction & Brand Identity

VELOURA translates the architectural language of high-end boutique hospitality (*Aman*, *Cheval Blanc*, *One&Only*) into an intuitive digital experience.

* **Colour Palette:**
  * **Ivory Canvas:** `#F8F6F0`
  * **Deep Forest Green:** `#123D35`
  * **Champagne Gold:** `#C5A77A`
  * **Sage Accent:** `#D8E8DC`
  * **Warm Sand:** `#F5F0E6`
* **Typography:**
  * **Headings:** *Cormorant Garamond* (Classic editorial serif)
  * **Body:** *DM Sans* (Clean geometric sans-serif)
* **Aesthetics:**
  * Editorial asymmetry and spacious margins
  * Natural tropical photography with zero digital clutter
  * Glassmorphic micro-details with subtle borders

---

## 🌴 Key Features

### 1. Cinematic Editorial Hero
* Large-scale, high-fidelity tropical resort photography (thatched pavilions, private infinity pool, turquoise lagoon).
* Staggered word-by-word headline reveal (*"Escape into the extraordinary."*).
* GPU-accelerated smooth parallax scroll translation.
* Non-clipping vertical side micro-typography (`Azure Atoll Sanctuary • 04°12'N 73°30'E`).
* Physics-based magnetic CTA buttons (`MagneticButton`).

### 2. Real-Time Booking Search & Filter
* Floating Casa Vela–inspired availability panel.
* Dynamic check-in/check-out date validation.
* Guest selection with category-based filtering.
* Smooth scroll-anchor to curated stays.

### 3. Curated Private Residences (Stays)
* Four core architectural categories:
  * **Oceanfront Villa** — Suspended over crystalline coral waters with private infinity pool.
  * **Garden Retreat** — Botanical sanctuary surrounded by ancient banyans and basalt plunge courts.
  * **Beachside Suite** — Steps from pure white sand with panoramic sunrise ocean views.
  * **Family Residence** — Multi-pavilion compound with children's splash bay and private dining deck.
* Detailed stay view (`/stay/:id`): photo gallery, specifications, curated amenities, interactive stay details, and pricing summary.

### 4. Architectural Dialogue & Editorial Masonry
* Two-column editorial showcase pairing timber pavilion architecture with evocative design philosophy.
* Curated 5-image asymmetrical masonry collage with scroll-triggered zoom and subtle viewport reveal.
* Animated hover indicators on collection links.

### 5. Curated Island Experiences
* Signature adventures including Coral Reef Subterranean Spa, Sunset Teak Yacht Cruise, Marine Safari & Coral Lab, and Private Starlight Dining.
* Interactive modal view with full itinerary, inclusions, pricing, and direct booking trigger.

### 6. Orbital Floating Testimonials
* Circular guest profile avatars positioned in an orbital layout around a central card.
* Smooth quote slide transitions powered by `AnimatePresence`.
* Touch-friendly mobile carousel navigation.

### 7. Complete Booking Engine & Reservation Persistence
* Live UTC nights calculation ensuring precise date math across all time zones.
* Transparent breakdown: Base nightly rate × nights + 12% eco-green tax + 10% hospitality service charge.
* Unique confirmation reference generation (`VEL-XXXX-YYYY`).
* Persistent reservation management via `LocalStorage` with dedicated **My Reservations** dashboard (`/my-bookings`).

### 8. Motion Design System
* **Scroll Progress:** Thin champagne-gold viewport progress bar.
* **Custom Cursor:** Dual-element fluid magnetic cursor (active on desktop fine-pointer devices, disabled on touch).
* **Animated Counters:** Viewport-triggered numeric counters for sanctuary metrics.
* **Smooth Page Transitions:** Seamless route transitions with `AnimatePresence mode="wait"`.
* **Accessibility:** Fully respects `prefers-reduced-motion`.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 18](https://react.dev/) |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **Routing** | [React Router DOM v6](https://reactrouter.com/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) |
| **Animation** | [Framer Motion 11](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **State** | React Context API (`BookingContext`) + `LocalStorage` |

---

## 📁 Project Structure

```text
Veloura/
├── public/                 # Static assets, favicon, pristine hero photography
├── src/
│   ├── assets/             # Resort photographs and local editorial assets
│   ├── components/         # Reusable UI & motion components
│   │   ├── AnimatedCounter.jsx    # Viewport-triggered stat counters
│   │   ├── BookingSearch.jsx      # Availability search bar
│   │   ├── CustomCursor.jsx       # Desktop magnetic circular cursor
│   │   ├── EditorialGallery.jsx   # Architectural dialogue & 5-image masonry
│   │   ├── ExperienceCard.jsx     # Experience showcase cards
│   │   ├── ExperienceModal.jsx    # Experience detail & booking modal
│   │   ├── FloatingReviews.jsx    # Orbital guest testimonial cards
│   │   ├── Footer.jsx             # Luxury brand footer & newsletter
│   │   ├── Hero.jsx               # Editorial cinematic hero section
│   │   ├── MagneticButton.jsx     # Physics attraction button wrapper
│   │   ├── Navbar.jsx             # Gliding underline navigation & menu
│   │   ├── PageTransition.jsx     # Animated route wrapper
│   │   ├── ScrollProgress.jsx     # Viewport scroll progress bar
│   │   └── StayCard.jsx           # Residence card with hover elevation
│   ├── context/
│   │   └── BookingContext.jsx     # Global booking state & LocalStorage sync
│   ├── data/
│   │   ├── experiencesData.js     # Curated experience collection
│   │   ├── reviewsData.js         # Guest reflections & accolades
│   │   └── staysData.js           # Villa pricing, facilities & photography
│   ├── pages/
│   │   ├── About.jsx              # Sanctuary philosophy & sustainability
│   │   ├── BookingConfirmation.jsx# Reservation confirmed screen
│   │   ├── BookingFlow.jsx        # Step-by-step reservation checkout
│   │   ├── Contact.jsx            # Concierge inquiry form & location
│   │   ├── Experiences.jsx        # Full curated experiences catalog
│   │   ├── Home.jsx               # Editorial homepage
│   │   ├── MyBookings.jsx         # Guest reservation lookup & manager
│   │   ├── NotFound.jsx           # 404 luxury fallback
│   │   ├── StayDetails.jsx        # Deep dive into individual villas
│   │   └── Stays.jsx              # Complete private residence collection
│   ├── utils/
│   │   └── motion.js              # Custom cubic-bezier easings & variants
│   ├── App.jsx                    # Root app, providers & route definitions
│   ├── index.css                  # Global styles, fonts & Tailwind directives
│   └── main.jsx                   # Application entry point
├── package.json                   # Project metadata and dependencies
├── tailwind.config.js             # Custom luxury colors, fonts & spacing
└── vite.config.js                 # Vite development & build configuration
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation

1. Clone or navigate to the repository directory:
   ```bash
   cd Veloura
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the Vite development server:
```bash
npm run dev
```

The application will be accessible at:
```text
http://127.0.0.1:3000/
```

### Building for Production

Compile optimized production bundles:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 🌐 Routes Overview

| Path | Description |
|---|---|
| `/` | Editorial Homepage (Hero, Search, Stays, Dialogue, Reviews) |
| `/stays` | Complete collection of private luxury villas |
| `/stay/:id` | Detailed villa overview, gallery, amenities & pricing |
| `/experiences` | Curated island excursions, wellness & dining |
| `/about` | Veloura philosophy, biophilic architecture & sustainability |
| `/contact` | Concierge & private seaplane charter inquiries |
| `/book` | Multi-step booking flow with date calculation |
| `/confirmation/:reference` | Printable booking confirmation & details |
| `/my-bookings` | Guest reservation lookup via reference number |

---

## 📄 License

This project is created for demonstration and showcase purposes. All rights reserved.
