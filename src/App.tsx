import { useState, useEffect } from 'react';
import { Search, Trophy, AlertCircle, RefreshCw, Star, Info, ShieldAlert } from 'lucide-react';
import Header from './components/Header';
import SearchBox from './components/SearchBox';
import ProfileCard from './components/ProfileCard';
import RepoList from './components/RepoList';
import BattleMode from './components/BattleMode';
import { fetchGitHubUser, fetchGitHubUserRepos } from './utils';
import { GitHubUser, GitHubRepo } from './types';

export default function App() {
  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // App mode: 'search' | 'battle'
  const [activeTab, setActiveTab] = useState<'search' | 'battle'>('search');

  // Search profile states
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Apply dark mode theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Load default user "octocat" on mount
  useEffect(() => {
    handleProfileSearch('octocat');
  }, []);

  const handleProfileSearch = async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUser = await fetchGitHubUser(username);
      setUser(fetchedUser);

      // Fetch user's repos to calculate total stars and render latest projects
      try {
        const fetchedRepos = await fetchGitHubUserRepos(fetchedUser.repos_url);
        setRepos(fetchedRepos);
      } catch (repoError) {
        console.error('Failed to load user repositories:', repoError);
        setRepos([]);
      }
    } catch (err: any) {
      console.error(err);
      setUser(null);
      setRepos([]);
      setError(err.message || 'User Not Found');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total stargazers from repo array
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-16">
      <div className="w-full max-w-4xl mx-auto px-4 pt-6 md:pt-10">
        
        {/* App Header & Settings */}
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Tab Selection Switcher */}
        <div className="flex p-1 bg-slate-200/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl mb-8 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === 'search'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Profile Detective</span>
          </button>
          <button
            onClick={() => setActiveTab('battle')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === 'battle'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Developer Battle</span>
          </button>
        </div>

        {/* Core Screen Router */}
        <main className="w-full">
          {activeTab === 'search' ? (
            <div className="space-y-6">
              {/* Profile Search input */}
              <SearchBox onSearch={handleProfileSearch} isLoading={loading} />

              {/* Error Handling State */}
              {error && (
                <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-xs animate-in fade-in duration-200">
                  <div className="inline-flex p-3 bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-full mb-3">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
                    {error === 'User Not Found' ? 'User Not Found' : 'Query Failed'}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
                    {error === 'User Not Found'
                      ? 'The GitHub username you entered does not exist. Please check spelling and try again.'
                      : error}
                  </p>
                  <button
                    onClick={() => handleProfileSearch('octocat')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset to default (octocat)</span>
                  </button>
                </div>
              )}

              {/* Skeleton loading placeholders */}
              {loading && (
                <div className="space-y-6">
                  {/* Profile Card loading */}
                  <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 animate-pulse">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                      <div className="w-24 h-24 md:w-28 md:h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl shrink-0" />
                      <div className="flex-1 w-full space-y-3">
                        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3 mx-auto md:mx-0" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4 mx-auto md:mx-0" />
                        <div className="h-4 bg-slate-100 dark:bg-slate-850 rounded-md w-3/4 mx-auto md:mx-0 pt-2" />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-8 h-16 bg-slate-50 dark:bg-slate-950/50 rounded-xl" />
                  </div>
                </div>
              )}

              {/* Success Render states */}
              {!loading && !error && user && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <ProfileCard user={user} totalStars={totalStars} />
                  <RepoList repos={repos} isLoading={loading} />
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <BattleMode />
            </div>
          )}
        </main>

        {/* Dynamic Warning footer */}
        <footer className="mt-12 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
            <Info className="w-3.5 h-3.5" />
            <span>Fetches live data directly from the GitHub REST API v3</span>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 font-medium font-display">
            Built with ❤️ by <span className="font-semibold text-indigo-600 dark:text-indigo-400">Alok Kumar Mishra</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
