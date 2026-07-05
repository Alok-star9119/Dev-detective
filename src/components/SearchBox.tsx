import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBoxProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  placeholder?: string;
  initialValue?: string;
}

export default function SearchBox({ onSearch, isLoading, placeholder = 'Search GitHub username...', initialValue = '' }: SearchBoxProps) {
  const [username, setUsername] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 transition-all duration-300">
        <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 ml-3 shrink-0" />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          placeholder={placeholder}
          className="w-full pl-3 pr-2 py-3 bg-transparent text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-base font-sans focus:outline-hidden disabled:opacity-75"
        />
        
        {username && !isLoading && (
          <button
            type="button"
            onClick={() => setUsername('')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors cursor-pointer mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading || !username.trim()}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium text-sm transition-all shadow-xs hover:shadow-md disabled:opacity-50 disabled:hover:bg-indigo-600 dark:disabled:hover:bg-indigo-500 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Searching</span>
            </div>
          ) : (
            'Search'
          )}
        </button>
      </div>
    </form>
  );
}
