'use client';

import { useEffect, useState } from "react";
import { useTheme } from 'next-themes';

export default function DarkModeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <button
      id="toggle-theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="ml-4 flex items-center justify-center rounded-full p-2 bg-[var(--card-bg)] hover:bg-[var(--accent)] transition-colors text-[var(--card-title)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      type="button"
    >
      {isDark ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transition: 'all 0.2s'}}><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z"/></svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transition: 'all 0.2s'}}>
          <circle cx="12" cy="12" r="4" fill="#FFD700"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
      )}
      <span className="sr-only">{isDark ? "Passer en mode clair" : "Passer en mode sombre"}</span>
    </button>
  );
} 