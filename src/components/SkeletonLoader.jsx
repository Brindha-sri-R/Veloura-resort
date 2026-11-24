import React from 'react';

/**
 * Base shimmering pulse block tailored to Veloura's warm luxury sand palette.
 */
export function SkeletonBox({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-sand-200/80 via-sand-100 to-sand-200/80 bg-[length:200%_100%] rounded-2xl ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton loader matching StayCard.jsx structure
 */
export function StayCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-sand-300/80 shadow-luxury flex flex-col justify-between">
      {/* Image Skeleton */}
      <div className="relative aspect-[16/10] bg-sand-200/70 animate-pulse">
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <SkeletonBox className="w-24 h-6 rounded-full" />
          <SkeletonBox className="w-14 h-6 rounded-full" />
        </div>
        <div className="absolute bottom-3 left-4">
          <SkeletonBox className="w-28 h-4 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <SkeletonBox className="w-20 h-3 mb-2.5 rounded-full" />
          <SkeletonBox className="w-3/4 h-7 mb-3 rounded-xl" />
          <div className="space-y-1.5 mb-4">
            <SkeletonBox className="w-full h-3 rounded-full" />
            <SkeletonBox className="w-5/6 h-3 rounded-full" />
          </div>

          {/* Specs Row */}
          <div className="flex items-center gap-4 py-3 border-y border-sand-200/90">
            <SkeletonBox className="w-24 h-4 rounded-full" />
            <SkeletonBox className="w-16 h-4 rounded-full" />
            <SkeletonBox className="w-20 h-4 rounded-full" />
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="flex items-center justify-between pt-3">
          <div className="space-y-1">
            <SkeletonBox className="w-16 h-3 rounded-full" />
            <SkeletonBox className="w-28 h-6 rounded-xl" />
          </div>
          <SkeletonBox className="w-28 h-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader matching StayDetails.jsx
 */
export function StayDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8" aria-busy="true" aria-label="Loading sanctuary details">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center justify-between">
        <SkeletonBox className="w-36 h-4 rounded-full" />
        <SkeletonBox className="w-48 h-4 rounded-full hidden sm:block" />
      </div>

      {/* Gallery Showcase Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 aspect-[16/10] rounded-3xl bg-sand-200/70 animate-pulse" />
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="aspect-[16/10] rounded-2xl bg-sand-200/60 animate-pulse" />
          <div className="aspect-[16/10] rounded-2xl bg-sand-200/60 animate-pulse" />
        </div>
      </div>

      {/* Main Content & Sticky Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-4">
        <div className="lg:col-span-8 space-y-6">
          <SkeletonBox className="w-32 h-4 rounded-full" />
          <SkeletonBox className="w-2/3 h-10 rounded-2xl" />
          <SkeletonBox className="w-48 h-5 rounded-full" />

          {/* Specs Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y border-sand-300">
            <SkeletonBox className="h-12 rounded-xl" />
            <SkeletonBox className="h-12 rounded-xl" />
            <SkeletonBox className="h-12 rounded-xl" />
            <SkeletonBox className="h-12 rounded-xl" />
          </div>

          {/* Description */}
          <div className="space-y-2.5 pt-2">
            <SkeletonBox className="w-full h-4 rounded-full" />
            <SkeletonBox className="w-full h-4 rounded-full" />
            <SkeletonBox className="w-4/5 h-4 rounded-full" />
          </div>

          {/* Amenities Grid */}
          <div className="pt-4 space-y-3">
            <SkeletonBox className="w-40 h-6 rounded-xl" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonBox key={i} className="h-10 rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 border border-sand-300 shadow-luxury space-y-4">
            <SkeletonBox className="w-32 h-7 rounded-xl" />
            <SkeletonBox className="w-full h-14 rounded-2xl" />
            <SkeletonBox className="w-full h-14 rounded-2xl" />
            <SkeletonBox className="w-full h-12 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader matching MyBookings.jsx reservation cards
 */
export function BookingCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-300 shadow-luxury flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full md:w-auto">
        <SkeletonBox className="w-full sm:w-36 h-28 rounded-2xl flex-shrink-0" />
        <div className="space-y-2 w-full sm:w-64">
          <div className="flex items-center gap-2">
            <SkeletonBox className="w-20 h-5 rounded-full" />
            <SkeletonBox className="w-16 h-5 rounded-full" />
          </div>
          <SkeletonBox className="w-48 h-6 rounded-xl" />
          <SkeletonBox className="w-40 h-4 rounded-full" />
          <SkeletonBox className="w-32 h-3 rounded-full" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-sand-200">
        <div className="space-y-1 md:text-right">
          <SkeletonBox className="w-20 h-3 rounded-full" />
          <SkeletonBox className="w-28 h-6 rounded-xl" />
        </div>
        <SkeletonBox className="w-32 h-9 rounded-full" />
      </div>
    </div>
  );
}

export default {
  SkeletonBox,
  StayCardSkeleton,
  StayDetailsSkeleton,
  BookingCardSkeleton,
};
