'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DarkModeSwitch from './DarkModeSwitch';
import MegaMenu from './MegaMenu';

interface HeaderProps {
  showMegaMenu?: boolean;
}

export default function Header({ showMegaMenu = true }: HeaderProps) {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMegaMenuOpen(false);
  };

  const closeMegaMenu = () => {
    setIsMegaMenuOpen(false);
  };

  return (
    <>
      {/* Overlay pour fermer le mega menu */}
      {isMegaMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/10 z-40"
          onClick={closeMegaMenu}
        />
      )}
      
      <header className="relative w-full bg-[var(--background)] text-[var(--card-title)] flex items-center py-3 shadow-sm border-b border-[var(--border)] text-sm z-50">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-4">
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
            <nav className="hidden md:flex items-center space-x-6">
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
                  />
                </div>
              )}
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
            </nav>
          </div>
          
          <div className="flex items-center">
            <span className="hidden sm:block font-medium">Livraison offerte dès 200 €</span>
            {/* Info Button */}
            <button
              className="ml-4 flex items-center justify-center rounded-full p-2 bg-[var(--card-bg)] hover:bg-[var(--accent)] transition-colors text-[var(--card-title)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
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
      </header>
    </>
  );
} 