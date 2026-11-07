/**
 * VELOURA Luxury Motion Design System
 * Calm, cinematic, fluid, nature-inspired animations.
 */

// Custom luxury cubic bezier easing: smooth acceleration, elegant deceleration
export const luxuryEase = [0.16, 1, 0.3, 1];

// Soft spring configuration
export const luxurySpring = {
  type: "spring",
  stiffness: 90,
  damping: 20,
  mass: 1,
};

// Container stagger variants
export const staggerContainer = (staggerChildren = 0.12, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Subtle fade-in up
export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: luxuryEase,
    },
  },
};

// Fade in with scale
export const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: luxuryEase,
    },
  },
};

// Mask clip reveal for images
export const maskReveal = {
  hidden: {
    clipPath: "inset(10% 0% 10% 0%)",
    opacity: 0,
    scale: 1.05,
  },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.1,
      ease: luxuryEase,
    },
  },
};

// Word reveal variants for editorial typography
export const wordRevealContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const wordRevealItem = {
  hidden: {
    opacity: 0,
    y: "100%",
    rotateX: -20,
  },
  visible: {
    opacity: 1,
    y: "0%",
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: luxuryEase,
    },
  },
};

// Card stagger item
export const cardStaggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: luxuryEase,
    },
  },
};

