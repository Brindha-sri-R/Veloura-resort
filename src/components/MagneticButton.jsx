import React, { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function MagneticButton({ children, className = '', maxDistance = 6, ...props }) {
  const ref = useRef(null);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Constrain distance within luxury thresholds
    const moveX = Math.max(-maxDistance, Math.min(maxDistance, distanceX * 0.25));
    const moveY = Math.max(-maxDistance, Math.min(maxDistance, distanceY * 0.25));

    x.set(moveX);
    y.set(moveY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

