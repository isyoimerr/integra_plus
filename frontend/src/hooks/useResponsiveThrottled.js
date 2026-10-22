/**
 * useResponsiveThrottled.js
 * Hook optimizado para listeners de resize con throttling
 * Reduce re-renders de múltiples por segundo a 1 cada 300ms
 */

import { useState, useEffect, useRef } from 'react';

export function useResponsiveThrottled(throttleMs = 300) {
  const [width, setWidth] = useState(() => window.innerWidth);
  const throttleRef = useRef(null);

  useEffect(() => {
    const handler = () => {
      if (throttleRef.current) clearTimeout(throttleRef.current);
      throttleRef.current = setTimeout(() => {
        setWidth(window.innerWidth);
      }, throttleMs);
    };

    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
      if (throttleRef.current) clearTimeout(throttleRef.current);
    };
  }, [throttleMs]);

  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    width,
  };
}
