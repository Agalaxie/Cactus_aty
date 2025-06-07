'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { m } from 'framer-motion';
import { PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

const announcements = [
  "Demandez nos Prix Cactus-Pro",
  "Remise pour toute commande dépassant 800 euros", 
  "Livraison dans toute la France",
  "Nos aménagements jardins de cactus particuliers"
];

export default function TopBar() {
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
    <div 
      className="bg-[var(--accent)] text-white text-sm py-2 relative overflow-hidden"
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center">
          {/* Infos contact - Gauche */}
          <div className="hidden lg:flex items-center space-x-6 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <PhoneIcon className="h-4 w-4" />
              <span>06 03 42 55 95</span>
            </div>
            <div className="flex items-center space-x-2">
              <EnvelopeIcon className="h-4 w-4" />
              <span>contact@atypic-cactus.fr</span>
            </div>
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-4 w-4" />
              <span>Lun-Ven 9h-18h</span>
            </div>
          </div>

          {/* Espace flexible */}
          <div className="flex-1"></div>

          {/* Annonces rotatif - Droite */}
          <div className="flex items-center justify-end">
            <div className="relative h-6 w-full max-w-sm">
              <AnimatePresence mode="wait">
                <m.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 flex items-center justify-end font-medium text-right whitespace-nowrap pr-2"
                >
                  ✨ {announcements[currentIndex]} ✨
                </m.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Infos contact mobile - Extrême droite */}
          <div className="lg:hidden flex items-center space-x-3 flex-shrink-0 ml-4">
            <a href="tel:0603425595" className="flex items-center space-x-1">
              <PhoneIcon className="h-4 w-4" />
              <span className="hidden sm:inline">06 03 42 55 95</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 