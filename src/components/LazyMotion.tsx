'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';

// Wrapper pour charger framer-motion de manière lazy
export default function LazyMotionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

// Export du composant motion optimisé
export { m as motion }; 