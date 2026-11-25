import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center pt-24">
        <div className="w-8 h-8 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Preserve requested location and show clear prompt on Sign In page
    return (
      <Navigate
        to="/signin"
        state={{
          from: location,
          message: 'Please sign in to continue.'
        }}
        replace
      />
    );
  }

  return children;
}
