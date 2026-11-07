import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function Toast() {
  const { toast } = useBooking();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-gold-600 flex-shrink-0" />
  };

  const borderColors = {
    success: 'border-emerald-200 bg-white/95 text-forest-900',
    error: 'border-rose-200 bg-white/95 text-rose-950',
    info: 'border-gold-300 bg-white/95 text-forest-900'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 pointer-events-none"
      >
        <div className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md ${borderColors[toast.type] || borderColors.info}`}>
          {icons[toast.type] || icons.info}
          <p className="text-sm font-medium leading-relaxed flex-1">
            {toast.message}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

