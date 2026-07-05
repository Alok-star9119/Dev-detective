import React, { useState, useEffect } from 'react';
import { Sun, Moon, Shield, Settings, Info, Check, Github, X } from 'lucide-react';
import { getStoredToken, setStoredToken } from '../utils';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Header({ darkMode, setDarkMode }: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTokenInput(getStoredToken());
  }, []);

  const handleSaveToken = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredToken(tokenInput.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowSettings(false);
    }, 1500);
  };

  const handleClearToken = () => {
    setStoredToken('');
    setTokenInput('');
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <header className="relative z-10 w-full mb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 md:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Github className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 dark:text-white tracking-tight">
              Dev<span className="text-indigo-600 dark:text-indigo-400">-Detective</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              GitHub Profile Explorer &amp; Repository Battle Mode
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Settings / Token button */}
          <button
            onClick={() => setShowSettings(true)}
            title="Configure GitHub Token"
            className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 cursor-pointer"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 cursor-pointer"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* GitHub Token Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                GitHub Authentication
              </h2>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              GitHub restricts anonymous API requests to 60 per hour. Add a{' '}
              <strong className="text-slate-900 dark:text-slate-200">Personal Access Token (classic or fine-grained)</strong>{' '}
              to expand your limit to 5,000 requests per hour!
            </p>

            <form onSubmit={handleSaveToken} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Personal Access Token (PAT)
                </label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all font-mono"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-700 dark:text-amber-300 text-xs leading-relaxed">
                <Info className="w-4 h-4 shrink-0" />
                <span>
                  Your token is saved exclusively inside your browser&apos;s localStorage and is sent directly to GitHub.
                </span>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={handleClearToken}
                  className="px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl font-medium transition-colors cursor-pointer"
                >
                  Clear Token
                </button>
                <button
                  type="submit"
                  disabled={saved}
                  className="px-5 py-2.5 text-sm bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:bg-emerald-600 dark:disabled:bg-emerald-500"
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4" />
                      Saved!
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
