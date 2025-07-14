
import React from 'react';
import { SunIcon, MoonIcon, SearchIcon } from './Icons';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, searchQuery, setSearchQuery }) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Bark Secret Trends
            </h1>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-text-secondary-light dark:text-text-secondary-dark" />
              </span>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-32 sm:w-48 md:w-64 pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
              />
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-offset-background-dark"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
