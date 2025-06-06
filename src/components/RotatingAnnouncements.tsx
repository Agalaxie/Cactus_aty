'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const announcements = [
  "Demandez nos Prix Cactus-Pro",
  "Remise pour toute commande dépassant 800 euros", 
  "Livraison dans toute la France",
  "Nos aménagements jardins de cactus particuliers"
];

export default function RotatingAnnouncements() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % announcements.length
      );
    }, 3000); // Change toutes les 3 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:block relative h-6 w-64 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.5,
            ease: "easeInOut"
          }}
          className="absolute inset-0 flex items-center font-medium text-sm text-[var(--accent)] whitespace-nowrap"
        >
          {announcements[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
} 