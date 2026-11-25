import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookingProvider } from './context/BookingContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Toast from './components/Toast';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
import AuthModal from './components/AuthModal';
import SignOutConfirmationModal from './components/SignOutConfirmationModal';
import ProtectedRoute from './components/ProtectedRoute';

// Code-split pages via React.lazy for optimal performance and chunking
const Home = lazy(() => import('./pages/Home'));
const Stays = lazy(() => import('./pages/Stays'));
const StayDetails = lazy(() => import('./pages/StayDetails'));
const Experiences = lazy(() => import('./pages/Experiences'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const BookingFlow = lazy(() => import('./pages/BookingFlow'));
const BookingConfirmation = lazy(() => import('./pages/BookingConfirmation'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const Profile = lazy(() => import('./pages/Profile'));
const SignIn = lazy(() => import('./pages/SignIn'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] bg-[#FAF7F2] flex items-center justify-center pt-24" aria-busy="true">
      <div className="w-8 h-8 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex-1 flex flex-col"
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/stays" element={<Stays />} />
            <Route path="/stay/:id" element={<StayDetails />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/book"
              element={
                <ProtectedRoute>
                  <BookingFlow />
                </ProtectedRoute>
              }
            />
            <Route
              path="/confirmation/:reference"
              element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <ScrollToTop />
          <ScrollProgress />
          <CustomCursor />
          <div className="flex flex-col min-h-screen bg-[#F8F6F0] font-sans text-forest-950 antialiased selection:bg-gold selection:text-forest-950">
            <Navbar />
            <main className="flex-1 flex flex-col">
              <AnimatedRoutes />
            </main>
            <Footer />
            <Toast />
            <AuthModal />
            <SignOutConfirmationModal />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}
