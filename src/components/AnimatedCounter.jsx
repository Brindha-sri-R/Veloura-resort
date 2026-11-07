import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export default function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1.8 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  // If value is non-numeric string (e.g. "Zero" or "24 / 7")
  const isNumeric = !isNaN(Number(String(value).replace(/,/g, '')));
  const targetNumber = isNumeric ? Number(String(value).replace(/,/g, '')) : null;

  useEffect(() => {
    if (!isInView || !isNumeric || targetNumber === null) return;

    let start = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easedProgress * targetNumber);

      setDisplayValue(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetNumber);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, isNumeric, targetNumber, duration]);

  if (!isNumeric) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

