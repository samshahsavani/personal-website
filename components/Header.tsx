'use client';

import { useTheme } from './ThemeProvider';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/[0.04] dark:border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" className="text-xl font-light tracking-tight hover:opacity-50 transition-opacity duration-300">
          Sam Shahsavani
        </a>

        <nav className="flex items-center gap-8">
          <a
            href="/#projects"
            className="text-sm text-muted hover:text-black dark:hover:text-white transition-colors duration-300 hidden md:block"
          >
            Projects
          </a>
          <a
            href="/#about"
            className="text-sm text-muted hover:text-black dark:hover:text-white transition-colors duration-300 hidden md:block"
          >
            About
          </a>
          <a
            href="/#contact"
            className="text-sm text-muted hover:text-black dark:hover:text-white transition-colors duration-300 hidden md:block"
          >
            Contact
          </a>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-300"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
