'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DarkModeSwitch from './DarkModeSwitch';
import MegaMenu from './MegaMenu';
import SearchBar from './SearchBar';
import TopBar from './TopBar';
import { ShoppingCartIcon, UserIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/lib/useAuth';

interface HeaderProps {
  showMegaMenu?: boolean;
}

export default function Header({ showMegaMenu = true }: HeaderProps) {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();

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
    }, 100);
    setCloseTimeout(timeout);
  };

  const closeMegaMenu = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setIsMegaMenuOpen(false);
  };

  // Gestion du scroll intelligent du header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const halfPageHeight = windowHeight / 2;
      
      // Dans la première moitié de page : header toujours visible et sticky
      if (currentScrollY <= halfPageHeight) {
        setIsHeaderVisible(true);
      } 
      // Après la première moitié : header visible seulement si scroll vers le haut
      else {
        const isScrollingUp = currentScrollY < lastScrollY;
        setIsHeaderVisible(isScrollingUp);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle pour optimiser les performances
    let timeoutId: NodeJS.Timeout;
    const throttledHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 10);
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

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
          className="fixed inset-0 bg-black/10 z-[50]"
          onClick={closeMegaMenu}
        />
      )}
      
      {/* MegaMenu rendu en dehors du header pour éviter les problèmes de stacking context */}
      {showMegaMenu && (
        <MegaMenu 
          isOpen={isMegaMenuOpen} 
          onClose={closeMegaMenu}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
      
      <header 
        className={`fixed top-0 w-full bg-white dark:bg-[var(--background)] shadow-md border-b border-gray-100 dark:border-[var(--border)] z-[55] transition-transform duration-300 ease-in-out ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        suppressHydrationWarning
      >
        {/* TopBar intégrée */}
        <TopBar />
        
        <div className="max-w-7xl mx-auto w-full px-4">
          {/* Ligne principale du header - Design inspiré FDJ */}
          <div className="flex items-center py-4 gap-6">
            
            {/* Logo - Plus compact */}
            <div className="flex-shrink-0">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Atypic Cactus"
                  width={160}
                  height={64}
                  className="h-12 w-auto cursor-pointer"
                />
              </Link>
            </div>

            {/* Navigation - Desktop uniquement */}
            <nav className="hidden lg:flex items-center space-x-6">
              {showMegaMenu && (
                <div 
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="text-gray-700 dark:text-[var(--card-title)] hover:text-[var(--accent)] transition-colors font-medium flex items-center space-x-1">
                    <span>Collections</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
              <Link
                href="/conseils"
                className="text-gray-700 dark:text-[var(--card-title)] hover:text-[var(--accent)] transition-colors font-medium"
              >
                Conseils
              </Link>
              <Link
                href="/production"
                className="text-gray-700 dark:text-[var(--card-title)] hover:text-[var(--accent)] transition-colors font-medium"
              >
                Production
              </Link>
              <Link
                href="/amenagement"
                className="text-gray-700 dark:text-[var(--card-title)] hover:text-[var(--accent)] transition-colors font-medium"
              >
                Aménagement
              </Link>
              <Link
                href="/qui-suis-je"
                className="text-gray-700 dark:text-[var(--card-title)] hover:text-[var(--accent)] transition-colors font-medium"
              >
                Qui suis-je ?
              </Link>
            </nav>
              
            {/* Barre de recherche centrale avec SearchBar complet */}
            <div className="flex-1 max-w-lg mx-auto hidden lg:block">
              <SearchBar />
            </div>
            
            {/* Groupe d'actions à droite - Simplifié */}
            <div className="flex items-center space-x-4">

              {/* Profil utilisateur - Desktop uniquement */}
              <Link
                href="/espace-client"
                className="hidden lg:flex items-center space-x-2 p-2 text-gray-600 dark:text-[var(--card-title)] hover:text-[var(--accent)] transition-colors"
              >
                <UserIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Mon Espace</span>
              </Link>

              {/* Lien Admin - Conditionnel */}
              {isAuthenticated && (
                <Link
                  href="/admin"
                  className="hidden lg:flex items-center space-x-2 p-2 text-gray-600 dark:text-[var(--card-title)] hover:text-[var(--accent)] transition-colors"
                  title="Administration"
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Admin</span>
                </Link>
              )}

              {/* Panier */}
              <Link 
                href="/panier"
                className="relative flex items-center justify-center p-2 text-gray-600 dark:text-[var(--card-title)] hover:text-[var(--accent)] transition-colors"
                aria-label={`Panier (${totalItems} article${totalItems > 1 ? 's' : ''})`}
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-5">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
              
              {/* Dark Mode Switch */}
              <div className="hidden lg:block">
                <DarkModeSwitch />
              </div>

              {/* Menu mobile */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="lg:hidden flex items-center justify-center p-2 text-gray-600 dark:text-[var(--card-title)] hover:text-[var(--accent)] transition-colors"
                aria-label="Menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation mobile */}
          {showMobileSearch && (
            <div className="lg:hidden py-3 border-t border-gray-100 dark:border-[var(--border)] space-y-2">
              <div className="pb-3">
                <SearchBar 
                  isMobile={true} 
                  onClose={() => setShowMobileSearch(false)} 
                />
              </div>
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/conseils"
                  onClick={() => setShowMobileSearch(false)}
                  className="text-gray-700 dark:text-[var(--card-title)] hover:text-[var(--accent)] py-2 font-medium"
                >
                  Conseils
                </Link>
                <Link
                  href="/production"
                  onClick={() => setShowMobileSearch(false)}
                  className="text-gray-700 dark:text-[var(--card-title)] hover:text-[var(--accent)] py-2 font-medium"
                >
                  Production
                </Link>
                <Link
                  href="/amenagement"
                  onClick={() => setShowMobileSearch(false)}
                  className="text-gray-700 dark:text-[var(--card-title)] hover:text-[var(--accent)] py-2 font-medium"
                >
                  Aménagement
                </Link>
                <Link
                  href="/qui-suis-je"
                  onClick={() => setShowMobileSearch(false)}
                  className="text-gray-700 dark:text-[var(--card-title)] hover:text-[var(--accent)] py-2 font-medium"
                >
                  Qui suis-je ?
                </Link>
                <Link
                  href="/espace-client"
                  onClick={() => setShowMobileSearch(false)}
                  className="text-gray-700 dark:text-[var(--card-title)] hover:text-[var(--accent)] py-2 font-medium"
                >
                  Mon Espace
                </Link>
                {isAuthenticated && (
                  <Link
                    href="/admin"
                    onClick={() => setShowMobileSearch(false)}
                    className="text-gray-700 dark:text-[var(--card-title)] hover:text-[var(--accent)] py-2 font-medium"
                  >
                    Administration
                  </Link>
                )}
                <div className="pt-2">
                  <DarkModeSwitch />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
} 