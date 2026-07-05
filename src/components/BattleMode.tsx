import React, { useState } from 'react';
import { Search, Trophy, AlertTriangle, ArrowRight, Sparkles, RefreshCw, Star, Users, FolderGit2, Calendar } from 'lucide-react';
import { fetchGitHubUser, fetchGitHubUserRepos, formatDate } from '../utils';
import { GitHubUser, GitHubRepo } from '../types';

export default function BattleMode() {
  const [username1, setUsername1] = useState('');
  const [username2, setUsername2] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Battle results state
  const [user1, setUser1] = useState<GitHubUser | null>(null);
  const [user2, setUser2] = useState<GitHubUser | null>(null);
  const [stars1, setStars1] = useState<number>(0);
  const [stars2, setStars2] = useState<number>(0);
  const [repos1Count, setRepos1Count] = useState<number>(0);
  const [repos2Count, setRepos2Count] = useState<number>(0);

  const handleBattle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username1.trim() || !username2.trim()) {
      setError('Please provide two valid GitHub usernames to battle!');
      return;
    }

    if (username1.trim().toLowerCase() === username2.trim().toLowerCase()) {
      setError('A developer cannot battle themselves! Provide two different usernames.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Query profiles and repositories in parallel via Promise.all
      const [u1, u2] = await Promise.all([
        fetchGitHubUser(username1).catch(err => {
          throw new Error(`User "${username1}" could not be fetched: ${err.message}`);
        }),
        fetchGitHubUser(username2).catch(err => {
          throw new Error(`User "${username2}" could not be fetched: ${err.message}`);
        })
      ]);

      const [r1, r2] = await Promise.all([
        fetchGitHubUserRepos(u1.repos_url).catch(() => [] as GitHubRepo[]),
        fetchGitHubUserRepos(u2.repos_url).catch(() => [] as GitHubRepo[])
      ]);

      // Calculate total stargazers_count for each user
      const totalStars1 = r1.reduce((sum, r) => sum + r.stargazers_count, 0);
      const totalStars2 = r2.reduce((sum, r) => sum + r.stargazers_count, 0);

      setUser1(u1);
      setUser2(u2);
      setStars1(totalStars1);
      setStars2(totalStars2);
      setRepos1Count(u1.public_repos);
      setRepos2Count(u2.public_repos);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during the GitHub Battle.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUser1(null);
    setUser2(null);
    setUsername1('');
    setUsername2('');
    setStars1(0);
    setStars2(0);
    setError(null);
  };

  // Determine winners
  const isFinished = user1 && user2;
  const isTie = stars1 === stars2;
  const isUser1Winner = stars1 > stars2;
  const isUser2Winner = stars2 > stars1;

  // Additional metric checks
  const followers1 = user1?.followers || 0;
  const followers2 = user2?.followers || 0;
  const isFollowers1Winner = followers1 > followers2;
  const isFollowers2Winner = followers2 > followers1;

  const repoCount1 = user1?.public_repos || 0;
  const repoCount2 = user2?.public_repos || 0;
  const isRepoCount1Winner = repoCount1 > repoCount2;
  const isRepoCount2Winner = repoCount2 > repoCount1;

  return (
    <div className="w-full space-y-6">
      {/* Battle Setup panel */}
      {!isFinished && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8">
          <div className="text-center max-w-xl mx-auto mb-6">
            <div className="inline-flex p-3 bg-rose-500/10 dark:bg-rose-400/10 rounded-2xl text-rose-600 dark:text-rose-400 mb-3">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl md:text-2xl text-slate-900 dark:text-white">
              GitHub Repository Battle Mode
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Enter two GitHub usernames. We will fetch their repository datasets and calculate their Total Stargazers to declare the ultimate open-source winner!
            </p>
          </div>

          <form onSubmit={handleBattle} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center relative">
              {/* VS Divider in middle */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-indigo-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full font-display font-bold text-xs text-indigo-600 dark:text-indigo-400 shadow-xs">
                VS
              </div>

              {/* Player 1 input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Player 1 Username
                </label>
                <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                  <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
                  <input
                    type="text"
                    value={username1}
                    onChange={(e) => setUsername1(e.target.value)}
                    disabled={loading}
                    placeholder="e.g. octocat"
                    className="w-full pl-3 pr-3 py-3 bg-transparent text-slate-950 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden disabled:opacity-75"
                  />
                </div>
              </div>

              {/* Player 2 input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Player 2 Username
                </label>
                <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                  <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
                  <input
                    type="text"
                    value={username2}
                    onChange={(e) => setUsername2(e.target.value)}
                    disabled={loading}
                    placeholder="e.g. torvalds"
                    className="w-full pl-3 pr-3 py-3 bg-transparent text-slate-950 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden disabled:opacity-75"
                  />
                </div>
              </div>
            </div>

            {/* Error state */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-700 dark:text-rose-400 text-sm leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Battle Trigger */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading || !username1.trim() || !username2.trim()}
                className="w-full md:w-auto px-10 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-display font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Analysing Repo Star Data...</span>
                  </>
                ) : (
                  <>
                    <span>Initiate Open Source Battle</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Battle Results Visual Display */}
      {isFinished && user1 && user2 && (
        <div className="space-y-6">
          {/* Header Action bar */}
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-lg text-slate-800 dark:text-slate-200">
              Battle Outcome Overview
            </h4>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold tracking-wide transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Battle</span>
            </button>
          </div>

          {/* Winner/Loser Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            
            {/* Player 1 Card */}
            <div
              className={`border rounded-2xl p-6 md:p-8 bg-white dark:bg-slate-900 shadow-sm transition-all ${
                isTie
                  ? 'border-indigo-500 shadow-indigo-100 dark:shadow-none'
                  : isUser1Winner
                  ? 'border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-emerald-50'
                  : 'border-rose-300 dark:border-rose-950 opacity-90'
              }`}
            >
              {/* Badge Status */}
              <div className="flex items-center justify-between mb-6">
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  isTie 
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400' 
                    : isUser1Winner 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400' 
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400'
                }`}>
                  {isTie ? 'Tie Position' : isUser1Winner ? '🏆 Ultimate Winner' : 'Loser'}
                </span>
                <span className="text-xs font-mono text-slate-500">Player 1</span>
              </div>

              {/* Profile Details */}
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={user1.avatar_url}
                  alt={user1.login}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-slate-100 dark:border-slate-850 bg-slate-50"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-tight">
                    {user1.name || user1.login}
                  </h4>
                  <a
                    href={user1.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    @{user1.login}
                  </a>
                </div>
              </div>

              {/* Metric Comparison Breakdowns */}
              <div className="space-y-4">
                {/* Total Stars */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  isTie
                    ? 'bg-indigo-500/5 border-indigo-500/10'
                    : isUser1Winner
                    ? 'bg-emerald-500/5 border-emerald-500/10'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-850'
                }`}>
                  <div className="flex items-center gap-2">
                    <Star className={`w-4.5 h-4.5 ${isUser1Winner ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Total Stars</span>
                  </div>
                  <span className={`font-mono font-bold text-lg ${isUser1Winner ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {stars1}
                  </span>
                </div>

                {/* Followers */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  isFollowers1Winner
                    ? 'bg-emerald-500/5 border-emerald-500/10'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-850'
                }`}>
                  <div className="flex items-center gap-2">
                    <Users className={`w-4.5 h-4.5 ${isFollowers1Winner ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Followers</span>
                  </div>
                  <span className={`font-mono font-bold text-sm ${isFollowers1Winner ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {followers1}
                  </span>
                </div>

                {/* Public Repos */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  isRepoCount1Winner
                    ? 'bg-emerald-500/5 border-emerald-500/10'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-850'
                }`}>
                  <div className="flex items-center gap-2">
                    <FolderGit2 className={`w-4.5 h-4.5 ${isRepoCount1Winner ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Repositories</span>
                  </div>
                  <span className={`font-mono font-bold text-sm ${isRepoCount1Winner ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {repoCount1}
                  </span>
                </div>

                {/* Date Joined */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4.5 h-4.5" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Account Age</span>
                  </div>
                  <span className="font-mono text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {formatDate(user1.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Player 2 Card */}
            <div
              className={`border rounded-2xl p-6 md:p-8 bg-white dark:bg-slate-900 shadow-sm transition-all ${
                isTie
                  ? 'border-indigo-500 shadow-indigo-100 dark:shadow-none'
                  : isUser2Winner
                  ? 'border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-emerald-50'
                  : 'border-rose-300 dark:border-rose-950 opacity-90'
              }`}
            >
              {/* Badge Status */}
              <div className="flex items-center justify-between mb-6">
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  isTie 
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400' 
                    : isUser2Winner 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400' 
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400'
                }`}>
                  {isTie ? 'Tie Position' : isUser2Winner ? '🏆 Ultimate Winner' : 'Loser'}
                </span>
                <span className="text-xs font-mono text-slate-500">Player 2</span>
              </div>

              {/* Profile Details */}
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={user2.avatar_url}
                  alt={user2.login}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-slate-100 dark:border-slate-850 bg-slate-50"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-tight">
                    {user2.name || user2.login}
                  </h4>
                  <a
                    href={user2.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    @{user2.login}
                  </a>
                </div>
              </div>

              {/* Metric Comparison Breakdowns */}
              <div className="space-y-4">
                {/* Total Stars */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  isTie
                    ? 'bg-indigo-500/5 border-indigo-500/10'
                    : isUser2Winner
                    ? 'bg-emerald-500/5 border-emerald-500/10'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-850'
                }`}>
                  <div className="flex items-center gap-2">
                    <Star className={`w-4.5 h-4.5 ${isUser2Winner ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Total Stars</span>
                  </div>
                  <span className={`font-mono font-bold text-lg ${isUser2Winner ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {stars2}
                  </span>
                </div>

                {/* Followers */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  isFollowers2Winner
                    ? 'bg-emerald-500/5 border-emerald-500/10'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-850'
                }`}>
                  <div className="flex items-center gap-2">
                    <Users className={`w-4.5 h-4.5 ${isFollowers2Winner ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Followers</span>
                  </div>
                  <span className={`font-mono font-bold text-sm ${isFollowers2Winner ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {followers2}
                  </span>
                </div>

                {/* Public Repos */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  isRepoCount2Winner
                    ? 'bg-emerald-500/5 border-emerald-500/10'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-850'
                }`}>
                  <div className="flex items-center gap-2">
                    <FolderGit2 className={`w-4.5 h-4.5 ${isRepoCount2Winner ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Repositories</span>
                  </div>
                  <span className={`font-mono font-bold text-sm ${isRepoCount2Winner ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {repoCount2}
                  </span>
                </div>

                {/* Date Joined */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4.5 h-4.5" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Account Age</span>
                  </div>
                  <span className="font-mono text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {formatDate(user2.created_at)}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
