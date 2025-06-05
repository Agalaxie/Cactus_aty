'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DarkModeSwitch from './DarkModeSwitch';
import MegaMenu from './MegaMenu';
import SearchBar from './SearchBar';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  showMegaMenu?: boolean;
}

export default function Header({ showMegaMenu = true }: HeaderProps) {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 100); // Délai de 100ms avant fermeture
    setCloseTimeout(timeout);
  };

  const closeMegaMenu = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setIsMegaMenuOpen(false);
  };

  // Cleanup du timeout au démontage
  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  return (
    <>
      {/* Overlay pour fermer le mega menu */}
      {isMegaMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/10 z-40"
          onClick={closeMegaMenu}
        />
      )}
      
      <header className="relative w-full bg-[var(--background)] text-[var(--card-title)] shadow-sm border-b border-[var(--border)] text-sm z-50">
        <div className="max-w-7xl mx-auto w-full px-4">
          {/* Ligne principale du header */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-8">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Atypic Cactus"
                  width={120}
                  height={40}
                  className="h-8 w-auto cursor-pointer"
                />
              </Link>
              
              {/* Navigation Menu */}
              <nav className="hidden lg:flex items-center space-x-6">
                {showMegaMenu && (
                  <div 
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button className="px-3 py-2 text-[var(--card-title)] hover:text-[var(--accent)] transition-colors font-medium flex items-center space-x-1">
                      <span>Nos Collections</span>
                      <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Mega Menu */}
                    <MegaMenu 
                      isOpen={isMegaMenuOpen} 
                      onClose={closeMegaMenu}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    />
                  </div>
                )}
                <Link
                  href="/conseils"
                  className="px-3 py-2 text-[var(--card-title)] hover:text-[var(--accent)] transition-colors font-medium"
                >
                  Conseils
                </Link>
                <Link
                  href="/qui-suis-je"
                  className="px-3 py-2 text-[var(--card-title)] hover:text-[var(--accent)] transition-colors font-medium"
                >
                  Qui suis-je ?
                </Link>
                <Link
                  href="/commande"
                  className="px-3 py-2 text-[var(--card-title)] hover:text-[var(--accent)] transition-colors font-medium"
                >
                  Commande
                </Link>
                <Link
                  href="/espace-client"
                  className="px-3 py-2 text-[var(--card-title)] hover:text-[var(--accent)] transition-colors font-medium flex items-center space-x-1"
                >
                  <span>👤</span>
                  <span>Mon Espace</span>
                </Link>
              </nav>
            </div>

            {/* Barre de recherche - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <SearchBar />
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Bouton recherche mobile */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="md:hidden flex items-center justify-center rounded-full p-2 bg-[var(--card-bg)] hover:bg-[var(--accent)] transition-colors text-[var(--card-title)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                aria-label="Rechercher"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

              <span className="hidden lg:block font-medium">Livraison offerte dès 200 €</span>
              
              {/* Info Button */}
              <button
                className="flex items-center justify-center rounded-full p-2 bg-[var(--card-bg)] hover:bg-[var(--accent)] transition-colors text-[var(--card-title)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                aria-label="Informations"
                type="button"
                onClick={() => alert('Informations sur Atypic Cactus')}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span className="sr-only">Informations</span>
              </button>
              <DarkModeSwitch />
            </div>
          </div>

          {/* Barre de recherche mobile */}
          {showMobileSearch && (
            <div className="md:hidden py-3 border-t border-[var(--border)]">
              <SearchBar 
                isMobile={true} 
                onClose={() => setShowMobileSearch(false)} 
              />
            </div>
          )}
        </div>
      </header>
    </>
  );
} 