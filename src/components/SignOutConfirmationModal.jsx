import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

export default function SignOutConfirmationModal() {
  const { isSignOutModalOpen, closeSignOutModal, confirmSignOut, user } = useAuth();
  const { showToast } = useBooking();
  const navigate = useNavigate();

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSignOutModalOpen) {
        closeSignOutModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSignOutModalOpen, closeSignOutModal]);

  if (!isSignOutModalOpen) return null;

  const handleConfirm = () => {
    confirmSignOut(() => {
      showToast('You have been signed out successfully.', 'info');
      navigate('/signin');
    });
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signout-dialog-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-forest-950/80 backdrop-blur-sm"
          onClick={closeSignOutModal}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl border border-sand-300 shadow-2xl p-6 sm:p-7 z-10 overflow-hidden my-auto text-center"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeSignOutModal}
            className="absolute top-4 right-4 p-2 rounded-full text-forest-700/70 hover:text-forest-950 hover:bg-sand-200/60 transition-colors focus:outline-none"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top Warning Badge */}
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 mx-auto flex items-center justify-center mb-4 shadow-sm">
            <LogOut className="w-5 h-5 ml-0.5" />
          </div>

          {/* Title - exactly as requested */}
          <h3 id="signout-dialog-title" className="font-serif text-2xl text-forest-950 font-normal">
            Are you sure you want to sign out?
          </h3>

          {/* Message - exactly as requested */}
          <p className="mt-2 text-xs sm:text-sm text-forest-700/80 font-sans max-w-xs mx-auto">
            You will need to sign in again to access your account.
          </p>

          {user?.email && (
            <div className="mt-3 inline-block px-3 py-1 bg-sand-200/60 border border-sand-300 rounded-full text-[11px] text-forest-700 font-sans">
              Signed in as <strong className="text-forest-950">{user.email}</strong>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={closeSignOutModal}
              className="flex-1 py-3 px-4 rounded-full border border-sand-300 hover:border-sand-400 bg-white hover:bg-sand-100 text-forest-900 text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
